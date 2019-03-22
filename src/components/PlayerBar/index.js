import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Media, Player, controls, utils } from 'react-media-player'
import { AllHtmlEntities as entities } from 'html-entities'

import PlayPause from './PlayPause'
import MuteUnmute from './MuteUnmute'
import Repeat from './Repeat'
import Title from './Title'
import { playNextTrack, playPreviousTracks, toggleRepeat, toggleAutoPlay } from '../../actions'
import './playerBar.scss'

const { CurrentTime, SeekBar, Duration, Volume } = controls
const { keyboardControls } = utils

const mapStateToProps = (state) => {
  return {
    previousTracks: state.player.previousTracks,
    currentTrack: state.player.currentTrack,
    nextTracks: state.player.nextTracks,
    autoPlay: state.player.autoPlay,
    repeatTrack: state.player.repeat
   }
}

const mapDispatchToProps = {
  playNextTrack,
  playPreviousTracks,
  toggleRepeat,
  toggleAutoPlay
}

const PrevTrack = (props) => (
  <svg width="10px" height="12px" viewBox="0 0 10 12" {...props}>
    <polygon fill="#FAFBFB" points="10,0 2,4.8 2,0 0,0 0,12 2,12 2,7.2 10,12"/>
  </svg>
)

const NextTrack = (props) => (
  <svg width="10px" height="12px" viewBox="0 0 10 12" {...props}>
    <polygon fill="#FAFBFB" points="8,0 8,4.8 0,0 0,12 8,7.2 8,12 10,12 10,0"/>
  </svg>
)

class ConnectedPlayerBar extends Component {
  _handlePrevTrack = () => {
    if (this.props.repeatTrack === true) {
      return 
    }
    this.props.playPreviousTracks(1)
  }

  _handleNextTrack = () => {
    if (this.props.repeatTrack === true) {
      return 
    }
    if (this.props.nextTracks.length !== 0) {
      this.props.playNextTrack()
    } else if (this.props.previousTracks.length !== 0) {
      this.props.playPreviousTracks()
    } else {
      this.props.toggleAutoPlay()
    } 
  }

  _handleRepeatTrack = () => {
    this.props.toggleRepeat()
  }

  render() {
    const src = this.props.currentTrack.src
    const { currentTrack, repeatTrack, autoPlay } = this.props
    return (
      <div className='footer fixed-bottom bg-dark border-top border-secondary'>
      <Media>
        { mediaProps =>
          <div
            className='media-player'
            onKeyDown={keyboardControls.bind(null, mediaProps)}
            tabIndex="0"
          >
            <div
              className="d-none media-player-element"
              onClick={() => mediaProps.playPause()}
            >
              <Player
                src={src}
                loop={repeatTrack}
                autoPlay={autoPlay}
                onEnded={this._handleNextTrack}
              />
            </div>
            <div className="media-controls media-controls--full">
              <Title className="media-control-title" title={entities.decode(currentTrack.label)}/>
              <div className="media-row">
                <div className="media-control-group">
                  <PrevTrack className="media-control media-control--prev-track" onClick={this._handlePrevTrack}/>
                  <PlayPause className="media-control media-control--play-pause"/>
                  <NextTrack className="media-control media-control--next-track" onClick={this._handleNextTrack}/>
                  <CurrentTime className="media-control media-control--current-time"/>
                </div>
                <div className="media-control-group media-control-group--seek">
                <SeekBar className="media-control media-control--seekbar"/>
                </div>
                <div className="media-control-group">
                  <Duration className="media-control media-control--duration"/>
                  <Repeat
                    className="media-control media-control--repeat"
                    isActive={repeatTrack}
                    onClick={this._handleRepeatTrack} />
                  <MuteUnmute className="media-control media-control--mute-unmute"/>
                  <Volume className="media-control media-control--volume"/>
                </div>
              </div>
            </div>
          </div>
        }
      </Media>
      </div>
    )
  }
}

ConnectedPlayerBar.propTypes = {
  previousTracks: PropTypes.array,
  currentTrack: PropTypes.object,
  nextTracks: PropTypes.array,
  autoPlay: PropTypes.bool,
  repeatTrack: PropTypes.bool
}

export const PlayerBar = connect(mapStateToProps, mapDispatchToProps)(ConnectedPlayerBar)