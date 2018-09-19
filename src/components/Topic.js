// @flow
import type { Match } from 'react-router-dom'
import React from 'react'

type Props = {|
  match: Match
|}

export default class Topic extends React.PureComponent<Props> {
  render() {
    const { match } = this.props
    return <div>
      <h3>{match.params.topicId}</h3>
    </div>
  }
}
