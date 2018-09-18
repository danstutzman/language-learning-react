// @flow
import type { Match } from 'react-router-dom'
import React from 'react'

type Props = {|
  match: Match
|}

export default class Topic extends React.Component<Props> {
  render() {
    const { match } = this.props
    return <div>
      <h3>{match.params.topicId}</h3>
    </div>
  }
}
