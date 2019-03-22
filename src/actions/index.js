import jwt from 'jsonwebtoken'
import axios from 'axios'

import * as actionTypes from './actionTypes'

const part = 'snippet'
const url = process.env.REACT_APP_SERVER_URL
const API_KEY = process.env.REACT_APP_API_KEY

const authHeaders = (token) => {
  return { headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  }
}

export function loadPlaylist(playlistId, playlist = [], pageToken = null) {
  return async function(dispatch) {
    try {
      let url = `https://www.googleapis.com/youtube/v3/playlistItems`
      let data = {
        part,
        maxResults: 50,
        playlistId,
        key: API_KEY
      }
      if (pageToken) data.pageToken = pageToken
      let res = await axios.get(url, {params: data})
      let tracks = playlist.concat(res.data.items.map((item) => {
        return {
          id: item.snippet.resourceId.videoId, 
          title: item.snippet.title, 
          thumbnail: item.snippet.thumbnails ? item.snippet.thumbnails.default.url : null, 
          liked: false,
          disliked: false,
          type: 'video'
        }
      }))
      dispatch({type: actionTypes.LOAD_PLAYLIST, payload: {
        tracks, 
        id: playlistId, 
        prevPageToken: res.data.prevPageToken,
        nextPageToken: res.data.nextPageToken}
      })
    } catch(error) {
      console.log(error)
    }
  }
}

export function searchItems(type = 'video', query = (type === 'video' ? '' : 'music'), items = [], pageToken = null) {
  return function(dispatch) {
      let urlQuery = encodeURIComponent(query)
      let url = `https://www.googleapis.com/youtube/v3/search`
      let data = {
        part,
        q: urlQuery,
        maxResults: 10,
        type, // video or playlist
        key: API_KEY
      }
      if (type === 'video') data.videoCategoryId= 10
      if (type === 'playlist' && query.length === 0) data.q = 'music'
      if (pageToken) data.pageToken = pageToken

      axios.get(url, {params: data})
      .then(res => {
        let foundItems = items.concat(res.data.items
          .map((item) => {
          let newItem = {
            id: item.id[type+'Id'], 
            title: item.snippet.title, 
            thumbnail: item.snippet.thumbnails ? item.snippet.thumbnails.default.url : null,
            liked: false,
            disliked: false,
            type
          }
          return newItem
          }))
        return {
          foundItems, 
          prevPageToken: res.data.prevPageToken, 
          nextPageToken: res.data.nextPageToken,
          type,
          query
        }
      })
      .then(res => {
        dispatch({type: actionTypes.SEARCH_ITEMS, payload: res})
      })
      .catch(error => console.log(error))
  }
}

export const clearSearch = () => {
  return {type: actionTypes.CLEAR_SEARCH}
}

export const setQuery = (type = 'video', query = '') => {
  return {type: actionTypes.SET_QUERY, payload: {type, query}}
}

// Grabs user's liked tracks from server
export const getLikedTracks = () => (dispatch, getState) => {
  axios.get(url+'/users/likes/tracks', authHeaders(getState().auth.token))
  .then(res => {
    let likedTracks = res.data.likedTracks.map(track => {
      track.liked = true
      track.disliked = false
      track.type = 'video'
      return track
    })
    dispatch({type: actionTypes.GET_LIKED_TRACKS, payload: likedTracks})
  })
  .catch(error => console.log(error))
}

// Grabs user's liked playlists from server
export const getLikedPlaylists = () => (dispatch, getState) => {
  axios.get(url+'/users/likes/playlists', authHeaders(getState().auth.token))
  .then(res => {
    let likedPlaylists = res.data.likedPlaylists.map(item => {
      item.liked = true
      item.disliked = false
      item.type = 'playlist'
      return item
    })
    dispatch({type: actionTypes.GET_LIKED_PLAYLISTS, payload: likedPlaylists})
  })
  .catch(error => console.log(error))
}

// Grab playlists from user's Youtube account
export const getYoutubePlaylists = () => (dispatch, getState) => {
  axios.get(url+'/users/playlists/youtube', authHeaders(getState().auth.token))
  .then(res => {
    let playlists = res.data.map(item => {
      return {
        id: item.id, 
        title: item.snippet.title, 
        thumbnail: item.snippet.thumbnails ? item.snippet.thumbnails.default.url : null,
        liked: false,
        disliked: false,
        type: 'playlist'
      }            
    })
    dispatch({type: actionTypes.GET_MY_YOUTUBE_PLAYLISTS, payload: playlists})
  })
  .catch(error => console.log(error))
}

// Grab playlists from 'My Playlists' in Songanizer API
export const getMyPlaylists = () => (dispatch, getState) => {
  axios.get(url+'/users/playlists', authHeaders(getState().auth.token))
  .then(res => {
    dispatch({type: actionTypes.GET_MY_PLAYLISTS, payload: res.data.items})
  })
  .catch(error => console.log(error))
}

// Add or deletes (depending on option) playlist from 'My Playlists'
export const postPlaylist = (list, option = 'add') => (dispatch, getState) => {
  let method = ''
  if (option === 'add') {
    method = 'post'
  } else if (option === 'delete') {
    method = 'put'
  } else {
    return
  }
  axios[method](url+'/users/playlists', list, authHeaders(getState().auth.token))
  .then(res => {
    dispatch({type: actionTypes.POST_PLAYLIST, payload: {item: res.data, option}})
  })
  .catch(error => console.log(error)) 
}

