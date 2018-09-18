// @flow

export type VoiceChoice = {|
  lang: string,
  name: string,
|}

export default class SpeechSynthesisService {
  getL2VoiceChoices(): Array<VoiceChoice> {
    return window.speechSynthesis.getVoices().filter((voice) =>
      voice.lang.startsWith('ar')
    ).map((voice) => ({ lang: voice.lang, name: voice.name }))
  }

  speakText(text: string, voiceName: string | null) {
    const utterance = new SpeechSynthesisUtterance(text)

    // Default to first Arabic voice, but allow override
    for (const voice of window.speechSynthesis.getVoices()) {
      if (voice.lang.startsWith('ar')) {
        utterance.voice = voice
        break
      }
    }
    for (const voice of window.speechSynthesis.getVoices()) {
      if (voice.name === voiceName) {
        utterance.voice = voice
      }
    }

    window.speechSynthesis.speak(utterance)
  }
}