import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Media } from 'reactstrap'

import PlaylistRow from './PlaylistRow'
import MyPlaylistRow from './MyPlaylistRow'
import TrackRow from './TrackRow'
import AddPlaylist from './AddPlaylist'
import { 
    getLikedTracks,
    getLikedPlaylists,
    getMyPlaylists, 
    setCurrentTrack, 
    setNextTracks, 
    toggleAutoPlay
} from '../actions'

const mapStateToProps = (state) => {
    return {
        likedTracks: state.profile.likedTracks,
        likedPlaylists: state.profile.likedPlaylists,
        myPlaylists: state.profile.myPlaylists,
        user: state.auth.user
    }
}

const mapDispatchToProps = {
    getLikedTracks,
    getLikedPlaylists,
    getMyPlaylists,
    setCurrentTrack,
    setNextTracks,
    toggleAutoPlay
}

class ConnectedProfile extends Component {
    componentDidMount() {
        this.props.getLikedTracks()
        this.props.getLikedPlaylists()
        this.props.getMyPlaylists()
    }

    render() {
        return (
        <div>
            <ul className="nav nav-tabs navbar-dark mb-2" id="profile" role="tablist">
                <li className="nav-item">
                    <a className="nav-link active" id="liked-tracks-tab" data-toggle="tab" href="#liked-tracks" role="tab" aria-controls="liked-tracks" aria-selected="true">
                        Liked Tracks
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" id="playlists-tab" data-toggle="tab" href="#playlists" role="tab" aria-controls="playlists" aria-selected="false">
                        Liked Playlists
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" id="my-playlists-tab" data-toggle="tab" href="#my-playlists" role="tab" aria-controls="my-playlists" aria-selected="false">
                        My Playlists
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" id="account-tab" data-toggle="tab" href="#account" role="tab" aria-controls="account" aria-selected="false">   
                        Account
                    </a>
                </li>
            </ul>
            <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="liked-tracks" role="tabpanel" aria-labelledby="liked-tracks-tab">
                    {this.props.likedTracks.map((item, index, array) => {
                        return (
                            <TrackRow 
                                key={index} 
                                item={item}
                                index={index}
                                array={array}
                                enableDislike={false}/>
                        )
                    })}
                </div>
                <div className="tab-pane fade" id="playlists" role="tabpanel" aria-labelledby="playlists-tab">
                    {this.props.likedPlaylists.map((item, index) => {
                        return (
                            <PlaylistRow 
                                key={index} 
                                item={item}/>
                        )
                    })}
                </div>
                <div className="tab-pane fade" id="my-playlists" role="tabpanel" aria-labelledby="my-playlists-tab">
                    <AddPlaylist/>
                    {this.props.myPlaylists.map((item, index) => {
                        return (
                            <MyPlaylistRow 
                                key={index} 
                                item={item}/>
                        )
                    })}
                </div>
                <div className="tab-pane fade" id="account" role="tabpanel" aria-labelledby="account-tab">
                <Media>
                    <Media className='img-thumbnail bg-dark border-dark m-2' left href="#">
                        <Media object src={this.props.user? this.props.user.picture : null} alt="Profile picture" />
                    </Media>
                    <Media className='m-2' body>
                        <Media heading>
                        {this.props.user? this.props.user.name : null}
                        </Media>
                        {'Email: ' + (this.props.user ? this.props.user.email : null)}
                    </Media>
                </Media>
                </div>
            </div>
        </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedProfile)
