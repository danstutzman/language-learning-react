// @flow
import {DEFAULT_PREFERENCES} from './Preferences.js'
import EventEmitter from 'eventemitter3'
import type {Preferences} from './Preferences.js'

const PREFERENCES_STORAGE_KEY = 'preferences'

export type PreferencesProps = {|
  preferences: Preferences,
  setPreferences: (Preferences) => void,
|}

export default class PreferenceStorage {
  eventEmitter: EventEmitter
  localStorage: LocalStorage
  props: PreferencesProps

  constructor(localStorage: LocalStorage) {
    this.eventEmitter = new EventEmitter()
    this.localStorage = localStorage
  }

  init() {
    const json = this.localStorage.getItem(PREFERENCES_STORAGE_KEY)
    const preferences = (json !== null) ? JSON.parse(json) : DEFAULT_PREFERENCES
    this.props = { preferences, setPreferences: this.setPreferences }
  }

  setPreferences = (preferences: Preferences) => {
    const json = JSON.stringify(preferences)
    this.localStorage.setItem(PREFERENCES_STORAGE_KEY, json)
    this.eventEmitter.emit('preferences')
  }
}