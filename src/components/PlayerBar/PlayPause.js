import React, { Component } from 'react'
import { withMediaProps } from 'react-media-player'
import Transition from 'react-motion-ui-pack'
import { connect } from 'react-redux'

import { toggleAutoPlay } from '../../actions'

const MapStateToProps = (state) => {
  return {
    autoPlay: state.player.autoPlay
  }
}

const MapDispatchToProps = {
  toggleAutoPlay
}

class ScaleX extends Component {
  render() {
    return (
      <Transition
        component="g"
        enter={{ scaleX: 1 }}
        leave={{ scaleX: 0 }}
      >
        {this.props.children}
      </Transition>
    )
  }
}

class PlayPause extends Component {
  _handlePlayPause = () => {
    this.props.media.playPause()
    if (this.props.media.isPlaying !== null) {
      this.props.toggleAutoPlay(!this.props.media.isPlaying)
    }
  }

  _handleTrackClick = track => {
    this.setState({ currentTrack: track })
  }

  render() {
    const { media: { isPlaying }, className } = this.props
    return (
      <svg
        role="button"
        width="36px"
        height="36px"
        viewBox="0 0 36 36"
        className={className}
        onClick={this._handlePlayPause}
      >
      	<circle fill="#373D3F" cx="18" cy="18" r="18"/>
          <ScaleX>
            { isPlaying &&
              <g key="pause" style={{ transformOrigin: '0% 50%' }}>
        	      <rect x="12" y="11" fill="#CDD7DB" width="4" height="14"/>
        	      <rect x="20" y="11" fill="#CDD7DB" width="4" height="14"/>
              </g>
            }
          </ScaleX>
          <ScaleX>
            { !isPlaying &&
              <polygon
                key="play"
                fill="#CDD7DB"
                points="14,11 26,18 14,25"
                style={{ transformOrigin: '100% 50%' }}
              />
            }
          </ScaleX>
      </svg>
    )
  }
}

export default withMediaProps(connect(MapStateToProps ,MapDispatchToProps)(PlayPause))
