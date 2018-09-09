import './App.css'
import React from 'react'

type Props = {|
  close: () => void,
  speak: () => void,
|}

export default class Quiz extends React.Component<Props> {
  speak = () => {
    this.props.speak()
  }

  render() {
    return <div className='Quiz'>
      <button onClick={this.props.close}>X</button>
      <button onClick={this.speak}>Replay</button>
    </div>
  }
}
