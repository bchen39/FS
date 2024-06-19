import {createContext, useState} from "react"

export const UserContext = createContext({});

export function UserContextProvider({children}) {
    const [username, setUsername] = useState("");
    const [id, setId] = useState("")
    return (<UserContext.Provider value={{username, setUsername, id, setId}}>
        {children}
    </UserContext.Provider>);
}