const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      trim: true,
    },
    liked_songs: [{type: String, required: true, default: []}],
    generated_songs: [{type: String, required: true, default: []}]
  }, {collection : 'users_list'});

  module.exports = UserSchema;