// Imports playlist and all its tracks from Youtube
export const importYoutubePlaylist = (list) => async (dispatch, getState) => {
  try {
    let res = await axios.get(url+'/users/playlists/youtube/tracks?id='+list.id, authHeaders(getState().auth.token))
    list.tracks = res.data.map(item => {
      return {
        id: item.snippet.resourceId.videoId, 
        title: item.snippet.title, 
        thumbnail: item.snippet.thumbnails ? item.snippet.thumbnails.default.url : null
      }
    })
    list.isPublic = false
    let res2 = await axios.post(url+'/users/playlists', list, authHeaders(getState().auth.token))
    dispatch({type: actionTypes.POST_PLAYLIST, payload: {item: res2.data, option: 'add'}})
  } catch(error) {
    console.log(error)
  }
}

export const getTracksFromMyPlaylist = (playlistId) => async (dispatch, getState) => {
  try {
    let res = await axios.get(url+'/users/playlists/tracks?id='+playlistId, authHeaders(getState().auth.token))
    let tracks = res.data.map(item => {return {...item, liked: false, disliked: false, type: 'video'}})
    dispatch({type: actionTypes.GET_TRACKS_FROM_MY_PLAYLIST, payload: {tracks, id: playlistId}})
  } catch (error) {
    console.log(error)
  }
}

export const addTrackToPlaylist = (track, playlistId) => async (dispatch, getState) => {
  try {
    let res = await axios.post(url+'/users/playlists/tracks?id='+playlistId, track, authHeaders(getState().auth.token))
    dispatch({type: actionTypes.ADD_TRACK_TO_PLAYLIST, payload: {track: res.data, playlistId}})
  } catch (error) {
    console.log(error)
  }
}

export const removeTrackFromPlaylist = (track, playlistId) => async (dispatch, getState) => {
  try {
    let res = await axios.put(url+'/users/playlists/tracks?id='+playlistId, track, authHeaders(getState().auth.token))
    dispatch({type: actionTypes.REMOVE_TRACK_FROM_PLAYLIST, payload: {track: res.data, playlistId}})
  } catch (error) {
    console.log(error)
  }
}

export const toggleLike = (track) => (dispatch, getState) => {
  const liked = track.liked
  let method = ''
  if (liked === false) {
    method = 'post'
  } else if (liked === true) {
    method = 'put'
  } else {
    return
  }
  axios[method](url+'/users/likes', track, authHeaders(getState().auth.token))
  .then(res => {
    dispatch({type: actionTypes.TOGGLE_LIKE, payload: res.data})
  })
  .catch(error => console.log(error))
}

export function toggleDislike(id) {
  return {type: actionTypes.TOGGLE_DISLIKE, payload: id}
}

//Player
export function toggleAutoPlay(state = null) {
  return {type: actionTypes.TOGGLE_AUTOPLAY, payload: state}
}

export function toggleRepeat() {
  return {type: actionTypes.TOGGLE_REPEAT}
}

export function setPreviousTracks(array) {
  return {
    type: actionTypes.SET_PREVIOUS_TRACKS, 
    payload: array.map(track => {
    return {id: track.src, src: `https://www.youtu.be/${track.src}`, label: track.label }
  })}
}

export function setCurrentTrack(src, label) {
  return {type: actionTypes.SET_CURRENT_TRACK, payload: {id: src, src: `https://www.youtu.be/${src}`, label}}
}

export function setNextTracks(array) {
  return {
    type: actionTypes.SET_NEXT_TRACKS, 
    payload: array.map(track => {
      return {id: track.src, src: `https://www.youtu.be/${track.src}`, label: track.label }
    })}
}

export function playPreviousTracks(amount) {
  return {type: actionTypes.PLAY_PREVIOUS_TRACKS, payload: amount}
}

export function playNextTrack() {
  return {type: actionTypes.PLAY_NEXT_TRACK}
}


//Authorization
export const getErrors = (msg, status, id = null) => {
  return {type: actionTypes.GET_ERRORS, payload: {msg, status, id}}
}

export const clearErrors = () => {
  return {type: actionTypes.CLEAR_ERRORS}
}

export const loadUser = () => async (dispatch, getState) => {
  dispatch({type: actionTypes.USER_LOADING})
  // Fetch user profile from our server
  let newUrl = url + '/users/profile'
  try {
    let res = await axios.get(newUrl, authHeaders(getState().auth.token))
    dispatch({type:actionTypes.USER_LOADED, payload: res.data})
  } catch(error) {
    dispatch(getErrors(error.response.data, error.response.status))
    dispatch({type: actionTypes.AUTH_ERROR})
  }
}

export const login = (token) => (dispatch) => {
  if (token) {
    let { name, email } = jwt.decode(token)
    dispatch({type:actionTypes.LOGIN_SUCCESS, payload: {user: { name, email }, token}})
  } else dispatch({type: actionTypes.LOGIN_FAIL})
}

export const logout = () => {
  return {type: actionTypes.LOGOUT_SUCCESS}
}

