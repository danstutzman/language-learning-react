// @flow
// import App from './App.js' // eslint-disable-line no-unused-vars
import addContextToAtoms from './buckwalter/addContextToAtoms.js'
import type {AtomContext1} from './buckwalter/addContextToAtoms.js'
import type {AtomContext2} from './buckwalter/addContextToAtoms.js'
import convertAtomContext2ToBuckwalter from
  './buckwalter/convertAtomContext2ToBuckwalter.js'
import convertBuckwalterToQalam from './buckwalter/convertBuckwalterToQalam.js'
import pronounceAtomContext2 from './buckwalter/pronounceAtomContext2.js'
import diffStrings from './diffStrings.js'
// import React from 'react'
// import ReactDOM from 'react-dom'
import fs from 'fs'
import groupAtomsIntoSyllables from './buckwalter/groupAtomsIntoSyllables.js'
import splitQalamIntoAtoms from './buckwalter/splitQalamIntoAtoms.js'

it('decides pronunciation for phonemes', () => {
  const default1 = {
    beginPunctuation: '',
    endPunctuation: '',
    endsMorpheme: false,
    endsWord: false,
  }
  const theName = addContextToAtoms([
    { ...default1, atom: 'e' },
    { ...default1, atom: 's' },
    { ...default1, atom: 'm', endsMorpheme: true },
    { ...default1, atom: 'u', endsMorpheme: true, endsWord: true },
  ])
  expect(theName.map(pronounceAtomContext2)).toEqual(['ʔi', 's', 'm', ''])

  const inTheName = addContextToAtoms([
    { ...default1, atom: 'b' },
    { ...default1, atom: 'i', endsMorpheme: true },
    { ...default1, atom: 'e' },
    { ...default1, atom: 's' },
    { ...default1, atom: 'm', endsMorpheme: true },
    { ...default1, atom: 'i', endsMorpheme: true, endsWord: true },
  ])
  expect(inTheName.map(pronounceAtomContext2)).toEqual(
    ['b', 'ɪ', '', 's', 'm', ''])

  const theLight = addContextToAtoms([
    { ...default1, atom: 'e' },
    { ...default1, atom: 'l' },
    { ...default1, atom: 'n', endsMorpheme: true },
    { ...default1, atom: 'n' },
    { ...default1, atom: 'uu' },
    { ...default1, atom: 'r', endsMorpheme: true, endsWord: true },
  ])
  expect(theLight.map(pronounceAtomContext2)).toEqual(
    ['ʔa', '', 'n', 'n', 'uː', 'r'])

  function pronounce(qalam: string): Array<AtomContext2> {
    const atoms = splitQalamIntoAtoms(qalam)
    const contexts1 = atoms.map((atom, i) => ({
      ...default1, atom, endsWord: (i === atoms.length - 1)
    }))
    const contexts2 = addContextToAtoms(contexts1)
    const pronunciations = contexts2.map(context =>
      pronounceAtomContext2(context) + (context.endsSyllable ? '.' : ''))
    return pronunciations.join('').replace(/\.$/, '')
  }

  // Examples from https://www.lebanesearabicinstitute.com/arabic-alphabet/
  expect(pronounce('Saciid')).toEqual('sˤɑ.ʕiːd')
  expect(pronounce('saciid')).toEqual('sæ.ʕiːd')
  expect(pronounce('HaaSid')).toEqual('ħɑ.sˤɘd')
  expect(pronounce('Haasid')).toEqual('ħæ.sɪd')
  expect(pronounce('HaraS')).toEqual('ħæ.rɑsˤ')
  expect(pronounce('Haras')).toEqual('ħæ.ræs')
  expect(pronounce("Taa'")).toEqual('tˤɑʔ')
  expect(pronounce("taa'")).toEqual('tæʔ')
  expect(pronounce('yuraTTib')).toEqual('ju.rɑtˤ.tˤɘb')
  expect(pronounce('yurattib')).toEqual('ju.ræt.tɪb')
  expect(pronounce('HaaT')).toEqual('ħɑtˤ')
  expect(pronounce('Haat')).toEqual('ħæt')
  expect(pronounce('Zaliil')).toEqual('zˤɑ.liːl')
  expect(pronounce('dhaliil')).toEqual('ðæ.liːl')
  expect(pronounce('maHZuur')).toEqual('mɑħ.zˤuːr')
  expect(pronounce('maHdhuur')).toEqual('mæħ.ðuːr')
  expect(pronounce('baZZ')).toEqual('bɑzˤzˤ')
  expect(pronounce('badhdh')).toEqual('bæðð')
  expect(pronounce('Darr')).toEqual('dˤɑrr')
  expect(pronounce('darr')).toEqual('dærr')
  expect(pronounce('taHaDDur')).toEqual('tæ.ħɑdˤ.dˤɔr')
  expect(pronounce('taHaddur')).toEqual('tæ.ħæd.dor')
  expect(pronounce('ruDuuD')).toEqual('rɔ.dˤuːdˤ')
  expect(pronounce('ruduud')).toEqual('ro.duːd')
  expect(pronounce('kalb')).toEqual('kælb')
  expect(pronounce('qalb')).toEqual('qɑlb')
  expect(pronounce('takriir')).toEqual('tæk.riːr')
  expect(pronounce('taqriir')).toEqual('tɑq.riːr')
  expect(pronounce('Hakk')).toEqual('ħækk')
  expect(pronounce('Haqq')).toEqual('ħɑqq')
})

it('adds context to atoms', () => {
  const default1 = {
    beginPunctuation: '',
    endPunctuation: '',
    endsMorpheme: false,
    endsWord: false,
  }
  const bada1 = { ...default1, atom:'b' }
  const bada2 = { ...default1, atom:'a' }
  const bada3 = { ...default1, atom:'d' }
  const bada4 = { ...default1, atom:'a', endsMorpheme: true, endsWord: true }
  expect(addContextToAtoms([bada1, bada2, bada3, bada4])).toEqual([
    { ...bada1,left2:null,left:null,right:'a', right2:'d', endsSyllable:false },
    { ...bada2,left2:null,left:'b', right:'d', right2:'a', endsSyllable:true },
    { ...bada3,left2:'b', left:'a', right:'a', right2:null,endsSyllable:false },
    { ...bada4,left2:'a', left:'d', right:null,right2:null,endsSyllable:true },
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
