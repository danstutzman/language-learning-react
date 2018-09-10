import Quiz from './Quiz.js'
import React from 'react'

type Props = {|
  speak: () => void,
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

  onClickShowQuiz = () => {
    this.props.speak()
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
          speak={this.props.speak} />}
    </div>
  }
}