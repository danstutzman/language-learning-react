// @flow

export type CardSyllable = {|
  buckwalter: string,
  romanized: string,
|}

export type CardWord = {|
  buckwalter: string,
  romanized: string,
  romanizedIfLast: string,
  syllables: Array<CardSyllable>,
  syllablesIfLast: Array<CardSyllable>,
|}

export type Card = {|
  buckwalter: string,
  romanized: string,
  words: Array<CardWord>,
  syllables: Array<CardSyllable>,
|}