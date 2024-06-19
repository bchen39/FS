import { useState, useContext, useEffect } from 'react'
import Register from './components/Register'
import Login from './components/Login'
import Home from './components/Home'
import Router from './router/Router'
import Room from './components/Room'
//import io  from "socket.io-client";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { UserContext, UserContextProvider } from './context/userContext'
import './App.css'

//var socket = io.connect("http://localhost:4000");

function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/home" element={<Home/>}></Route>
        {/*<Route path="/room" element={<Room socket={socket}/>}></Route>*/}
      </Routes>
      <Router />
    </BrowserRouter>
    </UserContextProvider>
  )
}

export default App
