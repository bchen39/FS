const mongoose = require('mongoose')
const User = require('./Database/Users');

/* Handles login and register routine */
const logRegHandler = (req, res) => {
    const {username, password, isLogin} = req.body;
    console.log(req.body);
    
    // Login: If user exists and password is correct, success. Else fail.
    // Register: If username hasn't been taken, succeed. Else fail.
    User.findOne({username: username})
    .then(u => {
        if (u) {
            if (isLogin) {
                if (u.password == password) {
                    res.json({id: u._id, success: true});
                } else {
                    res.json({success:false});
                }
            } else {
                res.json({success:false});
            }
        } else {
            if (isLogin) {
                res.json({success: false});
            } else {
                User.create({username, password})
                    .then(u => res.json({success:true}))
                    .catch(err => console.log(err));
            }
        }
    })
    .catch(err => console.log(err));
}


const getFinalList = (userList, room) => {
    var curRoomUser = userList.filter((user) => user.room == room);
        
    // Remove duplicates and send.
    var userListFinal = {}
    for (let i = 0; i < curRoomUser.length; i++)  {
        userListFinal[curRoomUser[i].username] = curRoomUser[i].id
    }
    
    return Object.keys(userListFinal);
}

module.exports = {logRegHandler, getFinalList};