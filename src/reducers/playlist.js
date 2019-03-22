import * as actionTypes from '../actions/actionTypes'

const initialState = {
    tracks: [],
    id: null,
    prevPageToken: null,
    nextPageToken: null
}

const loadPlaylist = (state, action) => {
    return {...state, ...action.payload }
}

const toggleLike = (state, action) => {
    let newTracks = state.tracks.map(item => {
        if (item.id === action.payload.id) {
            item.liked = !item.liked
            if (item.disliked === true) {
                item.disliked = false
            }
            return item
        }
        return item
    })
    return {...state, tracks: newTracks}
}

const toggleDislike = (state, action) => {
    let newTracks = state.tracks.map(item => {
        if (item.id === action.payload.id) {
            item.disliked = !item.disliked
            if (item.liked === true) {
                item.liked = false
            }
            return item
        }
        return item
    })
    return {...state, tracks: newTracks}
}   

export function playlist(state = initialState, action) {
    switch (action.type) {
        case actionTypes.LOAD_PLAYLIST: {
            return loadPlaylist(state, action)
        } 
        case actionTypes.TOGGLE_LIKE: {
            return toggleLike(state, action)
        }
        case actionTypes.TOGGLE_DISLIKE: {
            return toggleDislike(state, action)
        }
        default: {
            return state
        }
    }
}