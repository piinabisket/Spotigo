const mongoose = require("mongoose");
const PlaylistSchema = require("./playlist");
const playlistUtil = require("./playlist_utils");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;
let conn;
let userModel;

beforeAll(async () => {
  jest.setTimeout(10000);
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  conn = await mongoose.createConnection(uri, mongooseOpts);

  playlistModel = conn.model("Playlist", PlaylistSchema);

  playlistUtil.setConnection(conn);
});

beforeEach(async () => {
   let dummyPlaylist = {
     name: "test1",
     sid: "123456789",
     bpm: 100,
     description: "test 1",
   };
   let result = new playlistModel(dummyPlaylist);
   await result.save();

   dummyPlaylist = {
      name: "test2",
      sid: "987654321",
      bpm: 120,
      description: "test 2",
    };
    result = new playlistModel(dummyPlaylist);
    await result.save();

    dummyPlaylist = {
      name: "test3",
      sid: "abcdefg",
      bpm: 200,
      album_cover: "null",
      description: "null",
    };
    result = new playlistModel(dummyPlaylist);
    await result.save();
 });

afterAll(async () => {
  await conn.dropDatabase();
  await conn.close();
  await mongoServer.stop();
});

afterEach(async () => {
   await playlistModel.deleteMany();
 });

test("Fetching all playlists", async () => {
   const playlists = await playlistUtil.getPlaylists();
   expect(playlists).toBeDefined();
   expect(playlists.length).toBeGreaterThan(0);
 });

 test("Fetching 1 playlist - success", async () => {
   const playlists = await playlistUtil.getBySid("123456789");
   expect(playlists).toBeDefined();
   playlists.forEach((playlist) => expect(playlist.name).toBe("test1"));
 });

 test("Change album art - success", async () => {
   const playlists = await playlistUtil.updatePlaylistArt("abcdefg", "drip");
   expect(playlists).toBeDefined();
   expect(playlists).toBeTruthy();
 });

 test("Change album art - failure", async () => {
   const playlists = await playlistUtil.updatePlaylistArt("abcdefgh", "drip");
   expect(playlists).toBeDefined();
   expect(playlists.album_cover).toBeFalsy;
 });

 test("Delete - success", async () => {
   const playlists = await playlistUtil.deleteBySid("123456789");
   expect(playlists).toBeTruthy();
 });

 test("Post - success", async () => {
   const playlists = await playlistUtil.postPlaylist({name: "new playlist", sid: "00000", bpm: 10, description: "its new"});
   expect(playlists).toBeDefined();
 });