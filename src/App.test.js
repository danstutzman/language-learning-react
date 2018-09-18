// @flow
// import App from './App.js' // eslint-disable-line no-unused-vars
import diffStrings from './diffStrings.js'
import {splitIntoSyllables} from './buckwalter/splitIntoSyllables.js'
// import React from 'react'
// import ReactDOM from 'react-dom'

it('computes diff', () => {
  // 01234-56
  // GCATG-CU
  // 0-123456
  // G-ATTACA
  expect(diffStrings('GCATGCU', 'GATTACA')).toEqual(
    [[0, 0], [1, -1], [2, 1], [3, 2], [4, 3], [-1, 4], [5, 5], [6, 6]])
})

function split(buckwalterWord: string): Array<string> {
  return splitIntoSyllables(buckwalterWord).map(output => output.qalam1)
}

it('splits words into syllables', () => {
  expect(split('bisomi')).toEqual(['bis', 'mi'])
  expect(split('{ll~ahi')).toEqual(['al', 'lla', 'hi'])
  expect(split('{lr~aHomani')).toEqual(['alr', 'raH', 'ma', 'ni'])
  expect(split('{lr~aHiymi')).toEqual(['alr', 'ra', 'Hiy', 'mi'])
  expect(split('{loHamodu')).toEqual(['al', 'Ham', 'du'])
  expect(split('lil~ahi')).toEqual(['lil', 'la', 'hi'])
  expect(split('rab~i')).toEqual(['rab', 'bi'])
  expect(split('{loEa`lamiyna')).toEqual(['al', 'Ea', 'la', 'miy', 'na'])
  expect(split('{lr~aHoma`ni')).toEqual(['alr', 'raH', 'ma', 'ni'])
  expect(split('{lr~aHiymi')).toEqual(['alr', 'ra', 'Hiy', 'mi'])
  expect(split('ma`liki')).toEqual(['ma', 'li', 'ki'])
  expect(split('yawomi')).toEqual(['yaw', 'mi'])
  expect(split('{ld~iyni')).toEqual(['ald', 'diy', 'ni'])
  expect(split('<iy~aAka')).toEqual(["'iy", 'yA', 'ka'])
  expect(split('naEobudu')).toEqual(['naE', 'bu', 'du'])
  expect(split('wa<iy~aAka')).toEqual(['wa', "'iy", 'yA', 'ka'])
  expect(split('nasotaEiynu')).toEqual(['nas', 'ta', 'Eiy', 'nu'])
  expect(split('{hodinaA')).toEqual(['ah', 'di', 'nA'])
  expect(split('{lS~ira`Ta')).toEqual(['alS', 'Si', 'ra', 'Ta'])
  expect(split('{lomusotaqiyma')).toEqual(['al', 'mus', 'ta', 'qiy', 'ma'])
  expect(split('Sira`Ta')).toEqual(['Si', 'ra', 'Ta'])
  expect(split('{l~a*iyna')).toEqual(['al', 'la', '*iy', 'na'])
  expect(split('>anoEamo')).toEqual(["'an", 'Eam'])
  expect(split('ta')).toEqual(['ta'])
  expect(split('Ealayo')).toEqual(['Ea', 'lay'])
  expect(split('himo')).toEqual(['him'])
  expect(split('gayori')).toEqual(['gay', 'ri'])
  expect(split('{lo')).toEqual(['al'])
  expect(split('magoDuwbi')).toEqual(['mag', 'Duw', 'bi'])
  expect(split('Ealayo')).toEqual(['Ea', 'lay'])
  expect(split('himo')).toEqual(['him'])
  expect(split('wa')).toEqual(['wa'])
  expect(split('laA')).toEqual(['lA'])
  expect(split('{lD~aA^l~iyna')).toEqual(['alD', 'DAl', 'liy', 'na'])

  expect(split('Aisomiy')).toEqual(['is', 'miy'])
  expect(split('daAniyaAl')).toEqual(['dA', 'ni', 'yAl'])
  expect(split('maroHabAF')).toEqual(['mar', 'Ha', 'bAn'])
  expect(split('Aalsa~laAmu')).toEqual(['als', 'sa', 'lA', 'mu'])
  expect(split('Ealayokumo')).toEqual(['Ea', 'lay', 'kum'])
  expect(split('kayofa')).toEqual(['kay', 'fa'])
  expect(split('HaAluka')).toEqual(['HA', 'lu', 'ka'])
  expect(split('>anota')).toEqual(["'an", 'ta'])
  expect(split('xuroTuwmo')).toEqual(['xur', 'Tuwm'])
  expect(split('$amos')).toEqual(['$ams'])
  expect(split('gaA}imo')).toEqual(['gA', "'im"])
})

it('renders without crashing', () => {
  // const div = document.createElement('div')
  // ReactDOM.render(<App />, div)
  // ReactDOM.unmountComponentAtNode(div)
})
