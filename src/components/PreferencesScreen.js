// @flow
import type {PreferencesProps} from '../services/storage/PreferencesStorage.js'
import React from 'react'

type Props = {|
  log: (event: string, details?: {}) => void,
  preferences: PreferencesProps,
|}

export default class PreferencesScreen extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.log('VisitPreferencesScreen')
  }

  onChangeSpeechSynthesisVoiceName = (e: Event) =>
    this.props.preferences.setPreferences({
      ...this.props.preferences.preferences,
      speechSynthesisVoiceName: (e.target: any).value,
    })

  render() {
    const preferences = this.props.preferences.preferences
    const voices = window.speechSynthesis.getVoices().filter((voice) =>
      voice.lang.startsWith('ar')
    )
    return <div>
      <h2>Preferences</h2>
      <select
        onChange={this.onChangeSpeechSynthesisVoiceName}
        value={preferences.speechSynthesisVoiceName}>
        <option value=''>(default)</option>
        {voices.map((voice) => <option key={voice.name} value={voice.name}>
          {voice.name} {voice.lang}
        </option>)}
      </select>
    </div>
  }
}
