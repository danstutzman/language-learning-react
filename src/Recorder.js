// @flow
import React from 'react'
import type {Recording} from './services/recorder/Recording.js'

type Props = {|
  log: (event: string, details?: {}) => void,
  recordings: Array<Recording>,
  startRecording: (timeslice?: number) => void,
  stopRecording: () => void,
|}

type State = {|
  isRecording: boolean,
|}

export default class Recorder extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isRecording: false,
    }
  }

  onClickStartRecording = () => {
    this.props.log('RecorderOnClickStartRecording')
    this.setState({ isRecording: true })
    this.props.startRecording()
  }

  onClickStopRecording = () => {
    this.props.log('RecorderOnClickStopRecording')
    this.setState({ isRecording: false })
    this.props.stopRecording()
  }

  render() {
    return <div>
      <button onClick={this.onClickStartRecording}>Start Recording</button>
      <button onClick={this.onClickStopRecording}>Stop Recording</button>
      <ol>
        {this.props.recordings.map((recording, i) =>
          <li key={i}>
            <audio src={recording.blobUrl} controls={true} />
            , size={recording.size}
            , type={recording.mimeType}
          </li>)}
      </ol>
    </div>
  }
}
