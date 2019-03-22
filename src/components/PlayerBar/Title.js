import React, { Component } from 'react'
import { withMediaProps } from 'react-media-player'

import { ReactComponent as LoadingIcon } from './LoadingIcon.svg'

class Title extends Component {
  render() {
    if (this.props.media.progress === 0 && this.props.title) {
        return <LoadingIcon/>
    } else {
        return <div>{this.props.title}</div>
    }
  } 
}

export default withMediaProps(Title)