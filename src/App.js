import './App.css'
import { HashRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Quiz from './Quiz.js'
import React from 'react'
import { Route } from 'react-router-dom'
import Topics from './Topics.js'

const MARHABBAN_IN_ARABIC = '\u0645\u0631\u062D\u0628\u0627'

type Props = {|
  arabicVoices: Array<{| lang: string, name: string |}>,
  speakText: (script: string, selectedVoiceName: string | null) => void,
|}

type State = {|
  selectedVoiceName: string | null,
  showQuiz: boolean,
|}

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      selectedVoiceName: props.arabicVoices[0] ?
        props.arabicVoices[0].name : null,
      showQuiz: false,
    }
  }

  speakForQuiz = () => {
    this.props.speakText(MARHABBAN_IN_ARABIC, this.state.selectedVoiceName)
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

  onClickShowQuiz = () => {
    this.speakForQuiz()
    this.setState({ showQuiz: true })
  }

  onCloseQuiz = () =>
    this.setState({ showQuiz: false })

  render() {
    return <HashRouter>
      <div className="App">
        {this.renderVoicesSelect()}

        <button onClick={this.onClickShowQuiz}>Show Quiz</button>

        {this.state.showQuiz &&
          <Quiz
            close={this.onCloseQuiz}
            speak={this.speakForQuiz} />}

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
