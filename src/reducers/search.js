import * as actionTypes from '../actions/actionTypes'

const initialState = {
    foundItems: [],
    type: null,
    prevPageToken: null,
    nextPageToken: null,
    query: ''
}

const toggleLike = (state, action) => {
    let newFoundItems = state.foundItems.map(item => {
        if (item.id === action.payload.id) {
            item.liked = !item.liked
            if (item.disliked === true) {
                item.disliked = false
            }
            return item
        }
        return item
    })
    return {...state, foundItems: newFoundItems}
}

export const search = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SEARCH_ITEMS: {
            return {...state, ...action.payload} 
        }
        case actionTypes.CLEAR_SEARCH: {
            return initialState
        }
        case actionTypes.SET_QUERY: {
            return {...state, ...action.payload}
        }
        case actionTypes.TOGGLE_LIKE: {
            return toggleLike(state, action)
        }
        default: {
            return state
        }
    }
}

