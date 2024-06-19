import { useState, useEffect, useRef, createRef } from 'react';

const Messages = ({ socket }) => {
    const [messageQueue, setMessageQueue] = useState([]);
    const messageEnd = createRef();
    const DEBUG = false;

    // Joins the room.
    useEffect(() => {
        let un = localStorage.getItem("username");
        let room = localStorage.getItem("room");
        if (room !== '') {
            socket.emit('join_request', { un, room });
        }
    }, []);

    // Receives a new message, add to current received message.
    useEffect(() => {
        socket.on('receive_message', (data) => {
        console.log(data);
        setMessageQueue((state) => {
        return [
            ...state,
            {
                message: data.message,
                username: data.username,
                timestamp: data.timestamp,
                votes: 0,
                userVote: null,
            },
        ]});
        });
        return () => socket.off('receive_message');
    }, [socket]);

    // Receives new vote cast, handle upvote downvote process.
    useEffect(() => {
        socket.on('cast_vote', (v) => {
            const { index, username, newVote } = v;
            if (DEBUG) {
                console.log("cast_vote: ", v);
            }
            if (username != localStorage.getItem("username"))
                recvUpvote(index, newVote);
        })
    })
  

    useEffect(() => {
    // Fetches message history from backend using socket.
        socket.on('message_history', (msgHistory) => {
            if (DEBUG) {
                console.log('Message history:', msgHistory);
                console.log(Date(msgHistory[0].timestamp).toLocaleString())
            }
            setMessageQueue(msgHistory);
        });

        return () => socket.off('message_history');
    }, [socket]);

    function recvUpvote(index, newVote) {
        const newMsg = messageQueue.map((m, i) => {
            if (i === index) {
              // Only update the corresponding index
                return {message: m.message, 
                    username: m.username,
                    timestamp: m.timestamp,
                    votes: newVote,
                    userVote: m.userVote}; 
            } else {
                // The rest haven't changed
                return m;
            }
        });
        if (DEBUG) {
            console.log("done with handling votes");
        }
        setMessageQueue(newMsg);
    }

  function handleUpvote(index, vote) {
    const newMsg = messageQueue.map((m, i) => {
      if (i === index) {
        // Only update the corresponding index
        var newVote = m.votes 
        var curVote = m.userVote
        if (curVote == null) {
            // User has not voted yet. Record vote and update totoal votes;
            newVote += (vote ? 1 : -1);
        } else if (curVote) {
            // User previously upvoted. If user clicks upvote again retrieve upvote, else downvote instead.
            newVote += (vote ? -1 : -2);
            vote = vote ? null : vote;
        } else {
            // User previously downvoted. If user clicks downvote again retrieve downvote, else upvote instead.
            newVote += (vote ? 2 : 1);
            vote = vote ? vote : null;
        }
        let timestamp = m.timestamp;
        let username = localStorage.getItem("username");
        let room = localStorage.getItem("room");
        socket.emit('vote', { index, timestamp, username, room, newVote, vote });  
        return {message: m.message, 
            username: m.username,
            timestamp: m.timestamp,
            votes: newVote,
            userVote: vote}; 
      } else {
        // The rest haven't changed
        return m;
      }
    });
    if (DEBUG) {
        console.log("done with handling votes");
    }
    setMessageQueue(newMsg);
  }

  return (
    <div className="p-8 overflow-auto">
        {/* Renders each message and the corresponding upvote/downvote buttons. */}
      {messageQueue.map((msg, i) => (
        <div className="bg-blue-500 rounded-md mb-4 p-2" key={i}>
          <div className='flex justify-between'>
            <span className='text-blue-300 font-semibold text-sm'>{msg.username}</span>
            <span className='text-blue-200 font-semibold text-sm'>
              {new Date(msg.timestamp).toLocaleString()}
            </span>
          </div>
          <div className='flex justify-between my-2'>
            <p className="">{msg.message}</p>
            <div>
                <p className={messageQueue[i].userVote != null && messageQueue[i].userVote ? "bg-green-600 cursor-pointer" :"cursor-pointer"} 
                onClick={() => handleUpvote(i, true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.53 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v5.69a.75.75 0 0 0 1.5 0v-5.69l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z" clipRule="evenodd" />
                    </svg>
                </p>
                <p>{msg.votes}</p>
                <p className={messageQueue[i].userVote != null && !messageQueue[i].userVote ? "bg-red-600 cursor-pointer" :"cursor-pointer"}  
                    onClick={() => handleUpvote(i, false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-.53 14.03a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V8.25a.75.75 0 0 0-1.5 0v5.69l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3Z" clipRule="evenodd" />
                    </svg>

                </p>
                </div>
          </div>
          <br />
        </div>
      ))}
      <div ref={messageEnd}></div>
    </div>
  );
};

export default Messages;