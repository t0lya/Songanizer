import * as actionTypes from '../actions/actionTypes'

const initialState = {
    likedTracks: [],
    likedPlaylists: [],
    myPlaylists: [],
    youtubePlaylists: [],
    myCurrentPlaylist: {id: null, tracks: []}
}

const toggleLike = (state, action) => {
    let key = null
    if (action.payload.type === 'video') key = 'likedTracks'
    if (action.payload.type === 'playlist') key = 'likedPlaylists'
    let newList = state[key].map(item => {
        if (item.id === action.payload.id) {
            item.liked = !item.liked
            item.disliked = false
            return item
            }
        return item
    }).filter(item => {
        return item.liked === true
    })
    
    let newCurrentList = state.myCurrentPlaylist.tracks.map(track => {
        if (track.id === action.payload.id) {
            track.liked = !track.liked
            track.disliked = false
            return track
            }
        return track
    })

    return {
        ...state, 
        [key]: newList, 
        myCurrentPlaylist: {id: state.myCurrentPlaylist.id, tracks: newCurrentList}
    }
}

const postPlaylist = (state, action) => {
    switch (action.payload.option) {
        case 'add': {
            let myPlaylists = [...new Set(state.myPlaylists.concat(action.payload.item))]
            return {...state, myPlaylists}
        }
        case 'delete': {
            let myPlaylists = state.myPlaylists.filter(item => item.id !== action.payload.item.id)
            return {...state, myPlaylists}
        }
        default: {
            return state
        }
    }
}

const addTrackToPlaylist = (state, action) => {
    let myNewPlaylists = state.myPlaylists.map(list => {
        if (list.id === action.payload.playlistId) {
            list.tracks = [...new Set(list.tracks.concat(action.payload.track))]
            return list
        }
        return list
    })
    return {...state, myPlaylists: myNewPlaylists}
}

const removeTrackFromPlaylist = (state, action) => {
    let newCurrentList = {...state.myCurrentPlaylist}
    if (action.payload.playlistId === state.myCurrentPlaylist.id) {
        newCurrentList.tracks = newCurrentList.tracks.filter(item => {
            return item.id !== action.payload.track.id
        })
    }

    let myNewPlaylists = state.myPlaylists.map(list => {
        if (list.id === action.payload.playlistId) {
            return list.tracks.filter(track => track.id !== action.payload.track.id)
        }
        return list
    })
    return {...state, myPlaylists: myNewPlaylists, myCurrentPlaylist: newCurrentList}
}

export default (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.TOGGLE_LIKE: {
            return toggleLike(state, action)
        }
        case actionTypes.GET_LIKED_TRACKS: {
            return {...state, likedTracks: action.payload}
        }
        case actionTypes.GET_LIKED_PLAYLISTS: {
            return {...state, likedPlaylists: action.payload}
        }
        case actionTypes.GET_MY_PLAYLISTS: {
            return {...state, myPlaylists: action.payload}
        }
        case actionTypes.GET_MY_YOUTUBE_PLAYLISTS: {
            return {...state, youtubePlaylists: action.payload}
        }
        case actionTypes.POST_PLAYLIST: {
            return postPlaylist(state, action)
        }
        case actionTypes.ADD_TRACK_TO_PLAYLIST: {
            return addTrackToPlaylist(state, action)
        }
        case actionTypes.REMOVE_TRACK_FROM_PLAYLIST: {
            return removeTrackFromPlaylist(state, action)
        }
        case actionTypes.GET_TRACKS_FROM_MY_PLAYLIST: {
            return {...state, myCurrentPlaylist: action.payload}
        }
        case actionTypes.AUTH_ERROR:
        case actionTypes.LOGIN_FAIL:
        case actionTypes.LOGOUT_SUCCESS: {
            return initialState
        }
        default: {
            return state
        }
    }
}