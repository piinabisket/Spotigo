const mongoose = require("mongoose");

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

module.exports = PlaylistSchema;
