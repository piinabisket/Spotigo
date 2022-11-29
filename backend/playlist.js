const mongoose = require("mongoose");
const { Schema } = mongoose; 

const PlaylistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  sid: {
    type: String,
    required: true,
    trim: true,
  },
  bpm: {
     type: Number,
     required: true,
     trim: true,
  },
  description: {
    type: String,
    default: "description goes here",
    trim: true
  },
  genre: {
    type: String,
    required: true,
    trim: true,
  },
  views: {
    type: Number,
    default: 0,
    required: false,
    trim: true,
  },
  album_cover:{
    type: String,
    required: true,
    trim: true
  },
  date: {
     type: Date,
     default: Date.now,
     required: false,
     trim : true
  }
}, {collection : 'playlist_list'});


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  liked_playlists: [{ type: Schema.Types.ObjectId, ref: 'Playlist' }],
  generated_playlists: [{ type: Schema.Types.ObjectId, ref: 'Playlist' }]

 
}, {collection : 'users'});

const Playlist = mongoose.model('Playlist', PlaylistSchema);

module.exports = PlaylistSchema;
module.exports = UserSchema;