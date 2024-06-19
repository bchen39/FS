import { useNavigate, Link } from 'react-router-dom';
import Login from './Login';

const Home = ( { username, setUsername, room, setRoom, socket } ) => {
    const DEBUG = true;
    const navigate = useNavigate();

    const handleLogout = () => {
        setUsername("");
        localStorage.clear();
        navigate("/");
    };

    /* Stores room info in local storage and go to room. */
    const joinRoom = () => {
        localStorage.setItem("room", room);
        navigate('/room', { replace: true });
    };

    /* Changes layout depending on whether username is in local storage (which essentially means 
     * the user is logged in). */
    if (localStorage.getItem("username") == null) {
        return (
            <Login />
        )
    }

    return (
    <div className="bg-blue-200 h-screen w-screen flex items-center font-sans">
      <div className="w-80 mx-auto mb-20 items-center bg-blue-300 p-5 rounded-md">
        <h1 className="block rounded-sm mb-2 self-center text-black">Chatroom</h1>
        <h2 className="block rounded-sm mb-2 self-center text-black">
            Welcome, {localStorage.getItem("username")}! Please select a room.
        </h2>
        <select className="block w-full rounded-sm p-2 mb-2 "
            onChange={(e) => setRoom(e.target.value)}>
          <option>-- Select a Room --</option>
          <option value='travel'>Travel</option>
          <option value='music'>Music</option>
          <option value='coding'>Coding</option>
        </select>

        <button className="bg-blue-500 text-white block w-full p-2 mb-2"
            onClick={joinRoom} >
            Join Room
        </button>
        <button className="bg-blue-500 text-white block w-full p-2" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Home;