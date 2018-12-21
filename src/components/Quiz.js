// @flow
import './App.css'
import type {Card} from '../services/CardsService.js'
import {convertBuckwalterToArabic} from '../buckwalter/convertBuckwalter'
import diffStrings from '../buckwalter/diffStrings.js'
import {expandQalam1} from '../buckwalter/digraphs'
import type {GradesProps} from '../services/GradesService.js'
import {mergeToQalam1} from '../buckwalter/digraphs'
import React from 'react'
import type {SpeechSynthesisProps} from '../services/SpeechSynthesisService.js'

const MIDDLE_DOT = '\u00b7'

type Props = {|
  card: Card,
  close: () => void,
  grades: GradesProps,
  speechSynthesis: SpeechSynthesisProps,
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
  showArabic: boolean,
  showGloss: boolean,
  showQalam: boolean,
|}

export default class Quiz extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      gradedMorphemes: [],
      showArabic: true,
      showGloss: true,
      showQalam: true,
    }
  }

  componentDidMount() {
    this.onClickReplay()
  }

  onClickReplay = () =>
    this.props.speechSynthesis.speakText(
      convertBuckwalterToArabic(this.props.card.l2))

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
        for (const atom of morpheme.atoms) {
          nextSyllableStart += atom.atom.length
          if (atom.endsSyllable) {
            syllableStarts[nextSyllableStart] = true
          }
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
        startsWithHyphen: morpheme.l2.startsWith('-'),
        endsWithHyphen: morpheme.l2.endsWith('-'),
        gloss: morpheme.gloss,
      }))

      this.setState({ gradedMorphemes })
    }
  }

  onChangeShowArabic = (e: Event) =>
    this.setState({ showArabic: (e.target: any).checked })

  onChangeShowGloss = (e: Event) =>
    this.setState({ showGloss: (e.target: any).checked })

  onChangeShowQalam = (e: Event) =>
    this.setState({ showQalam: (e.target: any).checked })

  renderMorphemeArabic = (morpheme: GradedMorpheme) =>
    <div className='arabic' dir='rtl'>
      {morpheme.startsWithHyphen ? '-' : ''}
      {morpheme.chars.map((char: GradedChar, j: number) => {
        const className =
          (char.wasEnteredCorrectly ? ' correct' : ' incorrect')
        return <span key={j}>
          {(char.beginsSyllable && j > 0) ?
            <span className='syllable-divider'>{MIDDLE_DOT}</span> :
            null}
          <span className={className}>
            {convertBuckwalterToArabic(char.char)}
          </span>
        </span>
      })}
      {morpheme.endsWithHyphen ? '-' : ''}
    </div>

  renderMorphemeGloss = (morpheme: GradedMorpheme) =>
    <div className='gloss'>{morpheme.gloss}</div>

  renderMorphemeQalam = (morpheme: GradedMorpheme) =>
    <div className='qalam'>
      {morpheme.startsWithHyphen ? '-' : ''}
      {morpheme.chars.map((char: GradedChar, j: number) => {
        const className =
          (char.wasEnteredCorrectly ? ' correct' : ' incorrect')
        return <span key={j}>
          {(char.beginsSyllable && j > 0) ?
            <span className='syllable-divider'>{MIDDLE_DOT}</span> :
            null}
          <span className={className}>
            {expandQalam1(char.char)}
          </span>
        </span>
      })}
      {morpheme.endsWithHyphen ? '-' : ''}
    </div>

  onClickForgot = () =>
    this.props.grades.setGrade(this.props.card.id, { stageNum: -1 })

  onClickRemembered = () =>
    this.props.grades.setGrade(this.props.card.id, { stageNum: 1 })

  render() {
    const { gradedMorphemes, showArabic, showGloss, showQalam } = this.state
    return <div className='Quiz'>
      <button onClick={this.props.close}>X</button>
      <button onClick={this.onClickReplay}>Replay</button>
      <button onClick={this.onClickForgot}>Forgot</button>
      <button onClick={this.onClickRemembered}>Remembered</button>

      Transcribe what you hear:
      <input
        type="text"
        onKeyPress={this.onKeyPressInAnswer}
        autoFocus={true} />
      <br />
      <br />

      <input
        type='checkbox'
        id='show-arabic'
        checked={showArabic}
        onChange={this.onChangeShowArabic} />
      <label htmlFor='show-arabic'>Arabic</label>
      <br/>
      <input
        type='checkbox'
        id='show-gloss'
        checked={showGloss}
        onChange={this.onChangeShowGloss} />
      <label htmlFor='show-gloss'>Gloss</label>
      <br/>
      <input
        type='checkbox'
        id='show-qalam'
        checked={showQalam}
        onChange={this.onChangeShowQalam} />
      <label htmlFor='show-qalam'>Qalam</label>
      <br/>
      <br />

      <div className='gradedChars'>
        {gradedMorphemes.map((morpheme: GradedMorpheme, i: number) =>
          <div className='morpheme' key={i}>
            {showQalam && this.renderMorphemeQalam(morpheme)}
            {showGloss && this.renderMorphemeGloss(morpheme)}
            {showArabic && this.renderMorphemeArabic(morpheme)}
          </div>
        )}
      </div>
    </div>
  }
}
