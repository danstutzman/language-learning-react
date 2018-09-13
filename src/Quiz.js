// @flow
import './App.css'
import type {Card} from './buckwalter/Card.js'
import {convertBuckwalterToArabic} from './buckwalter/convertBuckwalter'
import diffStrings from './diffStrings.js'
import {expandQalam1} from './buckwalter/digraphs.js'
import {mergeToQalam1} from './buckwalter/digraphs.js'
import React from 'react'

const MIDDLE_DOT = '\u00b7'

const ALL_L2_FORMATS = ['ARABIC', 'QALAM']

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
  selectedL2Format: 'ARABIC' | 'QALAM',
|}

export default class Quiz extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      gradedMorphemes: [],
      selectedL2Format: 'QALAM',
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

  onChangeL2Format = (e: Event) =>
    this.setState({ selectedL2Format: (e.target: any).value })

  render() {
    const { gradedMorphemes, selectedL2Format } = this.state
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

      {ALL_L2_FORMATS.map((l2Format) => <span key={l2Format}>
        <input
          type='radio'
          id={l2Format}
          name='l2Format'
          checked={selectedL2Format === l2Format}
          value={l2Format}
          onChange={this.onChangeL2Format} />
        <label htmlFor={l2Format}>
          {l2Format}
        </label>
      </span>)}
      <br/>
      <br/>

      <div className='gradedChars'>
        {gradedMorphemes.map((morpheme: GradedMorpheme, i: number) =>
          <div className='morpheme-pair' key={i}>
            {selectedL2Format === 'ARABIC' &&
              <div className='gloss-left'>{morpheme.gloss}</div>}
            <div className={selectedL2Format === 'QALAM' ?
              'qalam-left' : 'arabic-right'}>
              {morpheme.startsWithHyphen ? '-' : ''}
              {morpheme.chars.map((char: GradedChar, j: number) => {
                const className =
                  (char.wasEnteredCorrectly ? ' correct' : ' incorrect')
                return <span key={j}>
                  {(char.beginsSyllable && j > 0) ?
                    <span className='syllable-divider'>{MIDDLE_DOT}</span> :
                    null}
                  <span className={className}>
                    {(selectedL2Format === 'QALAM') ?
                      expandQalam1(char.char) :
                      convertBuckwalterToArabic(char.char)}
                  </span>
                </span>
              })}
              {morpheme.endsWithHyphen ? '-' : ''}
            </div>
            {selectedL2Format === 'QALAM' &&
              <div className='gloss-right'>{morpheme.gloss}</div>}
          </div>
        )}
      </div>
    </div>
  }
}
