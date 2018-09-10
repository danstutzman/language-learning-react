// @flow
import cards from './cards.js'
import Quiz from './Quiz.js'
import React from 'react'

type Props = {|
  speakText: (script: string) => void,
|}

type State = {|
  card: { buckwalter: string },
  showQuiz: boolean,
|}

export default class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      card: cards[Math.floor(Math.random() * cards.length)],
      showQuiz: false,
    }
  }

  onClickShowQuiz = () =>
    this.setState({ showQuiz: true })

  onCloseQuiz = () =>
    this.setState({ showQuiz: false })

  render() {
    return <div>
      <h2>Home</h2>
      <button onClick={this.onClickShowQuiz}>Show Quiz</button>

      {this.state.showQuiz &&
        <Quiz
          card={this.state.card}
          close={this.onCloseQuiz}
          speakText={this.props.speakText} />}
    </div>
  }
}