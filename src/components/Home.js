// @flow
import type {Card} from '../services/CardsService.js'
import type {CardsProps} from '../services/CardsService.js'
import {convertBuckwalterToArabic} from '../buckwalter/convertBuckwalter.js'
import {expandQalam1} from '../buckwalter/digraphs.js'
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
  log: (event: string, details?: {}) => void,
  speechSynthesis: SpeechSynthesisProps,
|}

type State = {|
  currentQuizCard: Card,
  enabledGroupNames: {[string]: boolean},
  enabledPhonemes: {[string]: true},
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

export default class Home extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    const cards = props.cards.cards
    this.state = {
      currentQuizCard: cards[Math.floor(Math.random() * cards.length)],
      enabledGroupNames: DEFAULT_ENABLED_GROUP_NAMES,
      enabledPhonemes: listEnabledPhonemes(DEFAULT_ENABLED_GROUP_NAMES),
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
    const clickedEnabled = (e.target: any).checked
    const clickedGroupName = (e.target: any).getAttribute('data-group-name')
    this.setState(prevState => {
      const enabledGroupNames = {
        ...prevState.enabledGroupNames,
        [clickedGroupName]: clickedEnabled,
      }
      const enabledPhonemes = listEnabledPhonemes(enabledGroupNames)
      return { enabledGroupNames, enabledPhonemes }
    })
  }

  doesCardMatchEnabledPhonemes = (card: Card): boolean => {
    const { enabledPhonemes } = this.state
    for (const c of card.qalam1) {
      if (enabledPhonemes[c] !== true) {
        return false
      }
    }
    return true
  }

  render() {
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
              checked={this.state.enabledGroupNames[groupName] || false} />
            <label htmlFor={groupName}>
              {expandQalam1(phonemes.join(', '))}
            </label>
          </li>
        })}
      </ul>

      {this.props.cards.cards.map((card: Card, i: number) =>
        <button
          key={i}
          className={this.doesCardMatchEnabledPhonemes(card) ? '' : 'faded'}
          onClick={this.onClickCard}
          data-buckwalter={card.l2}>
          {expandQalam1(card.qalam1)}
          {this.props.speechSynthesis.voicesState !== 'FOUND' &&
            ` (voicesState=${this.props.speechSynthesis.voicesState})`}
        </button>
      )}
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
          speechSynthesis={this.props.speechSynthesis} />}
    </div>
  }
}
