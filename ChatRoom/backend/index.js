const express = require('express');
const mongoose = require('mongoose');
const Messages = require('./Database/Messages')
const Votes = require('./Database/Votes')
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { loginHandler, regHandler } = require('./handleRoutes')
const { getFinalList } = require('./utils')

//const mongo_url = "mongodb+srv://yubangchen:ReaeRD0NmdtS1YsX@cluster0.uujg6cv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const mongo_url = process.env.MONGO_URL
//const mongo_url = "mongodb://root:password@0.0.0.0:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false"

mongoose.connect(mongo_url)

app.use(cors(
    {
        credentials: true,
        origin:"http://localhost:5173",
    }
));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

app.post('/register', regHandler);

app.post('/login', loginHandler);

const DEBUG = false;
var userList = [];
var curRoom = '';
io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);
  
    // Receives join request, add user to room.
    socket.on('join_request', async (data) => {
        const { un:username, room } = data; // Data sent from client when join_room event emitted

        console.log("joining new room");
        //Find all messages belonging to this room
        const messages = await Messages.find({
            room: room,
        }).sort({timestamp: 1});
        if (DEBUG) {
            console.log(username);
            console.log(messages);
        }

        console.log("finished finding");

        curRoom = room;

        // Finds all messages that the current user has a vote record with.
        var voted = await Votes.find({username: username, room: room});
        var lookup = {}
        for (let i = 0; i < voted.length; i++) {
            lookup[String(voted[i].msg_timestamp)] = voted[i].vote
        }
        if (DEBUG) {
            console.log(lookup);
        }

        // Check if current joining user has voted on each message. If so record the vote
        // to prevent duplicate up or downvote.
        let history = messages.map((m, i) => {
            if (String(m.timestamp) in lookup) {
                return {
                    message: m.message, 
                    username: m.username,
                    timestamp: m.timestamp,
                    votes: m.votes,
                    userVote: lookup[m.timestamp]
                }
            } else {
                return {
                    message: m.message, 
                    username: m.username,
                    timestamp: m.timestamp,
                    votes: m.votes,
                    userVote: null
                }
            }
        });
        if (DEBUG) {
            console.log(history);
        }

        socket.emit('message_history', history);

        socket.join(room); // Join the user to a socket room

        // Add user to overall userlist and filter out the ones who are not in the current room.
        userList.push({ id: socket.id, username, room });

        var userListFinal = getFinalList(userList, room);
        socket.to(room).emit('update_user_list', userListFinal);
        socket.emit('update_user_list', userListFinal);
    });

    socket.on('send_message', (data) => {
        const { message, username, room, timestamp } = data;
        io.in(room).emit('receive_message', data); // Send to all users in room, including sender
        
        
        var votes = 0;
        Messages.create({username, room, message, timestamp, votes})
            .then((response) => console.log(response))
            .catch((err) => console.log(err));
        
    });

    {/* Asynchronously update vote numbers in the background. */}
    socket.on('vote', async (data) => {

        // Receive updated vote for message, store in Votes database.
        const { index, timestamp: msg_timestamp, username, room, newVote, vote } = data;
        if (DEBUG) {
            console.log(data);
        }
        socket.to(room).emit('cast_vote', { index, username, newVote });
        const doc = await Votes.findOneAndUpdate({msg_timestamp: msg_timestamp, room: room, username: username}, 
            { msg_timestamp, room, username, vote }, {new: true, upsert: true});
        if (DEBUG) {
            console.log(doc.username);
            console.log(doc.vote);
        }

        // Update vote number for the message above.
        var new_votes = 0;
        var count = await Votes.where( {msg_timestamp: msg_timestamp, room: room, vote: true}).countDocuments();
        new_votes += count;
        count = await Votes.where( {msg_timestamp: msg_timestamp, room: room, vote: false}).countDocuments();
        new_votes -= count;
        const msg_new = await Messages.findOneAndUpdate({room: room, timestamp: msg_timestamp},
            {votes: new_votes});
        if (DEBUG) {
            console.log(msg_new.username);
            console.log(msg_new.votes);
        }
    });

    socket.on('leave_room', (data) => {
        const { username, room } = data;
        socket.leave(room);
        
        // Remove user from userList
        userList = userList.filter((user) => user.username != username);
        console.log("current user list: ", userList);

        // Remove duplicates and send.
        var userListFinal = getFinalList(userList, room);
        socket.to(room).emit('update_user_list', userListFinal);

    });

    socket.on('disconnect', () => {
        console.log('User disconnected from the chat');
        const user = userList.find((user) => user.id == socket.id);
        userList.filter((user) => user.id != socket.id)

        var curRoomUser = userList.filter((user) => user.room == curRoom);
    
        // Remove duplicates and send.
        var userListFinal = {}
        for (let i = 0; i < curRoomUser.length; i++)  {
            userListFinal[curRoomUser[i].username] = curRoomUser[i].id
        }
        userListFinal = Object.keys(userListFinal)
        socket.to(curRoom).emit('update_user_list', userListFinal);
    });

});

server.listen(4000, () => 'Server is running on port 4000');