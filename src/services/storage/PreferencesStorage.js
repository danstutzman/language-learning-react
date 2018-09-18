// @flow
import {DEFAULT_PREFERENCES} from './Preferences.js'
import type {Preferences} from './Preferences.js'

const PREFERENCES_STORAGE_KEY = 'preferences'

export default class PreferenceStorage {
  localStorage: LocalStorage

  constructor(localStorage: LocalStorage) {
    this.localStorage = localStorage
  }

  getPreferences(): Preferences {
    const json = this.localStorage.getItem(PREFERENCES_STORAGE_KEY)
    return (json !== null) ? JSON.parse(json) : DEFAULT_PREFERENCES
  }

  setPreferences(preferences: Preferences): Preferences {
    const json = JSON.stringify(preferences)
    this.localStorage.setItem(PREFERENCES_STORAGE_KEY, json)
    return preferences
  }
}