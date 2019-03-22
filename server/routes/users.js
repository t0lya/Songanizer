require('dotenv').config({ path: '../.env' })
const YOUR_CLIENT_ID = process.env.REACT_APP_YOUR_CLIENT_ID
const YOUR_CLIENT_SECRET = process.env.REACT_APP_YOUR_CLIENT_SECRET
const YOUR_REDIRECT_URL = process.env.REACT_APP_YOUR_REDIRECT_URL
const YOUR_JWT_SECRET = process.env.REACT_APP_YOUR_JWT_SECRET
const HOME_URL = process.env.REACT_APP_HOME_URL

const express = require('express');
const app = express.Router()
const { google } = require('googleapis')
const jwt = require('jsonwebtoken')
const passport = require('passport')

const passportJWT = passport.authenticate('jwt', { session: false });
const User = require('../db/user')
require('../passport')

const oauth2Client = new google.auth.OAuth2(
  YOUR_CLIENT_ID,
  YOUR_CLIENT_SECRET,
  YOUR_REDIRECT_URL
)
const scopes = [
  'https://www.googleapis.com/auth/youtube.force-ssl',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'
]

const youtube = google.youtube({
  version: 'v3',
  auth: oauth2Client
})

// Endpoints
app.get('/login', (req,res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes
  })
  res.redirect(url)
})

app.get('/callback', 
  async (req, res) => {
    try {
      // Trade the code received from Google for access tokens
      const {tokens} = await oauth2Client.getToken(req.query.code)
      const userInfo = jwt.decode(tokens.id_token)
      const user = {
        googleId: userInfo.sub,
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture}
      // Find user in database
      let currentUser = await User.findOne({googleId: userInfo.sub})
      // Create user in database if user does not exist
      if (!currentUser) {
        let newUser = new User(user)
        await newUser.save()   
      }
      // Sign a new JWT containing user ID and access tokens and send the JWT to client
      jwt.sign({
        googleId: userInfo.sub, 
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token},
      YOUR_JWT_SECRET,
      (error, token) => {
        if (error) console.log(error)
        res.redirect(HOME_URL+'/?token='+token)
      })
    } catch(error) {
      console.log(error)
    } 
  }
)

// private GET route that returns user's info
app.get('/profile', passportJWT, async (req, res) => {
  try {
    let googleId = jwt.decode(req.token).googleId
    let {name, email, picture} = await User.findOne({googleId})
    res.json({name, email, picture})
  } catch(e) {
    res.json({error: e, msg: e.message})
  }
})

// private GET route that grabs all the user's liked tracks/playlists from database
app.get('/likes/:type', passportJWT, async (req, res) => {
  try {
    let key = null
    if (req.params.type === 'tracks') key = 'likedTracks'
    if (req.params.type === 'playlists') key = 'likedPlaylists'
    let googleId = jwt.decode(req.token).googleId
    let user = await User.findOne({googleId})
    let items = user[key]
    items = items.map(({id, title, thumbnail}) => {return {id, title, thumbnail}})
    res.send({[key]: items})
  } catch (error) {
    console.log(error)
  }
})

// private POST route that adds a track/playlist to 'Liked' list
app.post('/likes', passportJWT, async (req, res) => {
  try {
    const item = req.body
    let googleId = jwt.decode(req.token).googleId
    if (item.type === 'video') {
      await User.findOneAndUpdate(
        {googleId, 'likedTracks.id': {$ne: item.id}},
        {$addToSet: {likedTracks: item}})
      }
    if (item.type === 'playlist') {
      await User.findOneAndUpdate(
        {googleId, 'likedPlaylists.id': {$ne: item.id}},
        {$addToSet: {likedPlaylists: item}})
      }
    res.send(item)
  } catch (error) {
    console.log(error)
  }
})

// private PUT route that removes a track/playlist from 'Liked' list
app.put('/likes', passportJWT, async (req, res) => {
  try {
    const item = req.body
    let googleId = jwt.decode(req.token).googleId
    if (item.type === 'video') {
      await User.findOneAndUpdate(
        {googleId},
        {$pull: {likedTracks: {id: item.id}}})
      }
    if (item.type === 'playlist') {
      await User.findOneAndUpdate(
        {googleId},
        {$pull: {likedPlaylists: {id: item.id}}})
      }
    res.send(item)
  } catch (error) {
    console.log(error)
  }
})


