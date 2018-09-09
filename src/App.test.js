import ReactDOM from 'react-dom'
import App from './App' // eslint-disable-line no-unused-vars

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
  ReactDOM.unmountComponentAtNode(div)
})
