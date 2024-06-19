const mongoose = require('mongoose');

const Messages = new mongoose.Schema({
    username: String,
    room: String,
    message: String,
    time: String
}, {timestamps: true});

const MsgDB = mongoose.model('Messages', Messages);
module.exports = MsgDB;