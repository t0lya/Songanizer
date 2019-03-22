const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    picture: {
        type: String
    },
    likedTracks: {
        type: [{
            id: String,
            title: String,
            thumbnail: String
        }]
    },
    likedPlaylists: {
        type: [{
            id: String,
            title: String,
            thumbnail: String
        }]
    },
    myPlaylists: {
        type: [{
            id: String,
            title: String,
            thumbnail: String,
            isPublic: Boolean,
            tracks: {
                type: [{
                    id: String,
                    title: String,
                    thumbnail: String
                }]
            }
        }]
    }
})

const User = mongoose.model('user', userSchema)
module.exports = User