import './App.css'
import {convertBuckwalterToArabic} from './buckwalter/convertBuckwalter'
import {convertBuckwalterToQalam} from './buckwalter/convertBuckwalter'
import diffStrings from './diffStrings.js'
import React from 'react'

type Props = {|
  card: { buckwalter: string },
  close: () => void,
  speakText: (script: string) => void,
|}

type State = {|
  edits: Array<[string, string]>,
|}

export default class Quiz extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      edits: [],
    }
  }

  componentDidMount() {
    this.onClickReplay()
  }

  onClickReplay = () =>
    this.props.speakText(convertBuckwalterToArabic(this.props.card.buckwalter))

  onKeyPressInAnswer = (e: Event) => {
    if ((e: any).key === 'Enter') {
      e.preventDefault()
      const answer = (e.target: any).value
      const edits = diffStrings(
        convertBuckwalterToQalam(this.props.card.buckwalter), answer)
      this.setState({ edits })
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
      <br />

      <table>
        <tbody>
          <tr>
            {this.state.edits.map((edit: [string, string], i: number) => {
              const correct = edit[0]
              const guess = edit[1]
              if (guess === correct) {
                return <td key={i}></td>
              } else {
                return <td key={i}><ins>{correct}</ins></td>
              }
            })}
          </tr>
          <tr>
            {this.state.edits.map((edit: [string, string], i: number) => {
              const correct = edit[0]
              const guess = edit[1]
              if (guess === correct) {
                return <td key={i}>{guess}</td>
              } else {
                return <td key={i}><del>{guess}</del></td>
              }
            })}
          </tr>
        </tbody>
      </table>
    </div>
  }
}
