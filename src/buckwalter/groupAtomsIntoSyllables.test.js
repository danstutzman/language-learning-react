// @flow
import groupAtomsIntoSyllables from './groupAtomsIntoSyllables.js'

it('groups atoms into syllables', () => {
  const group = groupAtomsIntoSyllables
  expect(group(['b', 'a', 'd'])).toEqual([['b', 'a', 'd']])
  expect(group(['b', 'a', 'd', 'a'])).toEqual([['b', 'a'], ['d', 'a']])
})
