// @flow
import App from './components/App'
import './index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'

const rootElement = document.getElementById('root')
if (rootElement === null) {
  throw Error("Can't find element with id=root")
}
ReactDOM.render(<App />, rootElement)
registerServiceWorker()
