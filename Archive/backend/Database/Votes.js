const mongoose = require('mongoose');

const Votes = new mongoose.Schema({
    msg_timestamp: Number,
    room: String,
    username: String,
    vote: Boolean
}, {timestamps: true});

const VoteDB = mongoose.model('Votes', Votes);
module.exports = VoteDB;