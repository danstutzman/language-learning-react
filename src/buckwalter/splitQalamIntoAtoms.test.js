// @flow
import splitQalamIntoAtoms from './splitQalamIntoAtoms.js'

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