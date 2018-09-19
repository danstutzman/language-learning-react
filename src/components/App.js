// @flow
import './App.css'
import type {Card} from '../services/CardsService.js'
import CardsService from '../services/CardsService.js'
import Diagnostics from './Diagnostics.js'
import { HashRouter } from 'react-router-dom'
import Home from './Home.js'
import { Link } from 'react-router-dom'
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
  log: (event: string, details?: {}) => void,
  speechSynthesis: SpeechSynthesisProps,
|}

type State = {|
  cards: Array<Card>,
  preferences: Preferences,
  recordings: Array<Recording>,
|}

export default class App extends React.PureComponent<Props, State> {
  cardsService: CardsService
  preferencesStorage: PreferencesStorage
  recorderService: RecorderService

  constructor(props: Props) {
    super(props)

    this.cardsService = new CardsService(window.localStorage,
      'http://localhost:4000/ar/new-cards.json', props.log)
    this.preferencesStorage = new PreferencesStorage(window.localStorage)
    this.recorderService = new RecorderService('BASE_URL', props.log)

    this.state = {
      cards: this.cardsService.getCardsFromStorage(),
      preferences: this.preferencesStorage.getPreferences(),
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
      cards={this.state.cards}
      log={this.props.log}
      speechSynthesis={this.props.speechSynthesis} />

  renderDiagnostics = () => <Diagnostics />

  onSetPreferences = (preferences: Preferences) =>
    this.setState({
      preferences: this.preferencesStorage.setPreferences(preferences),
    })

  renderPreferencesScreen = () =>
    <PreferencesScreen
      log={this.props.log}
      preferences={this.state.preferences}
      setPreferences={this.onSetPreferences} />

  renderRecorder = () =>
    <Recorder
      log={this.props.log}
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
