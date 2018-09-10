// @flow
import './App.css'
import { HashRouter } from 'react-router-dom'
import Home from './Home.js'
import { Link } from 'react-router-dom'
import Preferences from './Preferences.js'
import React from 'react'
import { Route } from 'react-router-dom'
import Topics from './Topics.js'

type Props = {|
  arabicVoices: Array<{| lang: string, name: string |}>,
  speakText: (script: string, selectedVoiceName: string | null) => void,
|}

type State = {|
  selectedVoiceName: string | null,
|}

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      selectedVoiceName: props.arabicVoices[0] ?
        props.arabicVoices[0].name : null,
    }
  }

  speakTextForHome = (script: string) => {
    this.props.speakText(script, this.state.selectedVoiceName)
  }

  renderHome = () =>
    <Home
      speakText={this.speakTextForHome} />

  renderPreferences = () =>
    <Preferences
      selectedVoiceName={this.state.selectedVoiceName}
      setSelectedVoiceName={this.setSelectedVoiceNameForPreferences} />

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
            <Link to="/preferences">Preferences</Link>
          </li>
          <li>
            <Link to="/topics">Topics</Link>
          </li>
        </ul>
        <hr />

        <Route exact path="/" render={this.renderHome} />
        <Route path="/preferences" render={this.renderPreferences} />
        <Route path="/topics" component={Topics} />
      </div>
    </HashRouter>
  }
}
