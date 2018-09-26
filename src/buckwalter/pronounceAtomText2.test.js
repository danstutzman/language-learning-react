// @flow
import addContextToAtoms from './addContextToAtoms.js'
import pronounceAtomContext2 from './pronounceAtomContext2.js'
import splitQalamIntoAtoms from './splitQalamIntoAtoms.js'

const default1 = {
  beginPunctuation: '',
  endPunctuation: '',
  endsMorpheme: false,
}

function pronounce(qalam: string): string {
  const atoms = splitQalamIntoAtoms(qalam)
  const contexts1 = atoms.map(atom => ({ ...default1, atom }))
  const contexts2 = addContextToAtoms(contexts1)
  const pronunciations = contexts2.map(context =>
    pronounceAtomContext2(context) + (context.endsSyllable ? '.' : ''))
  return pronunciations.join('').replace(/\.$/, '')
}

// Examples from https://www.lebanesearabicinstitute.com/arabic-alphabet/
it('adjusts vowels based on surrounding consonants', () => {
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
