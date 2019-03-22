import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import { playlist } from './playlist'
import { search } from './search'
import { player } from './player'
import error from './error'
import auth from './auth'
import profile from './profile'

export const rootReducer = combineReducers({
    playlist,
    search,
    player,
    error,
    auth,
    profile,
    form: formReducer
})

