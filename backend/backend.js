const express = require('express');
const cors = require('cors');

const playlistUtil = require('./model/playlist_utils');
const userUtil = require('./model/user_utils');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

/* send to login page */

app.get('/', (req, res) => {
  res.send('Hello World!');
});

/* send to home page */

app.get('/home', async (req, res) => {
   try {
      const result = await playlistUtil.getPlaylists();
      res.send({playlist_list: result});
   }
   catch(error){
      console.log(error);
      res.status(500).send('Server Error')
   }
});

app.get('/users', async (req, res) => {
   const email = req.query['email'];
   try {
      const result = await userUtil.getUsers(email);
      res.send({users_list: result});
   }
   catch(error){
      console.log(error);
      res.status(500).send('Server Error')
   }
});

app.post('/users', async (req, res) => {
   const user = req.body;
   const savedUser = await userUtil.postUser(user);
   if (savedUser)
       res.status(201).send(savedUser);
   else
       res.status(500).end();
});

app.put('/users', async (req, res) => {
   const user = req.body;
   const updatedUser = await userUtil.updateUser(user);
   if (updatedUser)
       res.status(201).send(updatedUser);
   else
       res.status(500).end();
});

app.delete('/users/:email', async (req, res) => {
   const email = req.params['email'];
   const status = await userUtil.deleteUser(email)
   if (status){
      res.status(204).end();
   }
   else{
      res.status(404).send('User not found');
   }
});


app.put('/playlist/', async (req, res) => {
   const sid = req.body[0];
   const albumCover = req.body[1];
   const status = playlistUtil.updatePlaylistArt(sid, albumCover);
   if (status){
      res.status(201);
   }
   else{
      res.status(500).end();
   }

});

app.delete('/generated/:id', async (req, res) => {
   const sid = req.params['id'];
   const status = await playlistUtil.deleteBySid(sid)
   if (status){
      res.status(204).end();
   }
   else{
      res.status(404).send('Playlist not found');
   }
});

app.get('/generated/:id', async (req, res) => {
   const sid = req.params['id'];
   const result = await playlistUtil.getBySid(sid)
   if (result){
      res.send({playlist_list: result});
   }
   else{
      res.status(404).send('Playlist not found');
   }
});

app.post('/home', async (req, res) => {
   const playlist = req.body;
   const savedPlaylist = await playlistUtil.postPlaylist(playlist);
   if (savedPlaylist)
       res.status(201).send(savedPlaylist);
   else
       res.status(500).end();
});

app.listen(process.env.PORT || port, () => {
   console.log("REST API is listening.");
 });


 // 1loeFoPLCZTY6oWSBoXCyL