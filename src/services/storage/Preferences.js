// @flow

export type Preferences = {|
  speechSynthesisVoiceName: string | null,
|}

export const DEFAULT_PREFERENCES: Preferences = {
  speechSynthesisVoiceName: '',
}