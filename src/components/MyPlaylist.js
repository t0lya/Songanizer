import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import qs from 'query-string'
import { ButtonGroup, Button } from 'reactstrap'
import { withRouter } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faThumbsUp } from '@fortawesome/free-solid-svg-icons'

import TrackRow from '../components/TrackRow'
import { toggleLike, toggleDislike, getTracksFromMyPlaylist } from '../actions'

const mapDispatchToProps = { 
    toggleLike,
    toggleDislike,
    getTracksFromMyPlaylist
}

const mapStateToProps = (state) => {
    return { 
        myCurrentPlaylist: state.profile.myCurrentPlaylist
    }
}

class MyPlaylist extends React.Component {
    componentDidMount() {
        let query = qs.parse(this.props.location.search)
        this.props.getTracksFromMyPlaylist(query.id)
    }

    render() {
        let query = qs.parse(this.props.location.search)

        return (
            <div>
                <ButtonGroup className='m-2'>
                    <Button 
                        color='dark'
                        onClick={() => this.props.history.goBack()}>
                        <FontAwesomeIcon icon={faArrowLeft}/>
                    </Button>
                    {this.props.isAuthenticated && <Button
                        color='dark'
                        onClick={() => this.props.toggleLike(query)} 
                        active={this.props.item.liked}> 
                        <FontAwesomeIcon icon={faThumbsUp}/>
                    </Button>}
                </ButtonGroup>
                {this.props.myCurrentPlaylist.tracks.map((item, index, array) => {
                    console.log(item)
                    return (
                        <TrackRow 
                            key={index} 
                            item={item}
                            index={index}
                            array={array}
                            enableRemove={true}/>
                    )})
                }
            </div>
        )
    }
}

MyPlaylist.propTypes = {
    myPlaylists: PropTypes.array
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MyPlaylist))