// @flow
import './App.css'
import type {CardsProps} from '../services/CardsService.js'
import Diagnostics from './Diagnostics.js'
import { HashRouter } from 'react-router-dom'
import Home from './Home.js'
import { Link } from 'react-router-dom'
import type {PreferencesProps} from '../services/storage/PreferencesStorage.js'
import PreferencesScreen from './PreferencesScreen.js'
import React from 'react'
import Recorder from './Recorder.js'
import RecorderService from '../services/recorder/RecorderService.js'
import type {Recording} from '../services/recorder/Recording.js'
import { Route } from 'react-router-dom'
import type {SpeechSynthesisProps} from '../services/SpeechSynthesisService.js'
import Topics from './Topics.js'

type Props = {|
  cards: CardsProps,
  log: (event: string, details?: {}) => void,
  preferences: PreferencesProps,
  speechSynthesis: SpeechSynthesisProps,
|}

type State = {|
  recordings: Array<Recording>,
|}

export default class App extends React.PureComponent<Props, State> {
  recorderService: RecorderService

  constructor(props: Props) {
    super(props)

    this.recorderService = new RecorderService('BASE_URL', props.log)

    this.state = {
      recordings: [],
    }
  }

  componentDidMount() {
    this.recorderService.em.addEventListener('recording', this.onNewRecording)
  }

  componentWillUnmount() {
    this.recorderService.em.removeEventListener(
      'recording', this.onNewRecording)
  }

  onNewRecording = (e: any) =>
    this.setState(prevState => ({
      recordings: prevState.recordings.concat([e.detail.recording]),
    }))

  startRecording = () =>
    this.recorderService.startRecording()

  stopRecording = () =>
    this.recorderService.stopRecording()

  speakText = (script: string) =>
    this.props.speechSynthesis.speakText(script)

  renderHome = () =>
    <Home
      cards={this.props.cards}
      log={this.props.log}
      speechSynthesis={this.props.speechSynthesis} />

  renderDiagnostics = () =>
    <Diagnostics />

  renderPreferencesScreen = () =>
    <PreferencesScreen
      log={this.props.log}
      preferences={this.props.preferences} />

  renderRecorder = () =>
    <Recorder
      log={this.props.log}
      recordings={this.state.recordings}
      startRecording={this.startRecording}
      stopRecording={this.stopRecording} />

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

        <button onClick={this.props.cards.downloadCards}>
          Download cards (networkState={this.props.cards.networkState})
        </button>
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
