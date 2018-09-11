// @flow
import type {Card} from './buckwalter/Card.js'
import CARDS from './buckwalter/CARDS.js'
import {convertBuckwalterToArabic} from './buckwalter/convertBuckwalter.js'
import Quiz from './Quiz.js'
import React from 'react'
import {romanizeSyllables} from './buckwalter/romanize.js'

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

  onClickWord = (e: Event) => {
    const buckwalter = (e.target: any).getAttribute('data-buckwalter')
      .replace('ll', 'l')
    this.props.speakText(convertBuckwalterToArabic(buckwalter))
  }

  render() {
    return <div>
      <h2>Home</h2>

      {CARDS.map((card: Card, i: number) =>
        <li key={i}>
          <button
            key={card.buckwalter}
            onClick={this.onClickWord}
            data-buckwalter={card.buckwalter}>
            {card.roman}
          </button>
          {card.syllables.map(
            (syllable: [string | null, string, string | null], j: number) => {
              const syllableBuckwalter =
                `${syllable[0] || ''}${syllable[1]}${syllable[2] || ''}`
              return <button
                key={j}
                onClick={this.onClickWord}
                data-buckwalter={syllableBuckwalter + 'o'}>
                {romanizeSyllables([syllable])}
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