import { useState, useContext, useEffect } from "react"
import { UserContext, UserContextProvider } from "../context/userContext"
import socketClient  from "socket.io-client";
import "../App.css"

export default function Room( {socket} ) {

    const {username, setUsername, id, setId, room, setRoom} = useContext(UserContext);
    const [messagesRecieved, setMessagesReceived] = useState([]);

  // Runs whenever a socket event is recieved from the server
    useEffect(() => {
    socket.on('receive_message', (data) => {
      console.log(data);
      setMessagesReceived((state) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          timestamp: data.timestamp,
        },
      ]);
    });

	// Remove event listener on component unmount
    return () => socket.off('receive_message');
  }, [socket]);

    const handleLogout = () => {
        setUsername("");
        setId("");
        localStorage.clear();
    };
    function formatDateFromTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }
    return (
        <div className="">
          {messagesRecieved.map((msg, i) => (
            <div className="" key={i}>
              <div>
                <span className="">{msg.username}</span>
                <span className="">
                  {formatDateFromTimestamp(msg.timestamp)}
                </span>
              </div>
              <p className="">{msg.message}</p>
              <br />
            </div>
          ))}
          <button className="bg-blue-400 text-white block w-full p-2" onClick={handleLogout}>Logout</button>
        </div>
      );
    /*
    return (<UserContextProvider>
        <div className="flex h-screen w-screen">
            <div className="bg-gray-400 w-1/5">
                Users
            </div>
            <div className="bg-gray-200 flex flex-col w-4/5">
                <div className="flex-grow p-2">Current room: 
                    <select className="flex-grow p-2 me-auto"
                    onChange={(e) => setRoom(e.target.value)}>
                        <option value="travel">travel</option>
                        <option value="music">music</option>
                        <option value="coding">coding</option>    
                    </select>
                    <button className='bg-blue-600 p-2 text-white' onClick={joinRoom}>
                        Join Room
                    </button>
                    <button className="bg-blue-600 mx-2 p-2 text-white" onClick={handleLogout}>
                        logout
                    </button>
                </div>
                <div className="flex gap-2">
                    <input type="text" 
                    placeholder="Type message" 
                    className="bg-white p-2 border flex-grow"/>
                    <button className="bg-blue-600 p-2 text-white">send</button>
                </div>
            </div>
        </div>
    </UserContextProvider>
    )*/
};