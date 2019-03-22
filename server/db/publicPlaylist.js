const mongoose = require('mongoose')

const publicPlaylistSchema = new mongoose.Schema({
    ownerId: {
        type: String,
        required: true
    },
    id: {
        type: String
    },
    title: {
        type: String
    },
    thumbnail: {
        type: String
    },
    tracks: {
        type: [{
            id: String,
            title: String,
            thumbnail: String,
            uploaderId: String,
            likes: Number,
            dislikes: Number
        }]
    }
})

const publicPlaylist = mongoose.model('publicPlaylist', publicPlaylistSchema)
module.exports = publicPlaylist