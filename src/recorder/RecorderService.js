// @flow
/* eslint no-console: 0 */
import EncoderWav from './encoder-wav-worker.js'
import EncoderMp3 from './encoder-mp3-worker.js'
import EncoderOgg from './encoder-ogg-worker.js'

export default class RecorderService {
  baseUrl: string
  em: DocumentFragment
  state: 'inactive' | 'recording'
  chunks: Array<number>
  chunkType: string | null
  usingMediaRecorder: boolean
  encoderMimeType: 'audio/wav' | 'audio/ogg' | 'audio/mpeg'
  config: {
    broadcastAudioProcessEvents: boolean,
    createAnalyserNode: boolean,
    createDynamicsCompressorNode: boolean,
    forceScriptProcessor: boolean,
    manualEncoderId: 'wav',
    micGain: number,
    processorBufferSize: number,
    stopTracksAndCloseCtxWhenFinished: boolean,
    userMediaConstraints: {audio: boolean},
  }
  processorNode: ScriptProcessorNode | null
  outputGainNode: GainNode | null
  analyserNode: AudioNode | null
  destinationNode: AudioDestinationNode | null
  micGainNode: GainNode | null
  dynamicsCompressorNode: AudioNode | null
  inputStreamNode: AudioNode | null
  mediaRecorder: MediaRecorder
  audioCtx: AudioContext | null
  encoderWorker: Worker | null
  micAudioStream: any
  slicing: IntervalID
  onGraphSetupWithInputStream: (AudioNode) => void | void
  log: (event: string, details?: {}) => void

  constructor(baseUrl: string, log: (event: string, details?: {}) => void) {
    this.baseUrl = baseUrl

    window.AudioContext = window.AudioContext || window.webkitAudioContext

    this.em = document.createDocumentFragment()

    this.state = 'inactive'

    this.chunks = []
    this.chunkType = ''

    this.usingMediaRecorder = window.MediaRecorder || false

    this.encoderMimeType = 'audio/wav'

    this.config = {
      broadcastAudioProcessEvents: false,
      createAnalyserNode: false,
      createDynamicsCompressorNode: false,
      forceScriptProcessor: false,
      manualEncoderId: 'wav',
      micGain: 1.0,
      processorBufferSize: 2048,
      stopTracksAndCloseCtxWhenFinished: true,
      userMediaConstraints: {audio: true},
    }

    this.log = log
  }

  createWorker(fn: () => void) {
    var js = fn
      .toString()
      .replace(/^function\s*\(\)\s*{/, '')
      .replace(/}$/, '')
    var blob = new Blob([js])
    return new Worker(URL.createObjectURL(blob))
  }

