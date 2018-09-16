// @flow
import './App.css'
import Diagnostics from './Diagnostics.js'
import { HashRouter } from 'react-router-dom'
import Home from './Home.js'
import { Link } from 'react-router-dom'
import Preferences from './Preferences.js'
import React from 'react'
import Recorder from './Recorder.js'
import RecorderService from './recorder/RecorderService.js'
import type {Recording} from './Recording.js'
import { Route } from 'react-router-dom'
import Topics from './Topics.js'

type Props = {|
  arabicVoices: Array<{| lang: string, name: string |}>,
  speakText: (script: string, selectedVoiceName: string | null) => void,
|}

type State = {|
  recordings: Array<Recording>,
  selectedVoiceName: string | null,
|}

export default class App extends React.Component<Props, State> {
  recorderService: RecorderService

  constructor(props: Props) {
    super(props)

    this.state = {
      recordings: [],
      selectedVoiceName: props.arabicVoices[0] ?
        props.arabicVoices[0].name : null,
    }

    this.recorderService = new RecorderService('BASE_URL')
    this.recorderService.em.addEventListener('recording', (e) =>
      this.setState(prevState => ({
        recordings: prevState.recordings.concat([(e: any).detail.recording]),
      })))
  }

  onClickStartRecording = () =>
    this.recorderService.startRecording()

  onClickStopRecording = () =>
    this.recorderService.stopRecording()

  speakTextForHome = (script: string) => {
    this.props.speakText(script, this.state.selectedVoiceName)
  }

  renderHome = () =>
    <Home
      speakText={this.speakTextForHome} />

  renderDiagnostics = () => <Diagnostics />

  renderPreferences = () =>
    <Preferences
      selectedVoiceName={this.state.selectedVoiceName}
      setSelectedVoiceName={this.setSelectedVoiceNameForPreferences} />

  renderRecorder = () =>
    <Recorder
      recordings={this.state.recordings}
      startRecording={this.onClickStartRecording}
      stopRecording={this.onClickStopRecording} />

  setSelectedVoiceNameForPreferences = (selectedVoiceName: string) =>
    this.setState({ selectedVoiceName })

  render() {
    return <HashRouter>
      <div className="App">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/diagnostics">Diagnostics</Link>
          </li>
          <li>
            <Link to="/preferences">Preferences</Link>
          </li>
          <li>
            <Link to="/recorder">Recorder</Link>
          </li>
          <li>
            <Link to="/topics">Topics</Link>
          </li>
        </ul>
        <hr />

        <Route exact path="/" render={this.renderHome} />
        <Route path="/diagnostics" render={this.renderDiagnostics} />
        <Route path="/preferences" render={this.renderPreferences} />
        <Route path="/recorder" render={this.renderRecorder} />
        <Route path="/topics" component={Topics} />
      </div>
    </HashRouter>
  }
}
