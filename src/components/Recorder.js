// @flow
import React from 'react'
import type {RecorderProps} from '../index.js'

type Props = {|
  log: (event: string, details?: {}) => void,
  recorder: RecorderProps,
|}

export default class Recorder extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.log('VisitRecorder')
  }

  render() {
    return <div>
      <button onClick={this.props.recorder.startRecording}>
        Start Recording
      </button>
      <button onClick={this.props.recorder.stopRecording}>
        Stop Recording
      </button>
      <ol>
        {this.props.recorder.recordings.map((recording, i) =>
          <li key={i}>
            <audio src={recording.blobUrl} controls={true} />
            , size={recording.size}
            , type={recording.mimeType}
          </li>)}
      </ol>
    </div>
  }
}
