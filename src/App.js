import './App.css'
import { HashRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import React from 'react'
import { Route } from 'react-router-dom'
import Topics from './Topics.js'

const MARHABBAN_IN_ARABIC = '\u0645\u0631\u062D\u0628\u0627'

type State = {|
  selectedVoiceName: string | null,
|}

export default class App extends React.Component<{}, State> {
  arabicVoices: Array<any>
  scriptElement: HTMLInputElement

  constructor(props: {}) {
    super(props)
    this.arabicVoices = window.speechSynthesis.getVoices().filter((voice) =>
      voice.lang.startsWith('ar')
    )
    this.state = {
      selectedVoiceName: this.arabicVoices[0] ?
        this.arabicVoices[0].name : null,
    }
  }

  assignScriptElementRef = (scriptElement: HTMLInputElement | null) => {
    if (scriptElement === null) {
      throw new Error('Unexpected null scriptElement')
    }
    this.scriptElement = scriptElement
  }

  onSubmit = () => {
    const script = this.scriptElement.value
    const utterance = new SpeechSynthesisUtterance(script)
    for (const voice of this.arabicVoices) {
      if (voice.name === this.state.selectedVoiceName) {
        utterance.voice = voice
      }
    }
    window.speechSynthesis.speak(utterance)
  }

  onChangeVoice = (e: Event) =>
    this.setState({ selectedVoiceName: (e.target: any).value })

  renderVoicesSelect() {
    const voices = window.speechSynthesis.getVoices().filter((voice) =>
      voice.lang.startsWith('ar')
    )
    return <select
      onChange={this.onChangeVoice}
      value={this.state.selectedVoiceName || undefined}>
      {voices.map((voice) => <option key={voice.name} value={voice.name}>
        {voice.name} {voice.lang}
      </option>)}
    </select>
  }

  render() {
    return <HashRouter>
      <div className="App">
        {this.renderVoicesSelect()}
        <form onSubmit={this.onSubmit}>
          <input
            ref={this.assignScriptElementRef}
            type="text"
            defaultValue={MARHABBAN_IN_ARABIC} />
        </form>
        <button onClick={this.onSubmit}>Play</button>

        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/topics">Topics</Link>
          </li>
        </ul>

        <hr />

        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/topics" component={Topics} />
      </div>
    </HashRouter>
  }
}

const Home = () => <div>
  <h2>Home</h2>
</div>

const About = () => <div>
  <h2>About</h2>
</div>
