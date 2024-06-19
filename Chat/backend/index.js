const express = require('express');
const mongoose = require('mongoose');
const User = require('./db/Users');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { loginHandler, registerHandler } = require('./routeHandler')

const mongo_url = "mongodb+srv://yubangchen:ReaeRD0NmdtS1YsX@cluster0.uujg6cv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(mongo_url)

const app = express();

//uname: yubangchen, pw: ReaeRD0NmdtS1YsX
//IP: 72.66.3.232

app.use(express.json());
app.use(cors({
    credentials: true,
    origin:"http://localhost:5173",
}));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

app.post('/register', (req, res) => {
    const {username, password} = req.body;
    User.findOne({username: username})
    .then(u => {
        if (u) {
            res.json({success:false, dupUN: true});
        } else {
            User.create({username, password})
            .then(u => res.json({success:true, dupUN: false}))
            .catch(err => console.log(err));
        }
    })
    .catch(err => console.log(err));
});

app.post('/login', loginHandler/*(req, res) => {
    const {username, password} = req.body;
    console.log(req.body);
    User.findOne({username: username})
    .then(u => {
        if (u && u.password == password) {
            res.json({id: u._id, success: true});
        } else {
            res.json({success: false});
        }
    })
    .catch(err => console.log(err));
}*/);

const CHAT_BOT = 'Ben10';
let chatRoom = ''; // E.g. javascript, node,...
let allUsers = []; // All users in current chat room

io.on('connection', (socket) => { /* socket object may be used to send specific messages to the new connected client */

    console.log('new client connected');

    socket.on('join_room', (data) => {
        const { username, room } = data; // Data sent from client when join_room event emitted
        console.log(data);
        socket.join(room); // Join the user to a socket room

        let timestamp = Date.now(); // Current timestamp
        // Send message to all users currently in the room, apart from the user that just joined
        socket.to(room).emit('receive_message', {
            message: `${username} has joined the chat room`,
            username: CHAT_BOT,
            timestamp,
        });

        chatRoom = room;
        allUsers.push({ id: socket.id, username, room });
        chatRoomUsers = allUsers.filter((user) => user.room === room);
        socket.to(room).emit('chatroom_users', chatRoomUsers);
        socket.emit('chatroom_users', chatRoomUsers);
    });

});


server.listen(4000, () => 'Server is running on port 4000');