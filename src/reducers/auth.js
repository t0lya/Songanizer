import { 
    USER_LOADING,
    USER_LOADED,
    LOGIN_SUCCESS,
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGOUT_SUCCESS
} from '../actions/actionTypes'

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    isLoading: false,
    user: null
}

export default (state = initialState, action) => {
    switch(action.type) {
        case USER_LOADING: {
            return {
                ...state, 
                isLoading: true
            }
        }
        case USER_LOADED: {
            return {
                ...state, 
                isAuthenticated: true, 
                isLoading: false, 
                user: action.payload
            }
        }
        case LOGIN_SUCCESS: {
            localStorage.setItem('token', action.payload.token)
            return {
                ...state, 
                isAuthenticated: true, 
                isLoading: false, 
                ...action.payload
            }
        }
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT_SUCCESS: {
            localStorage.removeItem('token')
            return {
                token: null, 
                isAuthenticated: false,
                isLoading: false,
                user: null
            }
        }
        default: {
            return state
        }
    }
}