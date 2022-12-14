const mongoose = require('mongoose');
const PlaylistSchema = require("./playlist");

let dbConnection;

function setConnection(newConn) {
   dbConnection = newConn;
   return dbConnection;ß
}

function getDbConnection() {
   if (!dbConnection) {
      dbConnection = mongoose.createConnection("mongodb+srv://fdudley:rPQfpsytNB7oC4Fy@spotigodb.bxewpi2.mongodb.net/?retryWrites=true&w=majority", {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      });
   }
   return dbConnection;
}

/* SID: Spotify ID; not to be mistaken with _id, _id is unused.
*/
async function postPlaylist(playlist) {
   const playlistModel = getDbConnection().model("Playlist", PlaylistSchema);
   try {
      const playlistToAdd = new playlistModel(playlist);
      const savedPlaylist = await playlistToAdd.save()
      return savedPlaylist;
   } catch (error) {
      console.log(error);
      return false;
   }
}

async function deleteBySid(sid) {
   const playlistModel = getDbConnection().model("Playlist", PlaylistSchema);
   try {
      return await playlistModel.deleteOne({ 'sid': sid });
   }
   catch (error) {
      console.log(error);
      return false;
   }
}

async function getPlaylists() {
   const playlistModel = getDbConnection().model("Playlist", PlaylistSchema);
   let result;
   result = await playlistModel.find();
   return result;
}

async function updatePlaylistArt(id, albumCover) {
   const playlistModel = getDbConnection().model("Playlist", PlaylistSchema);
   const result = await playlistModel.updateOne({ 'sid': id }, { 'album_cover': albumCover });
   return result;
}

async function getBySid(sid) {
   const playlistModel = getDbConnection().model("Playlist", PlaylistSchema);
   return await playlistModel.find({ 'sid': sid });
}

exports.setConnection = setConnection;
exports.updatePlaylistArt = updatePlaylistArt;
exports.postPlaylist = postPlaylist;
exports.deleteBySid = deleteBySid;
exports.getPlaylists = getPlaylists;
exports.getBySid = getBySid;
