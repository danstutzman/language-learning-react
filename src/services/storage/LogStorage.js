// @flow
const LOG_STORAGE_KEY_PREFIX = 'logs.'

export default class LogStorage {
  localStorage: LocalStorage
  todaysLogKey: string
  todaysLogs: Array<{}>

  constructor(localStorage: LocalStorage) {
    this.localStorage = localStorage
    this.todaysLogKey = this.getTodaysLogKey()
    this.todaysLogs = this.getTodaysLogs()
  }

  getTodaysLogKey(): string {
    return LOG_STORAGE_KEY_PREFIX + new Date().toISOString().substr(0, 10)
  }

  getTodaysLogs(): Array<{}> {
    const json = this.localStorage.getItem(this.todaysLogKey)
    return (json !== null) ? JSON.parse(json) : []
  }

  log(event: string, details?: {}): Array<{}> {
    const log = { time: new Date().getTime(), event, ...details }
    this.todaysLogs.push(log)
    this.localStorage.setItem(
      this.todaysLogKey, JSON.stringify(this.todaysLogs))
    return this.todaysLogs
  }
}