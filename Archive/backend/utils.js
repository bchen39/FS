const getFinalList = (userList, room) => {
    var curRoomUser = userList.filter((user) => user.room == room);
        
    // Remove duplicates and send.
    var userListFinal = {}
    for (let i = 0; i < curRoomUser.length; i++)  {
        userListFinal[curRoomUser[i].username] = curRoomUser[i].id
    }
    
    return Object.keys(userListFinal);
}

module.exports = {getFinalList};