  startRecording = (timeslice?: number) => {
    if (this.state !== 'inactive') {
      return
    }

    // This is the case on ios/chrome, when clicking links from within ios/slack (sometimes), etc.
    if (!navigator || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Missing support for navigator.mediaDevices.getUserMedia') // temp: helps when testing for strange issues on ios/safari
      return
    }

    const audioCtx = new AudioContext()
    this.audioCtx = audioCtx
    this.micGainNode = audioCtx.createGain()
    this.outputGainNode = audioCtx.createGain()

    if (this.config.createDynamicsCompressorNode) {
      this.dynamicsCompressorNode = audioCtx.createDynamicsCompressor()
    }

    if (this.config.createAnalyserNode) {
      this.analyserNode = audioCtx.createAnalyser()
    }

    // If not using MediaRecorder(i.e. safari and edge), then a script processor is required. It's optional
    // on browsers using MediaRecorder and is only useful if wanting to do custom analysis or manipulation of
    // recorded audio data.
    if (this.config.forceScriptProcessor || this.config.broadcastAudioProcessEvents || !this.usingMediaRecorder) {
      this.processorNode = audioCtx.createScriptProcessor(this.config.processorBufferSize, 1, 1) // TODO: Get the number of channels from mic
    }

    // Create stream destination on chrome/firefox because, AFAICT, we have no other way of feeding audio graph output
    // in to MediaRecorderSafari/Edge don't have this method as of 2018-04.
    if (audioCtx.createMediaStreamDestination) {
      this.destinationNode = (audioCtx.createMediaStreamDestination(): any)
    }
    else {
      this.destinationNode = audioCtx.destination
    }

    // Create web worker for doing the encoding
    if (!this.usingMediaRecorder) {
      if (this.config.manualEncoderId === 'mp3') {
        // This also works and avoids weirdness imports with workers
        // this.encoderWorker = new Worker(BASE_URL + '/workers/encoder-ogg-worker.js')
        this.encoderWorker = this.createWorker(EncoderMp3)
        this.encoderWorker.postMessage(['init', {baseUrl: this.baseUrl, sampleRate: audioCtx.sampleRate}])
        this.encoderMimeType = 'audio/mpeg'
      }
      else if (this.config.manualEncoderId === 'ogg') {
        this.encoderWorker = this.createWorker(EncoderOgg)
        this.encoderWorker.postMessage(['init', {baseUrl: this.baseUrl, sampleRate: audioCtx.sampleRate}])
        this.encoderMimeType = 'audio/ogg'
      }
      else {
        this.encoderWorker = this.createWorker(EncoderWav)
        this.encoderMimeType = 'audio/wav'
      }
      if (this.encoderWorker === null) {
        throw new Error('Null encoderWorker')
      }
      this.encoderWorker.addEventListener('message', (e: any) => {
        let data
        if (this.config.manualEncoderId === 'ogg') {
          data = e.data
        }
        else {
          data = new Blob(e.data, {type: this.encoderMimeType})
        }
        this._onDataAvailable(data)
      })
    }

    // This will prompt user for permission if needed
    this.log('BrowserGetUserMedia')
    return (navigator.mediaDevices: any).getUserMedia(this.config.userMediaConstraints)
      .then((stream) => {
        this.log('BrowserGetUserMediaSuccess')
        this._startRecordingWithStream(stream, timeslice)
      })
      .catch((error) => {
        this.log('BrowserGetUserMediaFailure', { error: error.message })
        // alert('Error with getUserMedia: ' + error.message) // temp: helps when testing for strange issues on ios/safari
      })
  }

  setMicGain (newGain: number) {
    this.config.micGain = newGain
    if (this.audioCtx && this.micGainNode) {
      this.micGainNode.gain.setValueAtTime(newGain, this.audioCtx.currentTime)
    }
  }

