import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { AllHtmlEntities as entities } from 'html-entities'
import { ButtonGroup, Button, Modal, ModalBody, ModalHeader } from 'reactstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faThumbsDown, faPlay, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

import { 
    toggleLike, 
    toggleDislike,
    setCurrentTrack,
    setPreviousTracks,
    toggleAutoPlay,
    setNextTracks,
    getMyPlaylists,
    addTrackToPlaylist,
    removeTrackFromPlaylist
} from '../actions'

const mapStateToProps = (state, ownProps) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        autoPlay: state.player.autoPlay,
        currentTrack: state.player.currentTrack,
        item: ownProps.item,
        index: ownProps.index,
        array: ownProps.array,
        myCurrentPlaylist: state.profile.myCurrentPlaylist,
        enableDislike: ownProps.enableDislike,
        enableRemove: ownProps.enableRemove,
        myPlaylists: state.profile.myPlaylists,
    }
}

const mapDispatchToProps = {
    toggleLike,
    toggleDislike,
    setCurrentTrack,
    setPreviousTracks,
    toggleAutoPlay,
    setNextTracks,
    getMyPlaylists,
    addTrackToPlaylist,
    removeTrackFromPlaylist
}

class TrackRow extends Component {
    static propTypes = {
        isAuthenticated: PropTypes.bool,
        autoPlay: PropTypes.bool,
        currentTrack: PropTypes.object,
        item: PropTypes.object,
        index: PropTypes.number,
        array: PropTypes.array,
        myCurrentPlaylist: PropTypes.object,
        enableDislike: PropTypes.bool,
        enableRemove: PropTypes.bool,
        myPlaylists: PropTypes.array,
    }

    static defaultProps = {
        enableDislike: false,
        enableRemove: false
    }

    constructor(props) {
        super(props);
        this.state = {
          modal: false
        }
        this.toggleModal = this.toggleModal.bind(this)
    }
    
    toggleModal() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }))
    }

    handleClickPlay(item, nextTracks, prevTracks) {
        this.props.setCurrentTrack(item.id, item.title)
        this.props.setNextTracks(nextTracks.map(track => {
            return {src: track.id, label: track.title}
        }))
        this.props.setPreviousTracks(prevTracks.map(track => {
            return {src: track.id, label: track.title}
        }))
        this.props.toggleAutoPlay(true)
    }

    render() {
        return (
        <div className='d-flex flex-row align-items-center' align='left'>
            <div className='p-2'>
                <img 
                    className='img-thumbnail bg-dark border-dark' 
                    alt={'Thumbnail for ' + this.props.item.title} 
                    src={this.props.item.thumbnail} />
            </div>
            <div className='p-2'>
                <ButtonGroup>
                    <Button 
                        color='dark'
                        onClick={() => this.handleClickPlay(
                            this.props.item, 
                            this.props.array.slice(this.props.index+1),
                            this.props.array.slice(0,this.props.index))}>
                        <FontAwesomeIcon icon={faPlay}/>
                    </Button>
                    {this.props.isAuthenticated && <Button
                        color='dark'
                        onClick={() => this.props.toggleLike(this.props.item)} 
                        active={this.props.item.liked}> 
                        <FontAwesomeIcon icon={faThumbsUp}/>
                    </Button>}
                    {this.props.enableDislike && this.props.isAuthenticated && <Button 
                        color='dark'
                        onClick={() => this.props.toggleDislike(this.props.item.id)}
                        active={this.props.item.disliked}> 
                        <FontAwesomeIcon icon={faThumbsDown}/>
                    </Button>}
                    {this.props.isAuthenticated && <Button 
                        color='dark'
                        onClick={() => {
                            this.toggleModal()
                            this.props.getMyPlaylists()
                        }}
                        active={this.state.modal}> 
                        <FontAwesomeIcon icon={faPlus}/>
                    </Button>}
                    {this.props.isAuthenticated && this.props.enableRemove && <Button 
                        color='dark'
                        onClick={() => this.props.removeTrackFromPlaylist(this.props.item, this.props.myCurrentPlaylist.id)}> 
                        <FontAwesomeIcon icon={faMinus}/>
                    </Button>}
                </ButtonGroup>
            </div>  
            <div className='track-title p-2'>
                <span> {entities.decode(this.props.item.title)} </span>
            </div> 
            <div>
                {this.state.modal && <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <ModalHeader className='bg-secondary' toggle={this.toggleModal}>Add Track to My Playlist</ModalHeader>
                    <ModalBody className='bg-secondary'>
                        {this.props.myPlaylists.map((list, index) => {
                            return (
                                <div className='d-flex flex-row align-items-center' key={index} align='left'>
                                    <div className='p-2'>
                                        <img 
                                            className='img-thumbnail bg-dark border-dark'  
                                            alt={'Thumbnail for ' + list.title} 
                                            src={list.thumbnail} />
                                    </div>
                                    <div className='p-2'>
                                        <Button
                                            color='dark'
                                            onClick={() => {
                                                this.props.addTrackToPlaylist(this.props.item, list.id)
                                                this.toggleModal()}}> 
                                            <FontAwesomeIcon icon={faPlus}/>
                                        </Button>
                                    </div>  
                                    <div className='track-title p-2'>
                                        <span> {entities.decode(list.title)} </span>
                                    </div>                      
                                </div>
                            )
                        })}
                    </ModalBody>
                </Modal>}
            </div>                     
        </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackRow)
