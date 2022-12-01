const express = require('express');
const cors = require('cors');

const playlistUtil = require('./playlist_utils');
const userUtil = require('./user_utils');

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
   const genre = req.query['genre'];
   const bpm = req.query['bpm'];
   try {
      const result = await playlistUtil.getPlaylists(genre, bpm);
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
   console.log(updatedUser);
   if (updatedUser)
       res.status(201).send(updatedUser);
   else
       res.status(500).end();
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