  _startRecordingWithStream (stream: any, timeslice?: number) {
    const processorNode = this.processorNode
    if (processorNode === null) {
      throw Error('Null processorNode')
    }
    const outputGainNode = this.outputGainNode
    if (outputGainNode === null) {
      throw Error('Null outputGainNode')
    }
    const micGainNode = this.micGainNode
    if (micGainNode === null) {
      throw new Error('Null micGainNode')
    }
    const destinationNode = this.destinationNode
    if (destinationNode === null) {
      throw Error('Null destinationNode')
    }

    this.micAudioStream = stream

    if (this.audioCtx === null) {
      throw new Error('Null audioCtx')
    }
    this.inputStreamNode = this.audioCtx.createMediaStreamSource(this.micAudioStream)
    this.audioCtx = this.inputStreamNode.context
    const audioCtx = this.audioCtx
    if (audioCtx === null) {
      throw new Error('Null audioCtx')
    }

    // Kind-of a hack to allow hooking in to audioGraph inputStreamNode
    if (this.onGraphSetupWithInputStream) {
      this.onGraphSetupWithInputStream(this.inputStreamNode)
    }

    this.inputStreamNode.connect(micGainNode)
    micGainNode.gain.setValueAtTime(this.config.micGain, audioCtx.currentTime)

    let nextNode: AudioNode = micGainNode
    if (this.dynamicsCompressorNode) {
      const dynamicsCompressorNode = this.dynamicsCompressorNode
      micGainNode.connect(dynamicsCompressorNode)
      nextNode = dynamicsCompressorNode
    }

    this.state = 'recording'

    if (this.processorNode) {
      const processorNode = this.processorNode
      nextNode.connect(processorNode)
      processorNode.connect(outputGainNode)
      processorNode.onaudioprocess = (e) => this._onAudioProcess(e)
    }
    else {
      nextNode.connect(outputGainNode)
    }

    if (this.analyserNode) {
      // TODO: If we want the analyser node to receive the processorNode's output, this needs to be changed _and_
      //       processor node needs to be modified to copy input to output. It currently doesn't because it's not
      //       needed when doing manual encoding.
      // this.processorNode.connect(this.analyserNode)
      nextNode.connect(this.analyserNode)
    }

    outputGainNode.connect(destinationNode)

    if (this.usingMediaRecorder) {
      this.mediaRecorder = new MediaRecorder((destinationNode: any).stream)
      this.mediaRecorder.addEventListener('dataavailable', (evt) => this._onDataAvailable(evt.data))
      this.mediaRecorder.addEventListener('error', (evt) => this._onError(evt))

      this.mediaRecorder.start(timeslice)
    }
    else {
      // Output gain to zero to prevent feedback. Seems to matter only on Edge, though seems like should matter
      // on iOS too.  Matters on chrome when connecting graph to directly to audioCtx.destination, but we are
      // not able to do that when using MediaRecorder.
      outputGainNode.gain.setValueAtTime(0, audioCtx.currentTime)
      // outputGainNode.gain.value = 0

      // Todo: Note that time slicing with manual wav encoderWav won't work. To allow it would require rewriting the encoderWav
      // to assemble all chunks at end instead of adding header to each chunk.
      if (timeslice) {
        console.log('Time slicing without MediaRecorder is not yet supported. The resulting recording will not be playable.')
        this.slicing = setInterval(function () {
          if (this.state === 'recording') {
            this.encoderWorker.postMessage(['dump', this.context.sampleRate])
          }
        }, timeslice)
      }
    }
  }

  _onAudioProcess (e: { inputBuffer: any, outputBuffer: any }) {
    // console.log('onaudioprocess', e)
    // let inputBuffer = e.inputBuffer
    // let outputBuffer = e.outputBuffer
    // console.log(this.micAudioStream)
    // console.log(this.audioCtx)
    // console.log(this.micAudioStream.getTracks().forEach((track) => console.log(track)))

    // this.onAudioEm.dispatch(new Event('onaudioprocess', {inputBuffer:inputBuffer,outputBuffer:outputBuffer}))

    if (this.config.broadcastAudioProcessEvents) {
      this.em.dispatchEvent(new CustomEvent('onaudioprocess', {
        detail: {
          inputBuffer: e.inputBuffer,
          outputBuffer: e.outputBuffer,
        },
      }))
    }

    // // Example handling:
    // let inputBuffer = e.inputBuffer
    // let outputBuffer = e.outputBuffer
    // // Each channel (usually only one)
    // for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
    //   let inputData = inputBuffer.getChannelData(channel)
    //   let outputData = outputBuffer.getChannelData(channel)
    //
    //   // Each sample
    //   for (let sample = 0; sample < inputBuffer.length; sample++) {
    //     // Make output equal to the same as the input (thus processor is doing nothing at this time)
    //     outputData[sample] = inputData[sample]
    //   }
    // }

    // When manually encoding (safari/edge), there's no reason to copy data to output buffer.  We set the output
    // gain to 0 anyways (which is required on Edge if we did copy data to output). However, if using a MediaRecorder
    // and a processor (all other browsers), then it would be required to copy the data otherwise the graph would
    // generate no data for the MediaRecorder to consume.
    // if (this.forceScriptProcessor) {

    // // Copy input to output
    // let inputBuffer = e.inputBuffer
    // let outputBuffer = e.outputBuffer
    // // This doesn't work on iOS/Safari. Guessing it doesn't have copyToChannel support, but haven't verified.
    // for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
    //   outputBuffer.copyToChannel(inputBuffer.getChannelData(channel), channel)
    // }

    // Safari and Edge require manual encoding via web worker. Single channel only for now.
    // Example stereo encoderWav: https://github.com/MicrosoftEdge/Demos/blob/master/microphone/scripts/recorderworker.js
    if (!this.usingMediaRecorder) {
      if (this.state === 'recording') {
        const encoderWorker = this.encoderWorker
        if (encoderWorker === null) {
          throw Error('Null encoderWorker')
        }
        if (this.config.broadcastAudioProcessEvents) {
          encoderWorker.postMessage(['encode', e.outputBuffer.getChannelData(0)])
        }
        else {
          encoderWorker.postMessage(['encode', e.inputBuffer.getChannelData(0)])
        }
      }
    }
  }

