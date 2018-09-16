// @flow
/* eslint no-console: 0 */
// Based from https://github.com/kaliatech/web-audio-recording-tests

import React from 'react'

const MIME_TYPES = [
  'audio/aac',
  'audio/mp4',
  'audio/mpeg',
  'audio/vorbis',
  'audio/wav',
  'audio/webm',
  'audio/webm;codecs=opus',
  'audio/wav',
  'audio/x-wav',
  'audio/vnd.wav',

  'video/quicktime',
  'video/webm',
  'video/webm;codecs=vp8',
  'video/webm;codecs=vp9',
  'video/webm;codecs=h264',
  'video/mp4',
]

function exists(input: any): string {
  return input ? 'true' : 'false'
}

type Device = {|
  id: string,
  kind: string,
  deviceId: string,
  label: string,
|}

function enumerateDevices(): Promise<Array<Device>> {
  return (navigator.mediaDevices: any).enumerateDevices()
    .then((devices) =>
      devices.map((device) =>
        ({ id: device.id, kind: device.kind, deviceId: device.deviceId,
          label: device.label }))
    ).catch((error) => {
      console.log(error)
      return [{id: '-', kind: 'error', deviceId: 'error'}]
    })
}

function setupAvailDeviceNames(enumeratedDevices: Array<Device>):
  { enumeratedDevicesPermissionNeeded: boolean,
    availableDeviceNames: Array<string> } {
  let enumeratedDevicesPermissionNeeded = false
  let availableDeviceNames = []
  enumeratedDevices.forEach((device, idx) => {
    if (device.kind === 'audioinput') {
      console.log('device', device)
      if (!device.label) {
        enumeratedDevicesPermissionNeeded = true
        availableDeviceNames.push('Input ' + idx + ' (' + device.deviceId + ')')
      }
      else {
        availableDeviceNames.push(device.label)
      }
    }
  })
  return { enumeratedDevicesPermissionNeeded, availableDeviceNames }
}

type Detail = {|
  name: string,
  value: string,
|}

function requestDevicePermissions(): Promise<{
  enumeratedDevicesPermissionNeeded?: boolean,
  availableDeviceNames?: Array<string>,
  defaultDeviceDetails: Array<Detail>,
  stream?: any,
}> {
  return (navigator.mediaDevices: any)
    .getUserMedia({audio: true})
    .then((stream) => {
      console.log('stream', stream)

      const d = []
      const tracks = stream.getAudioTracks()
      console.log('tracks', tracks)
      tracks.forEach((track, trackIdx) => {
        let th = 'track[' + trackIdx + '].'
        d.push({name: th + 'label', value: track.label})
        d.push({name: th + 'kind', value: track.kind})
        d.push({name: th + 'muted', value: track.muted})

        try {
          let constraints = track.getConstraints()
          console.log('constraints', constraints)
          for (let key in constraints) {
            d.push({name: th + 'constr[' + key + ']', value: constraints[key]})
          }
        } catch (e) {
          console.log('Error from getConstraints', e)
        }

        try {
          let capabilities = track.getCapabilities()
          console.log('capabilities', capabilities)
          for (let key in capabilities) {
            d.push({name: th + 'capab[' + key + ']', value: capabilities[key]})
          }
        } catch (e) {
          console.log('Error from getCapabilities', e)
        }

        try {
          let settings = track.getSettings()
          console.log('settings', settings)
          for (let key in settings) {
            d.push({name: th + 'settings[' + key + ']', value: settings[key]})
          }
        } catch (e) {
          console.log('Error from getSettings', e)
        }
      })

      return enumerateDevices().then(enumeratedDevices => ({
        ...setupAvailDeviceNames(enumeratedDevices),
        defaultDeviceDetails: d,
        stream,
      }))
    }).catch(e => {
      console.log('Error in requestDevicePermissions', e)
      return { defaultDeviceDetails: [] }
    })
}

function revokeDevicePermissions(stream: any) {
  if (stream !== null) {
    stream.getTracks().forEach((track) => track.stop())
    stream = null
  }
}

function getSupportedMimeTypes(): Array<string> {
  const mediaRecorder = window.MediaRecorder
  if (typeof mediaRecorder !== 'undefined' && mediaRecorder.isTypeSupported) {
    return MIME_TYPES.filter(type => mediaRecorder.isTypeSupported(type))
  } else {
    console.log('(manual encoding required)')
    return []
  }
}

function getSupportedDeviceConstraints(): Array<string> {
  const supportedDeviceConstraints: Array<string> = []
  const supportedConstraints =
    (navigator.mediaDevices: any).getSupportedConstraints()
  for (let constraint in supportedConstraints) {
    if (supportedConstraints.hasOwnProperty(constraint) &&
      supportedConstraints[constraint] === true) {
      supportedDeviceConstraints.push(constraint)
    }
  }
  return supportedDeviceConstraints
}

