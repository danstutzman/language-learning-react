// @flow
import './App.css'
import type {Card} from './buckwalter/Card.js'
import {convertBuckwalterToArabic} from './buckwalter/convertBuckwalter'
import diffStrings from './diffStrings.js'
import {expandQalam1} from './buckwalter/digraphs.js'
import {mergeToQalam1} from './buckwalter/digraphs.js'
import React from 'react'

type Props = {|
  card: Card,
  close: () => void,
  speakText: (script: string) => void,
|}

type GradedChar = {|
  char: string,
  wasEnteredCorrectly: boolean,
  beginsSyllable: boolean,
  beginsMorpheme: boolean,
  beginsWord: boolean,
|}

type State = {|
  gradedChars: Array<GradedChar>,
|}

export default class Quiz extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      gradedChars: [],
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
      const correct = this.props.card.qalam1.replace(/ /g, '')
      const guess = mergeToQalam1((e.target: any).value).replace(/ /g, '')
      const edits = diffStrings(correct, guess)

      const morphemes = this.props.card.morphemes
      const syllableStarts = {}
      const morphemeStarts = {}
      const wordStarts = {}
      let nextSyllableStart = 0
      for (let i = 0; i < morphemes.length; i++) {
        const morpheme = morphemes[i]
        for (const syllableQalam1 of morpheme.syllableQalam1s) {
          nextSyllableStart += syllableQalam1.replace(/-/g, '',).length
          syllableStarts[nextSyllableStart] = true
        }
        morphemeStarts[nextSyllableStart] = true

        if (!morpheme.qalam1.endsWith('-') &&
          morphemes[i + 1] && !morphemes[i + 1].qalam1.startsWith('-')) {
          wordStarts[nextSyllableStart] = true
        }
      }

      const gradedChars = []
      for (const edit of edits) {
        const correctIndex = edit[0]
        const guessIndex = edit[1]
        const correctChar = correct.charAt(correctIndex)
        const guessChar = guess.charAt(guessIndex)
        gradedChars.push({
          char: correctChar,
          wasEnteredCorrectly: guessChar === correctChar,
          beginsSyllable: syllableStarts[correctIndex],
          beginsMorpheme: morphemeStarts[correctIndex],
          beginsWord: wordStarts[correctIndex],
        })
      }
      this.setState({ gradedChars })
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

      <div className='gradedChars'>
        {this.state.gradedChars.map((char: GradedChar, i: number) => {
          const className = (char.beginsSyllable ? 'newSyllable' : '') +
            (char.beginsMorpheme && !char.beginsWord ? ' newMorpheme' : '') +
            (char.beginsWord ? ' newWord' : '') +
            (char.wasEnteredCorrectly ? ' correct' : ' incorrect')
          return <span key={i} className={className}>
            {char.beginsMorpheme && !char.beginsWord ? '-' : ''}
            {expandQalam1(char.char)}
          </span>
        })}
      </div>
    </div>
  }
}
