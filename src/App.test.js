// @flow
import App from './App.js' // eslint-disable-line no-unused-vars
import diffStrings from './diffStrings.js'
import splitIntoSyllables from './buckwalter/splitIntoSyllables.js'
// import React from 'react'
// import ReactDOM from 'react-dom'

it('computes diff', () => {
  expect(diffStrings('GCATGCU', 'GATTACA')).toEqual([
    ['G', 'G'],
    ['C', ''],
    ['A', 'A'],
    ['T', 'T'],
    ['G', 'T'],
    ['',  'A'],
    ['C', 'C'],
    ['U', 'A'],
  ])
})

it('splits words into syllables', () => {
  const split = splitIntoSyllables
  expect(split('bisomi')).toEqual([
    ['b', 'i', 's'],
    ['m', 'i', null],
  ])
  expect(split('{ll~ahi')).toEqual([
    [null, 'A', 'l'],
    ['ll', 'a', null],
    ['h', 'i', null],
  ])
  expect(split('{lr~aHomani')).toEqual([
    [null, 'A', 'lr'],
    ['r', 'a', 'H'],
    ['m', 'a', null],
    ['n', 'i', null],
  ])
  expect(split('{lr~aHiymi')).toEqual([
    [null, 'A', 'lr'],
    ['r', 'a', null],
    ['H', 'iy', null],
    ['m', 'i', null],
  ])
  expect(split('{loHamodu')).toEqual([
    [null, 'A', 'l'],
    ['H', 'a', 'm'],
    ['d', 'u', null],
  ])
  expect(split('lil~ahi')).toEqual([
    ['l', 'i', null],
    ['ll', 'a', null],
    ['h', 'i', null],
  ])
  expect(split('rab~i')).toEqual([
    ['r', 'a', 'b'],
    ['b', 'i', null],
  ])
  expect(split('{loEa`lamiyna')).toEqual([
    [null, 'A', 'l'],
    ['E', 'a', null],
    ['l', 'a', null],
    ['m', 'iy', null],
    ['n', 'a', null],
  ])
  expect(split('{lr~aHoma`ni')).toEqual([
    [null, 'A', 'lr'],
    ['r', 'a', 'H'],
    ['m', 'a', null],
    ['n', 'i', null],
  ])
  expect(split('{lr~aHiymi')).toEqual([
    [null, 'A', 'lr'],
    ['r', 'a', null],
    ['H', 'iy', null],
    ['m', 'i', null],
  ])
  expect(split('ma`liki')).toEqual([
    ['m', 'a', null],
    ['l', 'i', null],
    ['k', 'i', null],
  ])
  expect(split('yawomi')).toEqual([
    ['y', 'a', 'w'],
    ['m', 'i', null],
  ])
  expect(split('{ld~iyni')).toEqual([
    [null, 'A', 'ld'],
    ['d', 'iy', null],
    ['n', 'i', null],
  ])
  expect(split('<iy~aAka')).toEqual([
    ["'", 'i', 'y'],
    ['y', 'aA', null],
    ['k', 'a', null],
  ])
  expect(split('naEobudu')).toEqual([
    ['n', 'a', 'E'],
    ['b', 'u', null],
    ['d', 'u', null],
  ])
  expect(split('wa<iy~aAka')).toEqual([
    ['w', 'a', null],
    ["'", 'i', 'y'],
    ['y', 'aA', null],
    ['k', 'a', null],
  ])
  expect(split('nasotaEiynu')).toEqual([
    ['n', 'a', 's'],
    ['t', 'a', null],
    ['E', 'iy', null],
    ['n', 'u', null],
  ])
  expect(split('{hodinaA')).toEqual([
    [null, 'i', 'h'],
    ['d', 'i', null],
    ['n', 'aA', null],
  ])
  expect(split('{lS~ira`Ta')).toEqual([
    [null, 'A', 'lS'],
    ['S', 'i', null],
    ['r', 'a', null],
    ['T', 'a', null],
  ])
  expect(split('{lomusotaqiyma')).toEqual([
    [null, 'A', 'l'],
    ['m', 'u', 's'],
    ['t', 'a', null],
    ['q', 'iy', null],
    ['m', 'a', null],
  ])
  expect(split('Sira`Ta')).toEqual([
    ['S', 'i', null],
    ['r', 'a', null],
    ['T', 'a', null],
  ])
  expect(split('{l~a*iyna')).toEqual([
    [null, 'A', 'l'],
    ['l', 'a', null],
    ['*', 'iy', null],
    ['n', 'a', null],
  ])
  expect(split('>anoEamo')).toEqual([
    ["'", 'a', 'n'],
    ['E', 'a', 'm'],
  ])
  expect(split('ta')).toEqual([
    ['t', 'a', null],
  ])
  expect(split('Ealayo')).toEqual([
    ['E', 'a', null],
    ['l', 'a', 'y'],
  ])
  expect(split('himo')).toEqual([
    ['h', 'i', 'm'],
  ])
  expect(split('gayori')).toEqual([
    ['g', 'a', 'y'],
    ['r', 'i', null],
  ])
  expect(split('{lo')).toEqual([
    [null, 'A', 'l'],
  ])
  expect(split('magoDuwbi')).toEqual([
    ['m', 'a', 'g'],
    ['D', 'uw', null],
    ['b', 'i', null],
  ])
  expect(split('Ealayo')).toEqual([
    ['E', 'a', null],
    ['l', 'a', 'y'],
  ])
  expect(split('himo')).toEqual([
    ['h', 'i', 'm'],
  ])
  expect(split('wa')).toEqual([
    ['w', 'a', null],
  ])
  expect(split('laA')).toEqual([
    ['l', 'aA', null],
  ])
  expect(split('{lD~aA^l~iyna')).toEqual([
    [null, 'A', 'lD'],
    ['D', 'aA', 'l'],
    ['l', 'iy', null],
    ['n', 'a', null],
  ])


  expect(split('Aisomiy')).toEqual([
    [null, 'Ai', 's'],
    ['m', 'iy', null],
  ])
  expect(split('daAniyaAl')).toEqual([
    ['d', 'aA', null],
    ['n', 'i', null],
    ['y', 'aA', 'l'],
  ])
  expect(split('maroHabAF')).toEqual([
    ['m', 'a', 'r'],
    ['H', 'a', null],
    ['b', 'A', 'n'],
  ])
  expect(split('Aalsa~laAmu')).toEqual([
    [null, 'Aa', 'ls'],
    ['s', 'a', null],
    ['l', 'aA', null],
    ['m', 'u', null],
  ])
  expect(split('Ealayokumo')).toEqual([
    ['E', 'a', null],
    ['l', 'a', 'y'],
    ['k', 'u', 'm'],
  ])
  expect(split('kayofa')).toEqual([
    ['k', 'a', 'y'],
    ['f', 'a', null],
  ])
  expect(split('HaAluka')).toEqual([
    ['H', 'aA', null],
    ['l', 'u', null],
    ['k', 'a', null],
  ])
  expect(split('>anota')).toEqual([
    ["'", 'a', 'n'],
    ['t', 'a', null],
  ])
})

it('renders without crashing', () => {
  // const div = document.createElement('div')
  // ReactDOM.render(<App />, div)
  // ReactDOM.unmountComponentAtNode(div)
})
