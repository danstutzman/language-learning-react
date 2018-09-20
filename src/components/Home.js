// @flow
import type {Card} from '../services/CardsService.js'
import type {CardsProps} from '../services/CardsService.js'
import {convertBuckwalterToArabic} from '../buckwalter/convertBuckwalter.js'
import {expandQalam1} from '../buckwalter/digraphs.js'
import type {GradesProps} from '../services/GradesService.js'
import Quiz from './Quiz.js'
import React from 'react'
import type {SpeechSynthesisProps} from '../services/SpeechSynthesisService.js'

const PHONEME_GROUPS = {
  a_A: ['a', 'A'],
  d_D: ['d', 'D'],
  th_dh_DH_z: ['v', '*', 'z'],
  i_I_y: ['i', 'I', 'y'],
  u_U: ['u', 'U', 'w'],
  s_S: ['s', 'S'],
  t_T: ['t', 'T'],
  gh_kh_H: ['g', 'x', 'H', 'h'],
  j_sh: ['j', '$'],
  r_d: ['r', 'd'],
  q_k_kh: ['q', 'k', 'x'],
  E_hamzah: ['E', "'"],
  b_f_m_n_l: ['b', 'f', 'm', 'n', 'l'],
}

const DEFAULT_ENABLED_GROUP_NAMES = {
  a_A: true,
  b_f_m_n_l: true,
  d_D: true,
  i_I_y: true,
  b_m_n_l: true,
  s_S: true,
  r_d: true,
}

type Props = {|
  cards: CardsProps,
  grades: GradesProps,
  log: (event: string, details?: {}) => void,
  speechSynthesis: SpeechSynthesisProps,
|}

type State = {|
  currentQuizCard: Card,
  enabledGroupNames: {[string]: boolean},
  enabledPhonemes: {[string]: true},
  numHardPhonemesByCardId: {[cardId: number]: number},
  showQuiz: boolean,
|}

function listEnabledPhonemes(enabledGroupNames: {[string]: boolean}):
  {[string]: true} {
  const enabledPhonemes: {[string]: true} = { ' ': true }
  for (const groupName of Object.keys(PHONEME_GROUPS)) {
    if (enabledGroupNames[groupName]) {
      for (const phoneme of PHONEME_GROUPS[groupName]) {
        enabledPhonemes[phoneme] = true
      }
    }
  }
  return enabledPhonemes
}

function countNumHardPhonemes(
  cards: Array<Card>,
  enabledPhonemes: {[string]: true},
): {[cardId: number]: number} {
  const numHardPhonemesByCardId: {[cardId: number]: number} = {}
  for (const card of cards) {
    let hardPhonemes = {}
    for (const c of card.qalam1) {
      if (enabledPhonemes[c] !== true) {
        hardPhonemes[c] = true
      }
    }
    numHardPhonemesByCardId[card.id] = Object.keys(hardPhonemes).length
  }
  return numHardPhonemesByCardId
}

export default class Home extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    const cards = props.cards.cards
    const enabledPhonemes = listEnabledPhonemes(DEFAULT_ENABLED_GROUP_NAMES)
    this.state = {
      currentQuizCard: cards[Math.floor(Math.random() * cards.length)],
      enabledGroupNames: DEFAULT_ENABLED_GROUP_NAMES,
      enabledPhonemes,
      numHardPhonemesByCardId: countNumHardPhonemes(cards, enabledPhonemes),
      showQuiz: false,
    }
  }

  componentDidMount() {
    this.props.log('VisitHome')
  }

  onClickShowQuiz = () =>
    this.setState({ showQuiz: true })

  onCloseQuiz = () =>
    this.setState({ showQuiz: false })

  onClickCard = (e: Event) => {
    const buckwalter = (e.target: any).getAttribute('data-buckwalter')
      .replace(/^ll/, 'l')
      .replace(/ss/g, 's~')
    this.props.speechSynthesis.speakText(convertBuckwalterToArabic(buckwalter))
  }

  onToggleGroupName = (e: Event) => {
    const cards = this.props.cards.cards
    const clickedEnabled = (e.target: any).checked
    const clickedGroupName = (e.target: any).getAttribute('data-group-name')
    this.setState(prevState => {
      const enabledGroupNames = {
        ...prevState.enabledGroupNames,
        [clickedGroupName]: clickedEnabled,
      }
      const enabledPhonemes = listEnabledPhonemes(enabledGroupNames)
      const numHardPhonemesByCardId =
        countNumHardPhonemes(cards, enabledPhonemes)
      return { enabledGroupNames, enabledPhonemes, numHardPhonemesByCardId }
    })
  }

  render() {
    const { enabledGroupNames, numHardPhonemesByCardId } = this.state
    const cardsSorted = this.props.cards.cards.slice()
    cardsSorted.sort((a, b) =>
      numHardPhonemesByCardId[a.id] < numHardPhonemesByCardId[b.id] ? -1 : 1)
    return <div>
      <h2>Home</h2>

      <ul>
        {Object.keys(PHONEME_GROUPS).map((groupName: string, i: number) => {
          const phonemes = PHONEME_GROUPS[groupName]
          return <li key={i}>
            <input
              id={groupName}
              type="checkbox"
              data-group-name={groupName}
              onChange={this.onToggleGroupName}
              checked={enabledGroupNames[groupName] || false} />
            <label htmlFor={groupName}>
              {expandQalam1(phonemes.join(', '))}
            </label>
          </li>
        })}
      </ul>

      <table border='1'>
        <thead>
          <tr>
            <th>qalam1</th>
            <th># hard phonemes</th>
            <th>grade</th>
          </tr>
        </thead>
        <tbody>
          {cardsSorted.map((card: Card, i: number) =>
            <tr key={i}>
              <td onClick={this.onClickCard} data-buckwalter={card.l2}>
                {expandQalam1(card.qalam1)}
              </td>
              <td>{numHardPhonemesByCardId[card.id]}</td>
              <td>
                {JSON.stringify(this.props.grades.gradeByCardId[card.id])}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <br />
      <br />

      <button onClick={this.onClickShowQuiz}>
        Show Quiz
        {this.props.speechSynthesis.voicesState !== 'FOUND' &&
          ` (voicesState=${this.props.speechSynthesis.voicesState})`}
      </button>

      {this.state.showQuiz &&
        <Quiz
          card={this.state.currentQuizCard}
          close={this.onCloseQuiz}
          grades={this.props.grades}
          speechSynthesis={this.props.speechSynthesis} />}
    </div>
  }
}
