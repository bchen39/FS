import { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"  

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isDup, setIsDup] = useState(false);
    const navigate = useNavigate();

    function postData(ev) {
        ev.preventDefault();
        setIsDup(false);
        var url = "http://localhost:4000/register";
        var data = {username, password};
        console.log(data)
        axios.post(url, data)
        .then(res => {console.log(res.data);
            console.log(res.data.dupUN);
            if (res.data.success) {
                navigate("/");
            } else {
                setIsDup(res.data.dupUN);
                navigate("/register");
            }
        })
        .catch(err => console.log(err));
    }

    return (
    <div className="bg-blue-200 h-screen w-screen flex items-center font-sans">
        <form className="w-80 mx-auto mb-20 items-center bg-blue-300 p-5 rounded-md" onSubmit={postData}>
        <h1 className="block rounded-sm mb-2 self-center text-black">
            Welcome!
        </h1>
        {isDup ? <div className="block rounded-sm mb-2 self-center text-red-600">
                Username already exists. Please re-enter
                </div> 
                : <div className="block rounded-sm mb-2 self-center text-black">
                Please register by entering username and password.
                </div>}
            <input value={username}
                onChange={ev => setUsername(ev.target.value)}
                type="text" placeholder="username" className="block w-full rounded-sm p-2 mb-2 "/>
            <input value={password}
                onChange={ev => setPassword(ev.target.value)}
                type="text" placeholder="password" className="block w-full rounded-sm p-2 mb-2 "/>
            <button className="bg-blue-400 text-white block w-full p-2" >Register</button>
            <Link to="/" className="hover:text-blue-500">
        Already have an account?
        </Link>
        </form>
    </div>
    )
}