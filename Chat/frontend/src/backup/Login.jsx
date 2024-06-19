import React, { useState, useContext } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"  
import { UserContext } from "./userContext.jsx"

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [pwIncorrect, setPwIncorrect] = useState(false);
    const {setUsername:setLoggedInUsername, setId} = useContext(UserContext)
    const navigate = useNavigate();

    function postData(ev) {
        ev.preventDefault();
        var url = "http://localhost:4000/login";
        var data = {username, password};
        setPwIncorrect(false);
        axios.post(url, data)
        .then(res => {console.log(res);
            console.log(res.data);
            if (res.data.msg == "Login successful!") {
                setLoggedInUsername(username);
                setId(res.data.id);
                localStorage.setItem("username", username);
                localStorage.setItem("id", res.data.id);
                console.log(localStorage.getItem("username"));
                console.log(localStorage.getItem("id"));
                navigate("/home");
            } else {
                setPwIncorrect(true);
                navigate("/login");
            }
        })
        .catch(err => console.log(err));
    }
    return (
    <div className="bg-blue-100 h-screen w-screen flex items-center">
        <form className="w-80 mx-auto mb-20" onSubmit={postData}>
        <h1 className="block rounded-sm mb-2 font-serif self-center">
            Welcome!
        </h1>
        {pwIncorrect ? <div>
        Username or password incorrect
        </div> : <div>
        Please login
        </div>}
            <input value={username}
                onChange={ev => setUsername(ev.target.value)}
                type="text" placeholder="username" className="block w-full rounded-sm p-2 mb-2 "/>
            <input value={password}
                onChange={ev => setPassword(ev.target.value)}
                type="text" placeholder="password" className="block w-full rounded-sm p-2 mb-2 "/>
            <button className="bg-blue-400 text-white block w-full p-2" >Login</button>
            <Link to="/register" className="hover:text-blue-500">
        Don't have an account?
        </Link>
        </form>
    </div>
    )
}