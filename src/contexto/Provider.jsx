import { useState, useEffect } from "react";
import Contexto from "./Contexto"

const Provider = ({children}) => {
    const [darkMode, setDarkMode] = useState(() => {
        const savedDarkMode = localStorage.getItem('darkMode');
        return savedDarkMode ? JSON.parse(savedDarkMode) : false;
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    return (
        <Contexto.Provider value={{darkMode, setDarkMode}}>
            {children}
        </Contexto.Provider>
    )
}

export default Provider