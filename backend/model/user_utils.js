const mongoose = require('mongoose');
const UserSchema = require("./user.js");

let dbConnection;

function setConnection(newConn) {
    dbConnection = newConn;
    return dbConnection;
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

async function getUsers(email) {
    const userModel = getDbConnection().model("User", UserSchema);
    let result;
    if (email === undefined) {
        result = await userModel.find();
    }
    else
        result = await findUserByEmail(email);
    return result;
}

async function postUser(user) {
    const userModel = getDbConnection().model("User", UserSchema);
    try {
        const userToAdd = new userModel(user);
        const savedUser = await userToAdd.save()
        return savedUser;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function findUserByEmail(email) {
    const userModel = getDbConnection().model("User", UserSchema);
    return await userModel.find({ 'email': email });
}

async function updateUser(user) {
    const userModel = getDbConnection();
    try {
        var myquery = { email: user.email };
        var newvalues = { $set: { liked_songs: user.liked_songs, generated_songs: user.generated_songs } };
        const updatedUser = await userModel.collection("users_list").updateOne(myquery, newvalues, function (err, res) {
            if (err) return false;
            console.log("1 document updated");
        });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function deleteByEmail(email) {
    const userModel = getDbConnection().model("User", UserSchema);
    try {
        return await userModel.deleteOne({ 'email': email });
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

exports.setConnection = setConnection;
exports.getUsers = getUsers;
exports.postUser = postUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteByEmail;



