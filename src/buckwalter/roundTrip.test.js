// @flow
import addContextToAtoms from './addContextToAtoms.js'
import type {AtomContext1} from './addContextToAtoms.js'
import type {AtomContext2} from './addContextToAtoms.js'
import convertAtomContext2ToBuckwalter from
  './convertAtomContext2ToBuckwalter.js'
import convertBuckwalterToQalam from './convertBuckwalterToQalam.js'
import fs from 'fs'
import splitQalamIntoAtoms from './splitQalamIntoAtoms.js'

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
          ).join(' '),
          roundTripped: roundTripped,
        })
        throw e
      }
    }
  } // next line
})
