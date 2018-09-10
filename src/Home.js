// @flow
import cards from './cards.js'
import {convertBuckwalterToArabic} from './buckwalter/convertBuckwalter.js'
import Quiz from './Quiz.js'
import React from 'react'
import splitIntoSyllables from './buckwalter/splitIntoSyllables.js'
import WORDS from './buckwalter/WORDS.js'

type Props = {|
  speakText: (script: string) => void,
|}

type State = {|
  card: { buckwalter: string },
  showQuiz: boolean,
|}

export default class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      card: cards[Math.floor(Math.random() * cards.length)],
      showQuiz: false,
    }
  }

  onClickShowQuiz = () =>
    this.setState({ showQuiz: true })

  onCloseQuiz = () =>
    this.setState({ showQuiz: false })

  onClickWord = (e: Event) => {
    const wordBuckwalter = (e.target: any).getAttribute('data-word')
    this.props.speakText(convertBuckwalterToArabic(wordBuckwalter))
  }

  render() {
    return <div>
      <h2>Home</h2>

      {WORDS.map((wordBuckwalter: string, i: number) =>
        <li key={i}>
          {splitIntoSyllables(wordBuckwalter).map(
            (syllable: [string | null, string, string | null]) => {
              const syllableBuckwalter =
                `${syllable[0] || ''}${syllable[1]}${syllable[2] || ''}`
                  .replace('ll', 'l')
              const displayed = syllableBuckwalter
                .replace('*', 'dh')
                .replace('E', '\u1d9c')
                // .replace('E', '\u02bf')
                .replace('x', 'kh')
                .replace('$', 'sh')
                .replace('g', 'gh')
                // .replace("'", '\u02bea')
                .replace("'", '\u2019')
              return <button
                key={syllableBuckwalter}
                onClick={this.onClickWord}
                data-word={syllableBuckwalter + 'o'}>
                {displayed}
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