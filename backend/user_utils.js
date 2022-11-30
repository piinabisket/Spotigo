const mongoose = require('mongoose');
const UserSchema = require("./user.js");

let dbConnection;

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
    console.log(result);
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

exports.getUsers = getUsers;
exports.postUser = postUser;

