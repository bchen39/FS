import Messages from './Messages';
import Send from './Send'
import RoomInfo from './RoomInfo';

const Room = ({ socket }) => {
  
  /* Room page with 3 components: RoomInfo, Message and Send. */
  return (
    <div className="flex h-screen w-screen">
      <div className="bg-gray-400 w-1/5">
        <RoomInfo socket={socket} username={localStorage.getItem("username")} room={localStorage.getItem("room")}/>
      </div>
      <div className="bg-gray-200 flex flex-col w-4/5">
        <Messages socket={socket} />
        <Send socket={socket} username={localStorage.getItem("username")} room={localStorage.getItem("room")} />
      </div>
    </div>
  );
};

export default Room;