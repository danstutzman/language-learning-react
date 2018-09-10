import cards from './cards.js'
import {convertBuckwalterToArabic} from './buckwalter/convertBuckwalter'
import Quiz from './Quiz.js'
import React from 'react'

type Props = {|
  gradeAnswer: (answer: string) => void,
  speak: (script: string) => void,
|}

type State = {|
  cardNum: number,
  showQuiz: boolean,
|}

export default class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      cardNum: Math.floor(Math.random() * cards.length),
      showQuiz: false,
    }
  }

  speakForQuiz = () => {
    const { cardNum } = this.state
    const script = convertBuckwalterToArabic(cards[cardNum].buckwalter)
    this.props.speak(script)
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