// private GET route that grabs all playlists created by the user
app.get('/playlists', passportJWT, async (req, res) => {
  try {
    let googleId = jwt.decode(req.token).googleId
    let user = await User.findOne({googleId})
    let items = user.myPlaylists
    items = items.map(({id, title, thumbnail, isPublic, tracks}) => {return {id, title, thumbnail, isPublic, tracks}})
    res.send({items})
  } catch (error) {
    console.log(error)
  }
})

// private POST route that adds playlist created by user
app.post('/playlists', passportJWT, async (req, res) => {
  try {
    const item = req.body
    console.log(item)
    let googleId = jwt.decode(req.token).googleId
    await User.findOneAndUpdate(
      {googleId, 'myPlaylists.id': {$ne: item.id}},
      {$addToSet: {myPlaylists: item}})
    res.send(item)
  } catch (error) {
    console.log(error)
  }
})

// private PUT route that removes a playlist created by user
app.put('/playlists', passportJWT, async (req, res) => {
  try {
    const item = req.body
    let googleId = jwt.decode(req.token).googleId
    await User.findOneAndUpdate(
      {googleId},
      {$pull: {myPlaylists: {id: item.id}}})
    res.send(item)
  } catch (error) {
    console.log(error)
  }
})

// private GET route that retrieves the user's playlists stored in Youtube
app.get('/playlists/youtube', passportJWT, async (req, res) => {
  try {
    let {accessToken, refreshToken} = jwt.decode(req.token)
    let tokens = {access_token: accessToken, refresh_token: refreshToken}
    oauth2Client.setCredentials(tokens)
    const getPlaylists = async (playlists = [], pageToken = null) => {
      try {
        let params = {
          mine: true,
          part: 'snippet',
          maxResults: 50
        }
        if (pageToken) params.pageToken = pageToken
        let response = await youtube.playlists.list(params)
        playlists = playlists.concat(response.data.items)
        if (response.data.nextPageToken) getPlaylists(playlists, response.data.nextPageToken)
        return playlists
      } catch (error) {
        console.log(error)
      } 
    }
    let playlists = await getPlaylists()
    res.send(playlists)
  } catch (error) {
    console.log(error)
  }
})

// private GET route that retrieves all tracks from user's playlist stored in Youtube
app.get('/playlists/youtube/tracks', passportJWT, async (req, res) => {
  try {
    const id = req.query.id
    const {accessToken, refreshToken} = jwt.decode(req.token)
    const tokens = {access_token: accessToken, refresh_token: refreshToken}
    oauth2Client.setCredentials(tokens)
    const getPlaylist = async (playlist = [], pageToken = null) => {
      try {
        let params = {
          playlistId: id,
          part: 'snippet',
          maxResults: 50
        }
        if (pageToken) params.pageToken = pageToken
        let response = await youtube.playlistItems.list(params)
        playlist = playlist.concat(response.data.items)
        if (response.data.nextPageToken) getPlaylist(playlist, response.data.nextPageToken)
        return playlist
      } catch (error) {
        console.log(error)
      } 
    }
    let playlist = await getPlaylist()
    res.send(playlist)
  } catch (error) {
    console.log(error)
  }
})

// private GET route that retrieves all tracks from playlist created by user (in myPlaylists)
app.get('/playlists/tracks', passportJWT, async (req, res) => {
  try {
    const googleId = jwt.decode(req.token).googleId
    const id = req.query.id
    let user = await User.findOne({googleId})
    let tracks = user.myPlaylists.filter(list => list.id === id)[0].tracks
    res.send(tracks)
  } catch (error) {
    console.log(error)
  }
})

// private POST route that adds track to playlist created by user
app.post('/playlists/tracks', passportJWT, async (req, res) => {
  try {
    const item = req.body
    console.log(item)
    const playlistId = req.query.id
    let googleId = jwt.decode(req.token).googleId
    await User.findOneAndUpdate(
      {googleId, 'myPlaylists.id': playlistId, 'myPlaylists.tracks.id': {$ne: item.id}},
      {$addToSet: {'myPlaylists.$.tracks': item}})
    res.send(item)
  } catch (error) {
    console.log(error)
  }
})

// private PUT route that removes a track from a playlist created by user
app.put('/playlists/tracks', passportJWT, async (req, res) => {
  try {
    const item = req.body
    const playlistId = req.query.id
    let googleId = jwt.decode(req.token).googleId
    await User.findOneAndUpdate(
      {googleId, 'myPlaylists.id': playlistId},
      {$pull: {'myPlaylists.$.tracks': {id: item.id}}})
    res.send(item)
  } catch (error) {
    console.log(error)
  }
})

module.exports = app;
