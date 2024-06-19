import { useState, useContext } from "react"
import { UserContext, UserContextProvider } from "./userContext.jsx"

export default function Home() {

    const {username, setUsername, id, setId} = useContext(UserContext);

    const handleLogout = () => {
        setUsername("");
        setId("");
        localStorage.clear();
      };
    return(<UserContextProvider>
        <div>
            <h1>Logged in! {username}</h1>
            <button onClick={handleLogout}>logout</button>
        </div>
    </UserContextProvider>
    )
}