const registerHandler = (req, res) => {
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
}

const loginHandler = (req, res) => {
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
}

module.exports({ registerHandler, loginHandler });