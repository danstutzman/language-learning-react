// @flow
const LOG_STORAGE_KEY_PREFIX = 'logs.'

export default class LogStorage {
  localStorage: LocalStorage
  todaysLogKey: string
  todaysLogs: Array<{}>

  constructor(localStorage: LocalStorage) {
    this.localStorage = localStorage
    this.todaysLogKey = this.getTodaysLogKey()

    const json = this.localStorage.getItem(this.todaysLogKey)
    this.todaysLogs = (json !== null) ? JSON.parse(json) : []
  }

  getTodaysLogKey(): string {
    return LOG_STORAGE_KEY_PREFIX + new Date().toISOString().substr(0, 10)
  }

  log = (event: string, details?: {}) => {
    if (details !== undefined) {
      console.log(event, details) // eslint-disable-line no-console
    } else {
      console.log(event) // eslint-disable-line no-console
    }

    const log = { time: new Date().getTime(), event, ...details }
    this.todaysLogs.push(log)
    this.localStorage.setItem(
      this.todaysLogKey, JSON.stringify(this.todaysLogs))
  }
}