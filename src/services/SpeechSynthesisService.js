// @flow
import EventEmitter from 'eventemitter3'

export type VoiceChoice = {|
  lang: string,
  name: string,
|}

export type SpeechSynthesisProps = {|
  speakText: (l2: string) => void,
  voicesState: 'POLLING' | 'FOUND' | 'TIMEOUT',
|}

const POLL_VOICES_TIMEOUT_MILLIS = 5000
const POLL_VOICES_INTERVAL_MILLIS = 100

export default class SpeechSynthesisService {
  eventEmitter: EventEmitter
  speechSynthesis: SpeechSynthesis
  log: (event: string, details?: {}) => void
  props: SpeechSynthesisProps

  constructor(
    speechSynthesis: SpeechSynthesis,
    log: (event: string, details?: {}) => void
  ) {
    this.eventEmitter = new EventEmitter()
    this.speechSynthesis = speechSynthesis
    this.log = log
  }

  init() {
    this.props = {
      speakText: this.speakText,
      voicesState: 'POLLING',
    }

    const _this = this
    const timeout = setTimeout(
      () => {
        this.log('PollVoicesTimeout', { timeout: POLL_VOICES_TIMEOUT_MILLIS })
        _this.props = { ..._this.props, voicesState: 'TIMEOUT' }
        _this.eventEmitter.emit('props')
      },
      POLL_VOICES_TIMEOUT_MILLIS)
    function pollVoices() {
      const voices = _this.speechSynthesis.getVoices()
      if (voices.length > 0) {
        _this.log('PollVoicesSuccess')
        clearTimeout(timeout)
        _this.props = { ..._this.props, voicesState: 'FOUND' }
        _this.eventEmitter.emit('props', {})
      } else {
        setTimeout(pollVoices, POLL_VOICES_INTERVAL_MILLIS)
      }
    }
    pollVoices()
  }

  getProps = () => this.props

  getL2VoiceChoices(): Array<VoiceChoice> {
    return this.speechSynthesis.getVoices().filter((voice) =>
      voice.lang.startsWith('ar')
    ).map((voice) => ({ lang: voice.lang, name: voice.name }))
  }

  speakText = (l2: string) => {
    const utterance = new SpeechSynthesisUtterance(l2)

    // Default to first Arabic voice, but allow override
    for (const voice of this.speechSynthesis.getVoices()) {
      if (voice.lang.startsWith('ar')) {
        utterance.voice = voice
        break
      }
    }
    // for (const voice of this.speechSynthesis.getVoices()) {
    //   if (voice.name === voiceName) {
    //     utterance.voice = voice
    //   }
    // }

    this.log('SpeechSynthesisSpeak', { l2 })
    this.speechSynthesis.speak(utterance)
  }
}