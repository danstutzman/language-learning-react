import './App.css'
import { HashRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import React from 'react'
import { Route } from 'react-router-dom'
import Topics from './Topics.js'

export default class App extends React.Component<{}> {
  scriptElement: HTMLInputElement

  assignScriptElementRef = (scriptElement: HTMLInputElement | null) => {
    if (scriptElement === null) {
      throw new Error('Unexpected null scriptElement')
    }
    this.scriptElement = scriptElement
  }

  onSubmit = (e: Event) => {
    e.preventDefault()

    const script = this.scriptElement.value
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(script))
  }

  render() {
    return <HashRouter>
      <div className="App">
        <form onSubmit={this.onSubmit}>
          <input ref={this.assignScriptElementRef} type="text" />
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
