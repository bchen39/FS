const mongoose = require('mongoose');

const Messages = new mongoose.Schema({
    username: String,
    room: String,
    message: String,
    timestamp: Number, 
    votes: Number
});

const MsgDB = mongoose.model('Messages', Messages);
module.exports = MsgDB;