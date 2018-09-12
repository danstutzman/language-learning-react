// @flow
import type {Card} from './buckwalter/Card.js'
import CARDS from './buckwalter/CARDS.js'
import type {CardSyllable} from './buckwalter/Card.js'
import type {CardWord} from './buckwalter/Card.js'
import {convertBuckwalterToArabic} from './buckwalter/convertBuckwalter.js'
import {expandDigraphs} from './buckwalter/digraphs.js'
import Quiz from './Quiz.js'
import React from 'react'

type Props = {|
  speakText: (script: string) => void,
|}

type State = {|
  card: Card,
  showQuiz: boolean,
|}

export default class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      card: CARDS[Math.floor(Math.random() * CARDS.length)],
      showQuiz: false,
    }
  }

  onClickShowQuiz = () =>
    this.setState({ showQuiz: true })

  onCloseQuiz = () =>
    this.setState({ showQuiz: false })

  onClickCard = (e: Event) => {
    const buckwalter = (e.target: any).getAttribute('data-buckwalter')
      .replace(/^ll/, 'l')
    this.props.speakText(convertBuckwalterToArabic(buckwalter))
  }

  render() {
    return <div>
      <h2>Home</h2>

      {CARDS.map((card: Card, i: number) =>
        <li key={i}>
          <button
            key={card.buckwalter}
            onClick={this.onClickCard}
            data-buckwalter={card.buckwalter}>
            {expandDigraphs(card.romanized)}
          </button>
          {card.words.map((word: CardWord, j: number) => {
            return <button
              key={j}
              onClick={this.onClickCard}
              data-buckwalter={word.buckwalter}>
              {expandDigraphs(word.romanizedIfLast)}
            </button>
          })}
          {card.syllables.map((syllable: CardSyllable, j: number) => {
            return <button
              key={j + 100}
              onClick={this.onClickCard}
              data-buckwalter={syllable.buckwalter + 'o'}>
              {expandDigraphs(syllable.romanized)}
            </button>
          })}
        </li>
      )}

      <button onClick={this.onClickShowQuiz}>Show Quiz</button>

      {this.state.showQuiz &&
        <Quiz
          card={this.state.card}
          close={this.onCloseQuiz}
          speakText={this.props.speakText} />}
    </div>
  }
}