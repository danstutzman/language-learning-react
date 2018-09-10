import './App.css'
import React from 'react'
import {convertBuckwalterToArabic} from './buckwalter/convertBuckwalter'
import {convertBuckwalterToQalam} from './buckwalter/convertBuckwalter'

type Props = {|
  card: { buckwalter: string },
  close: () => void,
  speakText: (script: string) => void,
|}

function gradeAnswer(answer: string) {

}

export default class Quiz extends React.Component<Props> {
  componentDidMount() {
    this.onClickReplay()
  }

  onClickReplay = () =>
    this.props.speakText(convertBuckwalterToArabic(this.props.card.buckwalter))

  onKeyPressInAnswer = (e: Event) => {
    if ((e: any).key === 'Enter') {
      e.preventDefault()
      const answer = (e.target: any).value
      gradeAnswer(answer)
    }
  }

  render() {
    return <div className='Quiz'>
      <button onClick={this.props.close}>X</button>
      <button onClick={this.onClickReplay}>Replay</button>
      Transcribe what you hear:
      <input
        type="text"
        onKeyPress={this.onKeyPressInAnswer}
        autoFocus={true} />
      {convertBuckwalterToQalam(this.props.card.buckwalter)}
    </div>
  }
}
