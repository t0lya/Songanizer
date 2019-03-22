import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { AllHtmlEntities as entities } from 'html-entities'
import { ButtonGroup, Button } from 'reactstrap'
import { withRouter } from 'react-router-dom'
import qs from 'querystring'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faListUl, faPlus } from '@fortawesome/free-solid-svg-icons'

import { 
    toggleLike,
    importYoutubePlaylist
} from '../actions'

const mapStateToProps = (state, ownProps) => {
    return {
        item: ownProps.item,
        isAuthenticated: state.auth.isAuthenticated
    }
}

const mapDispatchToProps = {
    toggleLike,
    importYoutubePlaylist
}

class PlaylistRow extends Component {
    static propTypes = {
        item: PropTypes.object,
        isAuthenticated: PropTypes.bool
    }

    constructor(props) {
        super(props)
        this.state = { playlistImported: false}
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
                        onClick={()=>this.props.history.push('/playlist?'+qs.stringify(this.props.item))}>
                        <FontAwesomeIcon icon={faListUl}/>
                    </Button>
                    {this.props.isAuthenticated && <Button
                        color='dark'
                        onClick={()=>this.props.toggleLike(this.props.item)} 
                        active={this.props.item.liked}> 
                        <FontAwesomeIcon icon={faThumbsUp}/>
                    </Button>}
                    {this.props.isAuthenticated && <Button
                        color='dark'
                        onClick={()=>{
                            this.props.importYoutubePlaylist(this.props.item)
                            this.setState({playlistImported: true})
                        }} 
                        active={this.state.playlistImported}> 
                        <FontAwesomeIcon icon={faPlus}/>
                    </Button>}
                </ButtonGroup>
            </div>  
            <div className='track-title p-2'>
                <span> {entities.decode(this.props.item.title)} </span>
            </div>                      
        </div>
        )
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PlaylistRow))