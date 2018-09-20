// @flow
import EventEmitter from 'eventemitter3'

export type Grade = {|
  stageNum: number,
|}

const GRADES_STORAGE_KEY = 'grades'

export type GradesProps = {|
  gradeByCardId: {[cardId: number]: Grade},
  setGrade: (cardId: number, grade: Grade) => void,
|}

export default class GradesService {
  eventEmitter: EventEmitter
  localStorage: LocalStorage
  log: (event: string, details?: {}) => void
  props: GradesProps

  constructor(
    localStorage: LocalStorage,
    log: (event: string, details?: {},
  ) => void) {
    this.eventEmitter = new EventEmitter()
    this.localStorage = localStorage
    this.log = log
  }

  init() {
    const json = this.localStorage.getItem(GRADES_STORAGE_KEY)
    const gradeByCardId = (json !== null) ? JSON.parse(json) : {}
    this.props = { gradeByCardId, setGrade: this.setGrade }
  }

  setGrade = (cardId: number, grade: Grade) => {
    const gradeByCardId = { ...this.props.gradeByCardId, [cardId]: grade }
    this.localStorage.setItem(GRADES_STORAGE_KEY, JSON.stringify(gradeByCardId))
    this.props = { ...this.props, gradeByCardId }
    this.eventEmitter.emit('grades')
  }
}