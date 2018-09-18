// @flow
import './App.css'
import Diagnostics from './Diagnostics.js'
import { HashRouter } from 'react-router-dom'
import Home from './Home.js'
import { Link } from 'react-router-dom'
import LogStorage from './services/storage/LogStorage.js'
import type {Preferences} from './services/storage/Preferences.js'
import PreferencesScreen from './PreferencesScreen.js'
import PreferencesStorage from './services/storage/PreferencesStorage.js'
import React from 'react'
import Recorder from './Recorder.js'
import RecorderService from './services/recorder/RecorderService.js'
import type {Recording} from './services/recorder/Recording.js'
import { Route } from 'react-router-dom'
import Topics from './Topics.js'

type Props = {|
  arabicVoices: Array<{| lang: string, name: string |}>,
  speakText: (script: string, selectedVoiceName: string | null) => void,
|}

type State = {|
  logs: Array<{}>,
  preferences: Preferences,
  recordings: Array<Recording>,
  selectedVoiceName: string | null,
|}

export default class App extends React.Component<Props, State> {
  logStorage: LogStorage
  preferencesStorage: PreferencesStorage
  recorderService: RecorderService

  constructor(props: Props) {
    super(props)

    this.logStorage = new LogStorage(window.localStorage)
    this.preferencesStorage = new PreferencesStorage(window.localStorage)

    this.state = {
      logs: this.logStorage.getTodaysLogs(),
      preferences: this.preferencesStorage.getPreferences(),
      recordings: [],
      selectedVoiceName: props.arabicVoices[0] ?
        props.arabicVoices[0].name : null,
    }

    this.recorderService = new RecorderService('BASE_URL', this.log)
    this.recorderService.em.addEventListener('recording', (e) =>
      this.setState(prevState => ({
        recordings: prevState.recordings.concat([(e: any).detail.recording]),
      })))
  }

  log = (event: string, details?: {}) => {
    const logs = this.logStorage.log(event, details)
    this.setState({ logs })
  }

  startRecording = () =>
    this.recorderService.startRecording()

  stopRecording = () =>
    this.recorderService.stopRecording()

  speakTextForHome = (script: string) => {
    this.props.speakText(script, this.state.selectedVoiceName)
  }

  renderHome = () =>
    <Home
      speakText={this.speakTextForHome} />

  renderDiagnostics = () => <Diagnostics />

  onSetPreferences = (preferences: Preferences) =>
    this.setState({
      preferences: this.preferencesStorage.setPreferences(preferences),
    })

  renderPreferencesScreen = () =>
    <PreferencesScreen
      preferences={this.state.preferences}
      setPreferences={this.onSetPreferences} />

  renderRecorder = () =>
    <Recorder
      log={this.log}
      recordings={this.state.recordings}
      startRecording={this.startRecording}
      stopRecording={this.stopRecording} />

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

        <ul>
          {this.state.logs.map((log, i) =>
            <li key={i}>{JSON.stringify(log)}</li>)}
        </ul>
        <hr />

        <Route exact path="/" render={this.renderHome} />
        <Route path="/diagnostics" render={this.renderDiagnostics} />
        <Route path="/preferences" render={this.renderPreferencesScreen} />
        <Route path="/recorder" render={this.renderRecorder} />
        <Route path="/topics" component={Topics} />
      </div>
    </HashRouter>
  }
}
