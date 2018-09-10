import './App.css'
import React from 'react'

type Props = {|
  close: () => void,
  gradeAnswer: (answer: string) => void,
  speak: () => void,
|}

export default class Quiz extends React.Component<Props> {
  onKeyPressInAnswer = (e: Event) => {
    if ((e: any).key === 'Enter') {
      e.preventDefault()
      const answer = (e.target: any).value
      this.props.gradeAnswer(answer)
    }
  }

  render() {
    return <div className='Quiz'>
      <button onClick={this.props.close}>X</button>
      <button onClick={this.props.speak}>Replay</button>
      Transcribe what you hear:
      <input
        type="text"
        onKeyPress={this.onKeyPressInAnswer}
        autoFocus={true} />
    </div>
  }
}
