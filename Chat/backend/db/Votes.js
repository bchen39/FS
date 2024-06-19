const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Votes = new mongoose.Schema({
    msg_id: ObjectId,
    username: String,
    upvote: boolean
}, {timestamps: true});

const VoteDB = mongoose.model('Votes', Votes);
module.exports = VoteDB;