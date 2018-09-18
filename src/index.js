// @flow
import App from './App' // eslint-disable-line no-unused-vars
import './index.css'
import React from 'react' // eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'

const rootElement = document.getElementById('root')
if (rootElement === null) {
  throw Error("Can't find element with id=root")
}
ReactDOM.render(<App />, rootElement)
registerServiceWorker()