type State = {|
  audioContextStr: string,
  webkitAudioContextStr: string,
  mediaDevicesStr: string,
  getUserMediaStr: string,
  mediaRecorderOrigStr: string,
  analyserNode: string,
  dynamicsCompressorNode: string,
  availableDeviceNames: Array<string>,
  enumeratedDevicesPermissionNeeded: boolean,
  enumeratedDevicesPermissionRevokable: boolean,
  defaultDeviceDetails: Array<Detail>,
  stream: any,
  supportedMimeTypes: Array<string>,
  supportedDeviceConstraints: Array<string>,
|}

export default class Diagnostics extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props)
    this.state = {
      audioContextStr: exists(window.AudioContext),
      webkitAudioContextStr: exists(window.webkitAudioContext),
      mediaDevicesStr: exists(navigator.mediaDevices),
      getUserMediaStr: exists(navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia),
      mediaRecorderOrigStr: exists(window.MediaRecorder),
      analyserNode: exists(window.AnalyserNode),
      dynamicsCompressorNode: exists(window.DynamicsCompressorNode),
      availableDeviceNames: [],
      enumeratedDevicesPermissionNeeded: false,
      enumeratedDevicesPermissionRevokable: false,
      defaultDeviceDetails: [],
      stream: null,
      supportedMimeTypes: getSupportedMimeTypes(),
      supportedDeviceConstraints: getSupportedDeviceConstraints(),
    }
    enumerateDevices()
      .then(enumeratedDevices =>
        this.setState(setupAvailDeviceNames(enumeratedDevices)))
      .then(output => this.setState(output))
    this.onClickRequestDevicePermissions()
  }

  onClickRequestDevicePermissions = () =>
    requestDevicePermissions().then(output => {
      if (output.stream !== undefined) {
        this.setState({
          ...output,
          enumeratedDevicesPermissionNeeded: false,
          enumeratedDevicesPermissionRevokable: true,
        })
      }
    })

  onClickRevokeDevicePermissions = () => {
    revokeDevicePermissions(this.state.stream)
    enumerateDevices()
      .then(enumeratedDevices => this.setState({
        ...setupAvailDeviceNames(enumeratedDevices),
        enumeratedDevicesPermissionRevokable: false,
      }))
  }

  renderWebAudioRecordingSupport = () => <div>
    <h4>Web Audio Recording Support</h4>
    <ul>
      <li>AudioContext: {this.state.audioContextStr}</li>
      <li>webkitAudioContext: {this.state.webkitAudioContextStr}</li>
      <li>mediaDevices: {this.state.mediaDevicesStr}</li>
      <li>getUserMedia: {this.state.getUserMediaStr}</li>
      <li>MediaRecorder: {this.state.mediaRecorderOrigStr}</li>
      <li>AnalyserNode: {this.state.analyserNode}</li>
      <li>DynamicsCompressorNode: {this.state.dynamicsCompressorNode}</li>
    </ul>
  </div>

  renderAudioInputDevices = () => <div>
    <h4>Audio Input Devices</h4>
    <ul>
      {this.state.availableDeviceNames.map((name) =>
        <li key={name}>{name}</li>)}
    </ul>

    {this.state.enumeratedDevicesPermissionNeeded &&
      <button onClick={this.onClickRequestDevicePermissions}>
        Request Default Device Permission
      </button>}

    {this.state.enumeratedDevicesPermissionNeeded &&
      <div>Needed to get device labels</div>}

    {this.state.enumeratedDevicesPermissionRevokable &&
      <button onClick={this.onClickRevokeDevicePermissions}>
        Revoke Default Device Permission
      </button>}
  </div>

  renderSupportedDeviceConstraints = () => <div>
    <h4>Supported Device Constraints</h4>
    <ul>
      {this.state.supportedDeviceConstraints.map(constraint =>
        <li key={constraint}>{constraint}</li>)}
    </ul>
  </div>

  renderDefaultCapabilitiesConstraintsAndSettings = () => <div>
    <h4>Default Capabilities, Constraints, & Settings</h4>
    <ul>
      {this.state.defaultDeviceDetails.map(detail =>
        <li key={detail.name}>
          {detail.name}:
          {JSON.stringify(detail.value)}
        </li>)}
    </ul>
  </div>

  renderSupportedMediaRecorderMimeTypes = () => <div>
    <h4>Supported MediaRecorder Mime Types</h4>
    <ul>
      {this.state.supportedMimeTypes.map(mimeType =>
        <li key={mimeType}>{mimeType}</li>)}
    </ul>
  </div>

  render() {
    return <div>
      <h2>Browser Diagnostics</h2>
      {this.renderWebAudioRecordingSupport()}
      {this.renderAudioInputDevices()}
      {this.renderSupportedDeviceConstraints()}
      {this.renderDefaultCapabilitiesConstraintsAndSettings()}
      {this.renderSupportedMediaRecorderMimeTypes()}
    </div>
  }
}
