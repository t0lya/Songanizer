import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import qs from 'query-string'
import { ButtonGroup, Button } from 'reactstrap'
import InfiniteScroller from 'react-infinite-scroller'
import { withRouter } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faArrowLeft, faThumbsUp } from '@fortawesome/free-solid-svg-icons'

import TrackRow from '../components/TrackRow'
import { loadPlaylist, toggleLike, toggleDislike } from '../actions'

const mapDispatchToProps = { 
    loadPlaylist, 
    toggleLike,
    toggleDislike
}

const mapStateToProps = (state) => {
    return { 
        tracks: state.playlist.tracks,
        nextPageToken: state.playlist.nextPageToken
    }
}

class ConnectedPlaylist extends React.Component {
    componentDidMount() {
        let query = qs.parse(this.props.location.search)
        this.props.loadPlaylist(query.id)
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
                <InfiniteScroller
                    pageStart={0}
                    loadMore={(page) => {
                        this.props.loadPlaylist(
                            query.id, 
                            this.props.tracks.length > 0 ? this.props.tracks : [], 
                            this.props.nextPageToken)
                    }}
                    hasMore={this.props.nextPageToken ? true : false}
                    loader={<FontAwesomeIcon className='m-2' icon={faSpinner} pulse/>}>
                    {this.props.tracks.map((item, index, array) => {
                        return (
                            <TrackRow 
                                key={index} 
                                item={item}
                                index={index}
                                array={array}
                                enableDislike={false}/>
                        )})
                    }
                </InfiniteScroller>
            </div>
        )
    }
}

ConnectedPlaylist.propTypes = {
    tracks: PropTypes.array
}

export const Playlist = withRouter(connect(mapStateToProps, mapDispatchToProps)(ConnectedPlaylist))