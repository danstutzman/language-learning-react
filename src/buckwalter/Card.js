// @flow

export type CardSyllable = {|
  buckwalter: string,
  qalam1: string,
|}

export type CardMorpheme = {|
  buckwalter: string,
  gloss: string,
  qalam1: string,
  syllables: Array<CardSyllable>,
|}

export type Card = {|
  buckwalter: string,
  qalam1: string,
  morphemes: Array<CardMorpheme>,
  syllables: Array<CardSyllable>,
|}