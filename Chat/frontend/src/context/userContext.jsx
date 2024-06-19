import {createContext, useState} from "react"

export const UserContext = createContext({});

export function UserContextProvider({children}) {
    const [username, setUsername] = useState("");
    const [id, setId] = useState("")
    const [room, setRoom] = useState("");
    return (<UserContext.Provider value={{username, setUsername, id, setId, room, setRoom}}>
        {children}
    </UserContext.Provider>);
}