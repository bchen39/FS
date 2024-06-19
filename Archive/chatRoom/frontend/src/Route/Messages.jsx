import { useState, useEffect, useRef, createRef } from 'react';

/* Message component of the Room page. The structure of the message includes message, username of the 
poster, timestamp of the mssage, number of net votes (upvote - downvote) the message has, and lastly 
the vote of the current user. 

The last 2 items (votes, userVote) are used to ensure that number of votes can be updated locally instead. 
Knowing what the user voted on each message, we can correctly add or subtract votes, and correspondingly 
retract upvotes/downvotes locally instead of having go back to the database to retrieve them. This ensures 
that the user can get the updated value significantly faster, as the process of storing the votes into the 
database can happen asynchronously. 

The same logic applies to sending and receiving message: we add the message to the message queue, while it 
is being added to the database asynchronously in the backend.*/
const Messages = ({ socket }) => {
    const [messageQueue, setMessageQueue] = useState([]);
    const messageEnd = createRef(null);
    const DEBUG = false;

    /* Automatically scroll to bottom every time a new message comes in. 
    NOTE: could also be triggered by votes, so not completely optimized. */
    useEffect(() => {
        messageEnd.current?.scrollIntoView({behavior: 'smooth'});
    }, [messageQueue])

    // Joins the room. Retrieves message history.
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

    /* Update local message vote numbers after receiving signal */
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

    /* Updates local database and emits signal to ensure that other members of the room do the same. */
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
            // User previously upvoted. If user clicks upvote again retrieve upvote, else downvote instead (subtracts 2 from net vote).
            newVote += (vote ? -1 : -2);
            vote = vote ? null : vote;
        } else {
            // User previously downvoted. If user clicks downvote again retrieve downvote, else upvote instead (adds 2 to net vote).
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
            <p className="text-white">{msg.message}</p>
            <div>
                <p className={messageQueue[i].userVote != null && messageQueue[i].userVote ? "bg-green-600 cursor-pointer" :"cursor-pointer"} 
                onClick={() => handleUpvote(i, true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.53 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v5.69a.75.75 0 0 0 1.5 0v-5.69l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z" clipRule="evenodd" />
                    </svg>
                </p>
                <p className={msg.votes >= 0 ? "text-green-300 ml-2" : "text-red-300"}>{msg.votes}</p>
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
      ))} {/* Displays messages one by one, sorted by timestamp. */}
      <div ref={messageEnd}></div>
    </div>
  );
};

export default Messages;