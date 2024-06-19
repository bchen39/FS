import { useState, useContext, useEffect } from "react"
import { UserContext, UserContextProvider } from "../context/userContext"
import { useNavigate } from "react-router-dom"  
import socketClient  from "socket.io-client";
import Room from "./Room"
import "../App.css"

export default function Home() {

    const SERVER = "http://localhost:4000"
    const {username, setUsername, id, setId, room, setRoom} = useContext(UserContext);
    const [messagesRecieved, setMessagesReceived] = useState([]);

    const navigate = useNavigate();
    var socket = socketClient (SERVER);

    const joinRoom = () => {
        console.log(username);
        console.log(room);
        if (room !== '' && username !== '') {
            console.log(username);
            console.log(room);
            socket.emit('join_room', { username, room });
        }
        localStorage.setItem('room', room);

        navigate('/home');
    };
    const handleLogout = () => {
        setUsername("");
        setId("");
        localStorage.clear();
    };
    if (localStorage.getItem('room') != null) {
        return(<Room socket={socket}/>);
    }
    return (<UserContextProvider>
         <div className="bg-blue-100 h-screen w-screen flex items-center">
        <div className="w-80 mx-auto mb-20">
        <h1 className="block rounded-sm mb-2 font-serif self-center">
            Welcome, {username}! Please select a chat room to join
        </h1>
            <select className="block w-full rounded-sm p-2 mb-2 "
                    onChange={(e) => setRoom(e.target.value)}>
                        <option value="travel">travel</option>
                        <option value="music">music</option>
                        <option value="coding">coding</option>    
                    </select>
            <button className="bg-blue-400 text-white block w-full p-2 mb-2" onClick={joinRoom}>Join room</button>
            <button className="bg-blue-400 text-white block w-full p-2" onClick={handleLogout}>Logout</button>
        </div>
    </div>
        
    </UserContextProvider>
    )
}