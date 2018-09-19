// @flow
import './App.css'
import type {Card} from '../services/CardsService.js'
import CardsService from '../services/CardsService.js'
import Diagnostics from './Diagnostics.js'
import { HashRouter } from 'react-router-dom'
import Home from './Home.js'
import { Link } from 'react-router-dom'
import LogStorage from '../services/storage/LogStorage.js'
import type {Preferences} from '../services/storage/Preferences.js'
import PreferencesScreen from './PreferencesScreen.js'
import PreferencesStorage from '../services/storage/PreferencesStorage.js'
import React from 'react'
import Recorder from './Recorder.js'
import RecorderService from '../services/recorder/RecorderService.js'
import type {Recording} from '../services/recorder/Recording.js'
import { Route } from 'react-router-dom'
import type {SpeechSynthesisProps} from '../services/SpeechSynthesisService.js'
import Topics from './Topics.js'

type Props = {|
  speechSynthesis: SpeechSynthesisProps,
|}

type State = {|
  cards: Array<Card>,
  logs: Array<{}>,
  preferences: Preferences,
  recordings: Array<Recording>,
|}

export default class App extends React.PureComponent<Props, State> {
  cardsService: CardsService
  logStorage: LogStorage
  preferencesStorage: PreferencesStorage
  recorderService: RecorderService

  constructor(props: Props) {
    super(props)

    this.logStorage = new LogStorage(window.localStorage)
    this.cardsService = new CardsService(window.localStorage,
      'http://localhost:4000/ar/new-cards.json', this.logStorage.log)
    this.preferencesStorage = new PreferencesStorage(window.localStorage)
    this.recorderService = new RecorderService('BASE_URL', this.logStorage.log)

    this.state = {
      cards: this.cardsService.getCardsFromStorage(),
      logs: this.logStorage.getTodaysLogs(),
      preferences: this.preferencesStorage.getPreferences(),
      recordings: [],
    }
  }

  onLogsUpdated = () =>
    this.setState({ logs: this.logStorage.todaysLogs })

  componentDidMount() {
    this.recorderService.em.addEventListener('recording', this.onNewRecording)
    this.logStorage.eventEmitter.on('logs', this.onLogsUpdated)
  }

  componentWillUnmount() {
    this.recorderService.em.removeEventListener(
      'recording', this.onNewRecording)
    this.logStorage.eventEmitter.removeListener('logs', this.onLogsUpdated)
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
      cards={this.state.cards}
      log={this.logStorage.log}
      speechSynthesis={this.props.speechSynthesis} />

  renderDiagnostics = () => <Diagnostics />

  onSetPreferences = (preferences: Preferences) =>
    this.setState({
      preferences: this.preferencesStorage.setPreferences(preferences),
    })

  renderPreferencesScreen = () =>
    <PreferencesScreen
      log={this.logStorage.log}
      preferences={this.state.preferences}
      setPreferences={this.onSetPreferences} />

  renderRecorder = () =>
    <Recorder
      log={this.logStorage.log}
      recordings={this.state.recordings}
      startRecording={this.startRecording}
      stopRecording={this.stopRecording} />

  onClickDownloadCards = () =>
    this.cardsService.downloadCards()
      .then(response => this.setState({ cards: response.cards }))

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
          {this.state.logs.slice(-3).map((log, i) =>
            <li key={i}>{JSON.stringify(log)}</li>)}
        </ul>
        <button onClick={this.onClickDownloadCards}>Download cards</button>
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
