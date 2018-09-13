// @flow

export type CardWord = {|
  buckwalter: string,
  syllableQalam1s: Array<string>,
  syllableQalam1sIfLast: Array<string>,
|}

export type Card = {|
  buckwalter: string,
  qalam1: string,
  words: Array<CardWord>,
  syllableQalam1s: Array<string>,
|}