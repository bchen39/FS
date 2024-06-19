import React, { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"  

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [pwIncorrect, setPwIncorrect] = useState(false);
    const navigate = useNavigate();
    const DEBUG = false;

    {/* Post login info to server, which then responds with success or fail. */}
    function postData(ev) {
        ev.preventDefault();
        var url = "http://localhost:4000/login";
        var data = {username, password};
        if (username == '')
            return;
        setPwIncorrect(false);
        axios.post(url, data)
        .then(res => {console.log(res);
            console.log(res.data);
            if (res.data.success) {
                // Login successful, store current user info in local storage and go to home page.
                {/** Disclaimer: This is an oversimplified and insecure method of tracking persistent
                   * login. DO NOT try this on a real system. Use Json Web Token (Cookies) instead. */}
                setUsername(username);
                localStorage.setItem("username", username);
                if (DEBUG) {
                    console.log(localStorage.getItem("username"));
                }
                navigate("/");
            } else {
                // Login failed, redirect to login page.
                setPwIncorrect(true);
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
        {pwIncorrect ? <div className="block rounded-sm mb-2 self-center text-red-600">
        Username or password incorrect
        </div>:<div className="block rounded-sm mb-2 self-center text-black">
        Please login
        </div>} {/* Displays different message if login failed. */}
            <input value={username}
                onChange={ev => setUsername(ev.target.value)}
                type="text" placeholder="username" className="block w-full rounded-sm p-2 mb-2 "/>
            <input value={password}
                onChange={ev => setPassword(ev.target.value)}
                type="text" placeholder="password" className="block w-full rounded-sm p-2 mb-2 "/>
            <button className="bg-blue-400 text-white block w-full p-2" >Login</button>
            <Link to="/register" className="hover:text-blue-500">
        Don't have an account?
        </Link> {/* Redirects to register page if new user. */}
        </form>
    </div>
    )
}