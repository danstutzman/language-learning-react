// @flow
// import App from './App.js' // eslint-disable-line no-unused-vars
import diffStrings from './diffStrings.js'
// import React from 'react'
// import ReactDOM from 'react-dom'
import fs from 'fs'
import qalamToBuckwalter from './buckwalter/qalamToBuckwalter.js'

it('computes diff', () => {
  // 01234-56
  // GCATG-CU
  // 0-123456
  // G-ATTACA
  expect(diffStrings('GCATGCU', 'GATTACA')).toEqual(
    [[0, 0], [1, -1], [2, 1], [3, 2], [4, 3], [-1, 4], [5, 5], [6, 6]])
})

it('converts Qalam to Buckwalter correctly', () => {
  const contents = fs.readFileSync('qalam_to_buckwalter.csv', 'utf8')
  for (const line of contents.split('\n')) {
    if (line === '' || line.startsWith('#')) {
      continue
    }
    const values = line.split(',')
    const bookQalam = values[1]
    const correctedQalam = values[2] || bookQalam
    const expectedBuckwalter = values[3]
    let actualBuckwalter
    try {
      actualBuckwalter = qalamToBuckwalter.parse(correctedQalam)
    } catch (e) {
      console.error('Error parsing', correctedQalam)
      throw e
    }

    try {
      expect(actualBuckwalter).toEqual(expectedBuckwalter)
    } catch (e) {
      console.error('Assertion failed with', correctedQalam)
      throw e
    }
  }
})

it('renders without crashing', () => {
  // const div = document.createElement('div')
  // ReactDOM.render(<App />, div)
  // ReactDOM.unmountComponentAtNode(div)
})