  stopRecording = () => {
    if (this.state === 'inactive') {
      return
    }
    if (this.usingMediaRecorder) {
      this.state = 'inactive'
      this.mediaRecorder.stop()
    }
    else {
      this.state = 'inactive'
      if (this.audioCtx === null) {
        throw Error('Null audioCtx')
      }
      if (this.encoderWorker === null) {
        throw Error('Null encoderWorker')
      }
      this.encoderWorker.postMessage(['dump', this.audioCtx.sampleRate])
      clearInterval(this.slicing)

      // TODO: There should be a more robust way to handle this
      // Without something like this, I think  the last recorded sample could be lost due to timing
      // setTimeout(() => {
      //   this.state = 'inactive'
      //   this.encoderWorker.postMessage(['dump', this.audioCtx.sampleRate])
      // }, 100)
    }
  }

  _onDataAvailable (data: any) {
    // console.log('state', this.mediaRecorder.state)
    // console.log('evt.data', evt.data)

    this.chunks.push(data)
    this.chunkType = data.type

    if (this.state !== 'inactive') {
      return
    }

    let blob = new Blob(this.chunks, {'type': this.chunkType})
    let blobUrl = URL.createObjectURL(blob)
    const recording = {
      ts: new Date().getTime(),
      blobUrl: blobUrl,
      mimeType: blob.type,
      size: blob.size,
    }

    this.chunks = []
    this.chunkType = null

    if (this.destinationNode) {
      this.destinationNode.disconnect()
      this.destinationNode = null
    }
    if (this.outputGainNode) {
      this.outputGainNode.disconnect()
      this.outputGainNode = null
    }
    if (this.analyserNode) {
      this.analyserNode.disconnect()
      this.analyserNode = null
    }
    if (this.processorNode) {
      this.processorNode.disconnect()
      this.processorNode = null
    }
    if (this.encoderWorker) {
      this.encoderWorker.postMessage(['close'])
      this.encoderWorker = null
    }
    if (this.dynamicsCompressorNode) {
      this.dynamicsCompressorNode.disconnect()
      this.dynamicsCompressorNode = null
    }
    if (this.micGainNode) {
      this.micGainNode.disconnect()
      this.micGainNode = null
    }
    if (this.inputStreamNode) {
      this.inputStreamNode.disconnect()
      this.inputStreamNode = null
    }

    if (this.config.stopTracksAndCloseCtxWhenFinished) {
      // This removes the red bar in iOS/Safari
      this.micAudioStream.getTracks().forEach((track) => track.stop())
      this.micAudioStream = null

      if (this.audioCtx === null) {
        throw Error('Null audioCtx')
      }
      this.audioCtx = null
    }

    this.em.dispatchEvent(new CustomEvent('recording', {detail: {recording: recording}}))
  }

  _onError (evt: any) {
    console.log('error', evt)
    this.em.dispatchEvent(new Event('error'))
    alert('error:' + evt) // for debugging purposes
  }
}
