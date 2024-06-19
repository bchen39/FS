import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import io from 'socket.io-client';
import Home from './Route/Home';
import Room from './Route/Room';
import Login from './Route/Login';
import Register from './Route/Register';

const socket = io.connect('http://localhost:4000');

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');

  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route
            path='/'
            element={
              <Home
                username={username}
                setUsername={setUsername}
                room={room} 
                setRoom={setRoom} 
                socket={socket}
              />
            }
          />
          <Route
            path='/register'
            element={<Register socket={socket} />}
          />
          <Route
            path='/login'
            element={<Login socket={socket} />}
          />
          <Route
            path='/room'
            element={<Room 
              username={username}
              setUsername={setUsername}
              room={room} 
              setRoom={setRoom}  
              socket={socket} 
            />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;