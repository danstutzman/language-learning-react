// @flow
// import App from './App.js' // eslint-disable-line no-unused-vars
import diffStrings from './diffStrings.js'
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

it('renders without crashing', () => {
  // const div = document.createElement('div')
  // ReactDOM.render(<App />, div)
  // ReactDOM.unmountComponentAtNode(div)
})
