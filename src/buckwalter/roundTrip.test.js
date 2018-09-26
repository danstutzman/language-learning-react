// @flow
import addContextToAtoms from './addContextToAtoms.js'
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
    const buckwalterWords = correctedBuckwalter.split(' ')
    let roundTripped = ''
    let allAtomContext2s = []
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
      const atomContext1s = atoms.map((atom, j) => ({
        atom,
        endsMorpheme: (j === atoms.length - 1),
        beginPunctuation: (j === 0) ? beginPunctuation : '',
        endPunctuation: (j === atoms.length - 1) ? endPunctuation : '',
      }))

      const atomContext2s = addContextToAtoms(atomContext1s)
      allAtomContext2s = allAtomContext2s.concat(atomContext2s)

      const morphemeRoundTripped = atomContext2s.map(atomContext2 =>
        atomContext2.beginPunctuation +
        convertAtomContext2ToBuckwalter(atomContext2) +
        atomContext2.endPunctuation +
        (atomContext2.endsMorpheme ? ' ' : '')
      ).join('')
      roundTripped += morphemeRoundTripped
    }

    const actualQalamsJoined = actualQalams
      .join(' ')
      .replace(/ ?- ?/g, '-')
    expect(actualQalamsJoined).toEqual(correctedQalam)

    roundTripped = roundTripped
      .replace(/([DHSTZbcdfgjklmnqrstvwyz$*])o?\1/g, '$1~')
      .replace(/l~l/, 'll~')
      .replace(/ $/, '')
      .replace(/o -([aiuwyAN])/g, ' -$1')
      .replace(/> -n/, '>o -n')
      .replace(/> -w/, '& -w')
      .replace(/> -y/, '} -y')
      .replace(/' -u(.)/, '& -u$1')
      .replace(/' -i(.)/, '} -i$1')

    if (correctedBuckwalter + 'o' !== roundTripped) {
      try {
        expect(roundTripped).toEqual(correctedBuckwalter)
      } catch (e) {
        console.error({
          buckwalter: correctedBuckwalter,
          doubleds: doubleds,
          qalams: actualQalams,
          syllables: allAtomContext2s.map(atomContext2 =>
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
