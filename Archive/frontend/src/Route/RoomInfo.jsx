import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RoomInfo = ({ socket, username, room }) => {
  const [curUsers, setCurUsers] = useState([]);

  const navigate = useNavigate();

    useEffect(() => {
        socket.on('update_user_list', (data) => {
            setCurUsers(data);
        });

        return () => socket.off('update_user_list');
    }, [socket]);

    const leaveRoom = () => {
        const timestamp = Date.now();
        localStorage.removeItem("room");
        socket.emit('leave_room', { username, room, timestamp });
        // Redirect to home page
        navigate('/', { replace: true });
    };

  return (
    <div className="border-gray-400 border-x-8 text-purple-950 mt-32">
      <h2 className="mb-16 mt-1 text-center text-3xl">{room} room</h2>

      <div className="mb-16">
        {curUsers.length > 0 && <h5 className="styles.usersTitle text-center text-2xl mb-8">Users</h5>}
        <ul className="text-center mb-2">
          {curUsers.map((username) => (
            <li
              key={username}
            >
              {username}
            </li>
          ))}
        </ul>
      </div>
      <div className='justify-center flex'>
      <button className="bg-blue-500 text-white block w-32 p-2 text-center" onClick={leaveRoom}>
        Leave
      </button>
      </div>
    </div>
  );
};

export default RoomInfo;