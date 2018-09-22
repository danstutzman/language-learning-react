// @flow
// import App from './App.js' // eslint-disable-line no-unused-vars
import addContextToAtoms from './buckwalter/addContextToAtoms.js'
import type {AtomContext1} from './buckwalter/addContextToAtoms.js'
import type {AtomContext2} from './buckwalter/addContextToAtoms.js'
import convertAtomContext2ToBuckwalter from
  './buckwalter/convertAtomContext2ToBuckwalter.js'
import convertBuckwalterToQalam from './buckwalter/convertBuckwalterToQalam.js'
import diffStrings from './diffStrings.js'
// import React from 'react'
// import ReactDOM from 'react-dom'
import fs from 'fs'
import groupAtomsIntoSyllables from './buckwalter/groupAtomsIntoSyllables.js'
import splitQalamIntoAtoms from './buckwalter/splitQalamIntoAtoms.js'

it('adds context to atoms', () => {
  const add = addContextToAtoms
  expect(add([
    { atom:'b', beginPunctuation:'', endPunctuation:'', endsMorpheme: false, endsWord: false },
    { atom:'a', beginPunctuation:'', endPunctuation:'', endsMorpheme: false, endsWord: false },
    { atom:'d', beginPunctuation:'', endPunctuation:'', endsMorpheme: false, endsWord: false },
    { atom:'a', beginPunctuation:'', endPunctuation:'', endsMorpheme: true, endsWord: true },
  ])).toEqual([
    { atom:'b', left2: null, left: null, right: 'a', right2: 'd', endsSyllable: false, endsMorpheme: false,
      endsWord: false, beginPunctuation:'', endPunctuation: '' },
    { atom:'a', left2: null, left: 'b',  right: 'd', right2: 'a', endsSyllable: true, endsMorpheme: false,
      endsWord: false, beginPunctuation:'', endPunctuation: '' },
    { atom:'d', left2: 'b', left: 'a',  right: 'a', right2: null, endsSyllable: false, endsMorpheme: false,
      endsWord: false, beginPunctuation:'', endPunctuation: '' },
    { atom:'a', left2: 'a', left: 'd',  right: null, right2: null, endsSyllable: true, endsMorpheme: true,
      endsWord: true, beginPunctuation:'', endPunctuation: '' },
  ])
})

it('groups atoms into syllables', () => {
  const group = groupAtomsIntoSyllables
  expect(group(['b', 'a', 'd'])).toEqual([['b', 'a', 'd']])
  expect(group(['b', 'a', 'd', 'a'])).toEqual([['b', 'a'], ['d', 'a']])
})

// it('converts atoms to Buckwalter', () => {
//   const convert = convertAtomsToBuckwalter
//   expect(convert([])).toEqual('')
//   expect(convert(['sh'])).toEqual('$o')
//   expect(convert(['sh', 'sh'])).toEqual('$o$o')
//   expect(convert(['sh', 'a'])).toEqual('$a')
// })

it('computes diff', () => {
  // 01234-56
  // GCATG-CU
  // 0-123456
  // G-ATTACA
  expect(diffStrings('GCATGCU', 'GATTACA')).toEqual(
    [[0, 0], [1, -1], [2, 1], [3, 2], [4, 3], [-1, 4], [5, 5], [6, 6]])
})

it('splits Qalam into atoms', () => {
  const split = splitQalamIntoAtoms
  expect(split('')).toEqual([])
  expect(split('a')).toEqual(['a'])
  expect(split('sa')).toEqual(['s', 'a'])
  expect(split('sha')).toEqual(['sh', 'a'])
  expect(split('ash')).toEqual(['a', 'sh'])
  expect(split('shsh')).toEqual(['sh', 'sh'])
  expect(split('sah')).toEqual(['s', 'a', 'h'])
  expect(split('has')).toEqual(['h', 'a', 's'])
})

it('converts Qalam to Buckwalter correctly', () => {
  const contents = fs.readFileSync('qalam_to_buckwalter.csv', 'utf8')
  for (const line of contents.split('\n')) {
    if (line === '' || line.startsWith('#')) {
      continue
    }
    const values = line.split(',')
    const bookQalam = values[1]
    const correctedQalam = (values[2] || bookQalam)
    const expectedBuckwalter = values[3]
    const correctedBuckwalter = values[4] || expectedBuckwalter

    const doubleds = []
    const actualQalams = []
    let atomContext1s: Array<AtomContext1> = []
    const buckwalterWords = correctedBuckwalter.split(' ')
    for (let i = 0; i < buckwalterWords.length; i++) {
      const buckwalterWord = buckwalterWords[i]
      const match1 = buckwalterWord.match(/^[-]+/)
      const beginPunctuation = match1 ? match1[0] : ''
      const match2 = buckwalterWord.match(/[.?!-]+$/)
      const endPunctuation = match2 ? match2[0] : ''

      const doubled = buckwalterWord
        .replace(/^[-]*/, '')
        .replace(/[.?!-]*$/, '')
        .replace(/([DHSTZbcdfgjklmnqrstvwyz$*])~/g, '$1$1')
      doubleds.push(doubled)

      let actualQalam
      try {
        actualQalam = convertBuckwalterToQalam.parse(doubled)
      } catch (e) {
        console.error('Error parsing', doubled)
        throw e
      }
      actualQalams.push(beginPunctuation + actualQalam + endPunctuation)

      const atoms = splitQalamIntoAtoms(actualQalam)
      atomContext1s = atomContext1s.concat(atoms.map((atom, j) => ({
        atom,
        endsMorpheme: (j === atoms.length - 1),
        endsWord: (j === atoms.length - 1) &&
          !buckwalterWord.endsWith('-') &&
          !(buckwalterWords[i + 1] || '').startsWith('-'),
        beginPunctuation: (j === 0) ? beginPunctuation : '',
        endPunctuation: (j === atoms.length - 1) ? endPunctuation : '',
      })))
    }

    const actualQalamsJoined = actualQalams
      .join(' ')
      .replace(/ ?- ?/g, '-')
    expect(actualQalamsJoined).toEqual(correctedQalam)

    const atomContext2s: Array<AtomContext2> = addContextToAtoms(atomContext1s)

    const roundTripped = atomContext2s.map(atomContext2 =>
      atomContext2.beginPunctuation +
      convertAtomContext2ToBuckwalter(atomContext2) +
      atomContext2.endPunctuation +
      (atomContext2.endsMorpheme ? ' ' : '')
    ).join('')
      .replace(/([DHSTZbcdfgjklmnqrstvwyz$*])o?\1/g, '$1~')
      .replace(/l~l/, 'll~')
      .replace(/ $/, '')

    if (correctedBuckwalter + 'o' !== roundTripped) {
      try {
        expect(roundTripped).toEqual(correctedBuckwalter)
      } catch (e) {
        console.error({
          buckwalter: correctedBuckwalter,
          doubleds: doubleds,
          qalams: actualQalams,
          syllables: atomContext2s.map(atomContext2 =>
            atomContext2.atom
              + (atomContext2.endsSyllable ? ' -' : '')
              + (atomContext2.endsMorpheme ? '/' : '')
              + (atomContext2.endsWord ? '|' : '')
          ).join(' '),
          roundTripped: roundTripped,
        })
        throw e
      }
    }
  } // next line
})

it('renders without crashing', () => {
  // const div = document.createElement('div')
  // ReactDOM.render(<App />, div)
  // ReactDOM.unmountComponentAtNode(div)
})
