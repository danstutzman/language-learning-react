// @flow
import type {Card} from './buckwalter/Card.js'
import CARDS from './buckwalter/CARDS.js'
import {convertBuckwalterToArabic} from './buckwalter/convertBuckwalter.js'
import {expandDigraphs} from './buckwalter/digraphs.js'
import Quiz from './Quiz.js'
import React from 'react'

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
  speakText: (script: string) => void,
|}

type State = {|
  card: Card,
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

export default class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      card: CARDS[Math.floor(Math.random() * CARDS.length)],
      enabledGroupNames: DEFAULT_ENABLED_GROUP_NAMES,
      enabledPhonemes: listEnabledPhonemes(DEFAULT_ENABLED_GROUP_NAMES),
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
    for (const c of card.romanized) {
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
              checked={this.state.enabledGroupNames[groupName]} />
            <label htmlFor={groupName}>
              {expandDigraphs(phonemes.join(', '))}
            </label>
          </li>
        })}
      </ul>

      {CARDS.map((card: Card, i: number) =>
        <button
          key={i}
          className={this.doesCardMatchEnabledPhonemes(card) ? '' : 'faded'}
          onClick={this.onClickCard}
          data-buckwalter={card.buckwalter}>
          {expandDigraphs(card.romanized)}
        </button>
      )}
      <br />
      <br />

      <button onClick={this.onClickShowQuiz}>Show Quiz</button>

      {this.state.showQuiz &&
        <Quiz
          card={this.state.card}
          close={this.onCloseQuiz}
          speakText={this.props.speakText} />}
    </div>
  }
}