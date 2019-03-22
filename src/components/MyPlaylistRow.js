import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { AllHtmlEntities as entities } from 'html-entities'
import { ButtonGroup, Button, ModalBody, ModalHeader, Modal } from 'reactstrap'
import { withRouter } from 'react-router-dom'
import qs from 'querystring'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListUl, faMinus } from '@fortawesome/free-solid-svg-icons'

import { 
    postPlaylist
} from '../actions'

const mapStateToProps = (state, ownProps) => {
    return {
        item: ownProps.item,
        isAuthenticated: state.auth.isAuthenticated
    }
}

const mapDispatchToProps = {
    postPlaylist
}

class MyPlaylistRow extends Component {
    static propTypes = {
        item: PropTypes.object,
        isAuthenticated: PropTypes.bool
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
                        onClick={()=>this.props.history.push('/my_playlist?'+qs.stringify(this.props.item))}>
                        <FontAwesomeIcon icon={faListUl}/>
                    </Button>
                    {this.props.isAuthenticated && <Button
                        color='dark'
                        onClick={()=>this.toggleModal()}> 
                        <FontAwesomeIcon icon={faMinus}/>
                    </Button>}
                </ButtonGroup>
            </div>  
            <div className='track-title p-2'>
                <span> {entities.decode(this.props.item.title)} </span>
            </div>
            <div>
                {this.state.modal && <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <ModalHeader className='bg-secondary' toggle={this.toggleModal}>
                        Remove from My Playlists
                    </ModalHeader>
                    <ModalBody className='bg-secondary'>
                        <span className='m-2'>Are you sure?</span>
                        <br/>
                        <Button color='dark' className='ml-2 mt-4'
                            onClick={()=>{
                                this.props.postPlaylist(this.props.item, 'delete')
                                this.toggleModal()
                            }}>
                                Yes
                        </Button>
                        <Button color='dark' className='ml-2 mt-4' onClick={()=>{this.toggleModal()}}>
                            No
                        </Button>
                    </ModalBody>
                </Modal>}
            </div>                     
        </div>
        )
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MyPlaylistRow))