import { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"  

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isDup, setIsDup] = useState(true);
    const navigate = useNavigate();

    function postData(ev) {
        ev.preventDefault();
        var url = "http://localhost:4000/register";
        var data = {username, password};
        axios.post(url, data)
        .then(res => {console.log(res.data);
            console.log(res.data.dupUN);
            if (res.data.success) {
                navigate("/login");
            } else {
                setIsDup(res.data.dupUN);
                navigate("/register");
            }
        })
        .catch(err => console.log(err));
    }

    function Instruction() {
        if (isDup) {
            setIsDup(false);
            return (<div>
                Username already exists. Please re-enter.
                </div>);
        } else {
            return (<div>
                Please register by entering username and password.
                </div>);
        }
    }
    return (
    <div className="bg-blue-100 h-screen w-screen flex items-center">
        <form className="w-80 mx-auto mb-20" onSubmit={postData}>
        <h1 className="block rounded-sm mb-2 font-serif self-center">
            Welcome!
        </h1>
        <Instruction />
            <input value={username}
                onChange={ev => setUsername(ev.target.value)}
                type="text" placeholder="username" className="block w-full rounded-sm p-2 mb-2 "/>
            <input value={password}
                onChange={ev => setPassword(ev.target.value)}
                type="text" placeholder="password" className="block w-full rounded-sm p-2 mb-2 "/>
            <button className="bg-blue-400 text-white block w-full p-2" >Register</button>
            <Link to="/login" className="hover:text-blue-500">
        Already have an account?
        </Link>
        </form>
    </div>
    )
}