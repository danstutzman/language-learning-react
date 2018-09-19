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
import type {RecorderProps} from '../index.js'
import { Route } from 'react-router-dom'
import type {SpeechSynthesisProps} from '../services/SpeechSynthesisService.js'
import Topics from './Topics.js'

type Props = {|
  cards: CardsProps,
  log: (event: string, details?: {}) => void,
  preferences: PreferencesProps,
  recorder: RecorderProps,
  speechSynthesis: SpeechSynthesisProps,
|}

export default class App extends React.PureComponent<Props> {
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
      recorder={this.props.recorder} />

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
