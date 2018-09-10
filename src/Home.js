import Quiz from './Quiz.js'
import React from 'react'

const cards = [
  { buckwalter: '\u0645\u0631\u062D\u0628\u0627' },
]

type Props = {|
  gradeAnswer: (answer: string) => void,
  speak: (script: string) => void,
|}

type State = {|
  showQuiz: boolean,
|}

export default class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      showQuiz: false,
    }
  }

  speakForQuiz = () => {
    this.props.speak(cards[0].buckwalter)
  }

  onClickShowQuiz = () => {
    this.speakForQuiz()
    this.setState({ showQuiz: true })
  }

  onCloseQuiz = () =>
    this.setState({ showQuiz: false })

  render() {
    return <div>
      <h2>Home</h2>
      <button onClick={this.onClickShowQuiz}>Show Quiz</button>

      {this.state.showQuiz &&
        <Quiz
          close={this.onCloseQuiz}
          gradeAnswer={this.props.gradeAnswer}
          speak={this.speakForQuiz} />}
    </div>
  }
}