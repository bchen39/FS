import React, { useState } from 'react';

const Send = ({ socket, username, room }) => {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (message !== '') {
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
      <button className="bg-blue-600 ml-2 p-2 text-white" onClick={sendMessage}>
        Send Message
      </button>
    </div>
  );
};

export default Send;