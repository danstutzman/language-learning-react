// @flow

export type CardMorpheme = {|
  buckwalter: string,
  gloss: string,
  qalam1: string,
  syllableQalam1s: Array<string>,
|}

export type Card = {|
  buckwalter: string,
  qalam1: string,
  morphemes: Array<CardMorpheme>,
  syllableQalam1s: Array<string>,
|}