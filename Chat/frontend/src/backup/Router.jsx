import React, { useState, useContext, useEffect } from 'react'
import Register from './Register'
import Login from './Login'
import Home from './Home'
import { UserContext } from './userContext'
import './App.css'

export default function Router() {
    const {username, setUsername, id, setId} = useContext(UserContext);
    useEffect(() => {
        const loggedInUser = localStorage.getItem("username");
        if (loggedInUser) {
          console.log(loggedInUser);
          {/*const foundUser = JSON.parse(loggedInUser);
          console.log(foundUser);*/}
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