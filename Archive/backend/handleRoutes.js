const mongoose = require('mongoose')
const User = require('./Database/Users');

/* Handles login routine */
const loginHandler = (req, res) => {
    const {username, password} = req.body;
    console.log(req.body);
    
    // If user exists and password is correct, success. Else fail.
    User.findOne({username: username})
    .then(u => {
        if (u && u.password == password) {
            res.json({id: u._id, success: true});
        } else {
            res.json({success: false});
        }
    })
    .catch(err => console.log(err));
}

/* Handles registration routine */
const regHandler = (req, res) => {
    console.log(req.body)
    const {username, password} = req.body;

    // If username hasn't been taken, succeed. Else fail.
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
}

module.exports = { loginHandler, regHandler };