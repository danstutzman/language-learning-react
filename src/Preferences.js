import React from 'react'

type Props = {|
  selectedVoiceName: string | null,
  setSelectedVoiceName: (string) => void,
|}

export default class Preferences extends React.Component<Props> {
  onChangeVoice = (e: Event) =>
    this.props.setSelectedVoiceName((e.target: any).value)

  render() {
    const voices = window.speechSynthesis.getVoices().filter((voice) =>
      voice.lang.startsWith('ar')
    )
    return <div>
      <h2>Preferences</h2>
      <select
        onChange={this.onChangeVoice}
        value={this.props.selectedVoiceName || undefined}>
        {voices.map((voice) => <option key={voice.name} value={voice.name}>
          {voice.name} {voice.lang}
        </option>)}
      </select>
    </div>
  }
}
