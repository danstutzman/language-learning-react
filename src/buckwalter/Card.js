// @flow

export type CardSyllable = {|
  buckwalter: string,
  qalam1: string,
|}

export type CardWord = {|
  buckwalter: string,
  qalam1: string,
  qalam1IfLast: string,
  syllables: Array<CardSyllable>,
  syllablesIfLast: Array<CardSyllable>,
|}

export type Card = {|
  buckwalter: string,
  qalam1: string,
  words: Array<CardWord>,
  syllables: Array<CardSyllable>,
|}