const mongoose = require("mongoose");
const UserSchema = require("./user");
const userUtil = require("./user_utils");
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

  userModel = conn.model("User", UserSchema);

  userUtil.setConnection(conn);
});

beforeEach(async () => {
   let dummyUser = {
     email: "Bender@benderisgreat.com",
     liked_songs: [],
     generated_songs: []
   };
   let result = new userModel(dummyUser);
   await result.save();

   dummyUser = {
      email: "Fry@spotigo.com"
   };
   result = new userModel(dummyUser);
   await result.save();
 });

afterAll(async () => {
  await conn.dropDatabase();
  await conn.close();
  await mongoServer.stop();
});

afterEach(async () => {
   await userModel.deleteMany();
 });

 test("Fetching all users", async () => {
   const users = await userUtil.getUsers();
   expect(users).toBeDefined();
   expect(users.length).toBeGreaterThan(0);
 });

 test("Fetching 1 user", async () => {
   const users = await userUtil.getUsers("Bender@benderisgreat.com");
   expect(users).toBeDefined();
   expect(users.length).toBeGreaterThan(0);
   users.forEach((user) => expect(user.email).toBe("Bender@benderisgreat.com"))
 });

 test("Post user", async () => {
   const users = await userUtil.postUser("Leela@1bdI.com");
   expect(users).toBeDefined();
 });

 test("Update user", async () => {
  const updatedUser = await userUtil.updateUser({email: "bender@benderisgreat.com", liked_songs: ["test"]});
  expect(updatedUser).toBeTruthy();
});
