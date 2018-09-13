// @flow
import './App.css'
import type {Card} from './buckwalter/Card.js'
import {convertBuckwalterToArabic} from './buckwalter/convertBuckwalter'
import diffStrings from './diffStrings.js'
import {expandQalam1} from './buckwalter/digraphs.js'
import {mergeToQalam1} from './buckwalter/digraphs.js'
import React from 'react'

const MIDDLE_DOT = '\u00b7'

type Props = {|
  card: Card,
  close: () => void,
  speakText: (script: string) => void,
|}

type GradedChar = {|
  char: string,
  wasEnteredCorrectly: boolean,
  beginsSyllable: boolean,
|}

type GradedMorpheme = {|
  chars: Array<GradedChar>,
  startsWithHyphen: boolean,
  endsWithHyphen: boolean,
  gloss: string,
|}

type State = {|
  gradedMorphemes: Array<GradedMorpheme>,
|}

export default class Quiz extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      gradedMorphemes: [],
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
      const morphemeStarts = { '0': true }
      let nextSyllableStart = 0
      for (const morpheme of morphemes) {
        for (const syllableQalam1 of morpheme.syllableQalam1s) {
          nextSyllableStart += syllableQalam1.replace(/-/g, '',).length
          syllableStarts[nextSyllableStart] = true
        }
        morphemeStarts[nextSyllableStart] = true
      }

      const charsByMorpheme = []
      for (const edit of edits) {
        const correctIndex = edit[0]
        const guessIndex = edit[1]
        const correctChar = correct.charAt(correctIndex)
        const guessChar = guess.charAt(guessIndex)
        if (morphemeStarts[correctIndex]) {
          charsByMorpheme.push({ chars: [] })
        }
        charsByMorpheme[charsByMorpheme.length - 1].chars.push({
          char: correctChar,
          wasEnteredCorrectly: guessChar === correctChar,
          beginsSyllable: syllableStarts[correctIndex],
        })
      }

      const gradedMorphemes = morphemes.map((morpheme, i) => ({
        chars: charsByMorpheme[i].chars,
        startsWithHyphen: morpheme.buckwalter.startsWith('-'),
        endsWithHyphen: morpheme.buckwalter.endsWith('-'),
        gloss: morpheme.gloss,
      }))

      this.setState({ gradedMorphemes })
    }
  }

  render() {
    const { gradedMorphemes } = this.state
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
        {gradedMorphemes.map((morpheme: GradedMorpheme, i: number) =>
          <div className='morpheme-pair' key={i}>
            <div className='qalam'>
              {morpheme.startsWithHyphen ? '-' : ''}
              {morpheme.chars.map((char: GradedChar, j: number) => {
                const className =
                  (char.wasEnteredCorrectly ? ' correct' : ' incorrect')
                return <span key={j} className={className}>
                  {(char.beginsSyllable && j > 0) ?
                    <span className='syllable-divider'>{MIDDLE_DOT}</span> : ''}
                  {expandQalam1(char.char)}
                </span>
              })}
              {morpheme.endsWithHyphen ? '-' : ''}
            </div>
            <div className='gloss'>
              {morpheme.gloss}
            </div>
          </div>
        )}
      </div>
    </div>
  }
}
