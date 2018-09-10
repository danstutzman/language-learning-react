import App from './App' // eslint-disable-line no-unused-vars
import diffStrings from './diffStrings'
// import React from 'react'
// import ReactDOM from 'react-dom'

it('computes diff', () => {
   expect(diffStrings('GCATGCU', 'GATTACA')).toEqual([
     ['G', 'G'],
     ['C', ''],
     ['A', 'A'],
     ['T', 'T'],
     ['G', 'T'],
     ['',  'A'],
     ['C', 'C'],
     ['U', 'A'],
   ])
})

it('renders without crashing', () => {
  // const div = document.createElement('div')
  // ReactDOM.render(<App />, div)
  // ReactDOM.unmountComponentAtNode(div)
})
