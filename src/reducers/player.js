import _ from 'lodash'

import * as actionTypes from '../actions/actionTypes'

const initialState = {
    autoPlay: false,
    repeat: false,
    previousTracks: [],
    currentTrack: {},
    nextTracks: []
}

const toggleAutoPlay = (state, action) => {
    if (action.payload === null) {
        return Object.assign({}, state, { autoPlay: !state.autoPlay })
    }
    return Object.assign({}, state, { autoPlay: action.payload })
}

const toggleRepeat = (state, action) => {
    return Object.assign({}, state, { repeat: !state.repeat })
}

const setPreviousTracks = (state, action) => {
    return Object.assign({}, state, {previousTracks: state.previousTracks.concat(action.payload)})
}

const setCurrentTrack = (state, action) => {
    return Object.assign({}, state, {currentTrack: action.payload })
}

const setNextTracks = (state, action) => {
    if (action.payload === []) {
        return Object.assign({}, state, {nextTracks: []})
    }
    return Object.assign({}, state, {nextTracks: _.uniqBy(action.payload.concat(state.nextTracks), 'src') } )
}

const playPreviousTracks = (state, action) => {
    if (!action.payload) {
        let newPreviousTracks = state.previousTracks.slice()
        let currentTrack = newPreviousTracks.shift()
        return Object.assign({}, state, {previousTracks: [state.currentTrack], currentTrack, nextTracks: newPreviousTracks})
    } else {
        let newPreviousTracks = state.previousTracks.slice(0,state.previousTracks.length - action.payload)
        return Object.assign({}, state, {
            previousTracks: newPreviousTracks, 
            currentTrack: state.previousTracks.slice(-action.payload)[0],
            nextTracks: state.previousTracks.slice(1-action.payload).concat(state.currentTrack.concat(state.newNextTracks))})        
    }
    
}

const playNextTrack = (state, action) => {
    let newNextTracks = []
    if (state.nextTracks.length > 1) newNextTracks = state.nextTracks.slice(1)
    return Object.assign({}, state, {
        previousTracks: state.nextTracks.length === 0 ? state.previousTracks : state.previousTracks.concat(state.currentTrack),
        currentTrack: state.nextTracks.length === 0 ? state.currentTrack : state.nextTracks[0],
        nextTracks: newNextTracks
    })
}

export const player = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.TOGGLE_AUTOPLAY: {
            return toggleAutoPlay(state, action)
        }
        case actionTypes.TOGGLE_REPEAT: {
            return toggleRepeat(state, action)
        }
        case actionTypes.SET_PREVIOUS_TRACKS: {
            return setPreviousTracks(state, action)
        }
        case actionTypes.SET_CURRENT_TRACK: {
            return setCurrentTrack(state, action)
        }
        case actionTypes.SET_NEXT_TRACKS: {
            return setNextTracks(state, action)
        }
        case actionTypes.PLAY_PREVIOUS_TRACKS: {
            return playPreviousTracks(state, action)
        }
        case actionTypes.PLAY_NEXT_TRACK: {
            return playNextTrack(state, action)
        }
        default: {
            return state
        }
    }
}