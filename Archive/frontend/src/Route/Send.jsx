import React, { useState, useEffect } from 'react';

const Send = ({ socket, username, room }) => {
  const [message, setMessage] = useState('');
  const [curUsers, setCurUsers] = useState([]);
  const [PMUser, setPMUser] = useState([]);

  useEffect(() => {
    socket.on('update_pm_list', (data) => {
        setCurUsers(data);
        console.log(curUsers);
    });

    return () => socket.off('update_pm_list');
  }, [socket]);
  const sendMessage = () => {
    if (message !== '') {
      if (PMUser != '' && curUsers.includes(PMUser))
        console.log("Found PM target");
      const timestamp = Date.now();
      // Send message to server. We can't specify who we send the message to from the frontend. We can only send to server. Server can then send message to rest of users in room
      socket.emit('send_message', { username, room, message, timestamp });
      setMessage('');
    }
  };

  return (
    <div className="absolute bottom-0 pl-8 py-2 ">
      <input
        className="bg-white p-2 flex-grow text-black rounded-md border"
        placeholder='Message...'
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
      {/*<select className="rounded-sm p-2 mb-2 "
            onChange={(e) => setRoom(e.target.value)}>
          <option>-- Private Message --</option>
          {curUsers.map((u, i) => {
            <option value={u}>{u}</option>
          })}
          <option value='music'>Music</option>
          <option value='coding'>Coding</option>
        </select>*/}
      <input
        className="bg-white p-2 flex-grow text-black rounded-md border"
        placeholder='PM to user...'
        onChange={(e) => setPMUser(e.target.value)}
        value={PMUser}
      />
      <button className="bg-blue-600 ml-2 p-2 text-white" onClick={sendMessage}>
        Send Message
      </button>
    </div>
  );
};

export default Send;