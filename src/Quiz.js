// @flow
import './App.css'
import type {Card} from './buckwalter/Card.js'
import {convertBuckwalterToArabic} from './buckwalter/convertBuckwalter'
import {mergeDigraphs} from './buckwalter/digraphs.js'
import diffStrings from './diffStrings.js'
import {expandDigraphs} from './buckwalter/digraphs.js'
import React from 'react'

type Props = {|
  card: Card,
  close: () => void,
  speakText: (script: string) => void,
|}

type SyllablePair = {|
  correct: string,
  guess: string,
  isEndOfWord: boolean,
|}

type State = {|
  syllablePairs: Array<SyllablePair>,
|}

export default class Quiz extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      syllablePairs: [],
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
      const correct = this.props.card.romanized.replace(/ /g, '')
      const guess = mergeDigraphs((e.target: any).value).replace(/ /g, '')
      const edits = diffStrings(correct, guess)

      const words = this.props.card.words
      const syllableStarts = {}
      const wordStarts = {}
      let nextSyllableStart = 0
      for (let i = 0; i < words.length; i++) {
        const word = words[i]
        const syllables = (i < words.length - 1) ?
          word.syllables : word.syllablesIfLast
        for (const syllable of syllables) {
          nextSyllableStart += syllable.romanized.length
          syllableStarts[nextSyllableStart] = true
        }
        wordStarts[nextSyllableStart] = true
      }

      const syllablePairs = []
      let correctSoFar = ''
      let guessSoFar = ''
      for (const edit of edits) {
        const correctIndex = edit[0]
        const guessIndex = edit[1]
        if (syllableStarts[correctIndex]) {
          syllablePairs.push({
            correct: correctSoFar,
            guess: guessSoFar,
            isEndOfWord: wordStarts[correctIndex],
          })
          correctSoFar = ''
          guessSoFar = ''
        }
        if (edit[0] !== -1) {
          correctSoFar += correct.charAt(correctIndex)
        }
        if (edit[1] !== -1) {
          guessSoFar += guess.charAt(guessIndex)
        }
      }
      syllablePairs.push({
        correct: expandDigraphs(correctSoFar),
        guess: expandDigraphs(guessSoFar),
        isEndOfWord: true,
      })

      this.setState({ syllablePairs })
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
      <br />

      <table className='alignment'>
        <tbody>
          <tr>
            {this.state.syllablePairs.map((pair: SyllablePair, i: number) => {
              const className = pair.isEndOfWord ? 'endOfWord' : null
              return <td key={i} className={className}>
                {(pair.guess !== pair.correct) &&
                  <ins>{expandDigraphs(pair.correct)}</ins>}
              </td>
            })}
          </tr>
          <tr>
            {this.state.syllablePairs.map((pair: SyllablePair, i: number) => {
              const className = (pair.isEndOfWord ? 'endOfWord' : '') +
                (pair.guess === pair.correct ? ' matches' : '')
              return <td key={i} className={className}>
                {(pair.guess === pair.correct) ?
                  expandDigraphs(pair.guess) :
                  <del>{expandDigraphs(pair.guess)}</del>}
              </td>
            })}
          </tr>
        </tbody>
      </table>
    </div>
  }
}
