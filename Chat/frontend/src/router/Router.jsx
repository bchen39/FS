import React, { useContext, useEffect } from 'react'
import Login from '../components/Login'
import Home from '../components/Home'
import { UserContext } from '../context/userContext'
import '../App.css'

export default function Router() {
    const {username, setUsername, id, setId} = useContext(UserContext);
    useEffect(() => {
        const loggedInUser = localStorage.getItem("username");
        if (loggedInUser) {
          //console.log(loggedInUser);
          setUsername(loggedInUser);
          setId(localStorage.getItem("id"));
        }
      }, []);

    if (username) {
        return (
            <Home />
        );
    }

    return(
        <Login />
    );
}