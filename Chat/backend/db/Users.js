const mongoose = require('mongoose');

const User = new mongoose.Schema({
    username: {type:String, unique:true},
    password: String
}, {timestamps: true});

const UserDB = mongoose.model('Users', User);
module.exports = UserDB;
