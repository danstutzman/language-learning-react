// @flow
import type {Preferences} from './services/storage/Preferences.js'
import React from 'react'

type Props = {|
  preferences: Preferences,
  setPreferences: (Preferences) => void,
|}

export default class PreferencesScreen extends React.Component<Props> {
  onChangeSpeechSynthesisVoiceName = (e: Event) =>
    this.props.setPreferences({
      ...this.props.preferences,
      speechSynthesisVoiceName: (e.target: any).value,
    })

  render() {
    const voices = window.speechSynthesis.getVoices().filter((voice) =>
      voice.lang.startsWith('ar')
    )
    return <div>
      <h2>Preferences</h2>
      <select
        onChange={this.onChangeSpeechSynthesisVoiceName}
        value={this.props.preferences.speechSynthesisVoiceName}>
        <option value=''>(default)</option>
        {voices.map((voice) => <option key={voice.name} value={voice.name}>
          {voice.name} {voice.lang}
        </option>)}
      </select>
    </div>
  }
}
