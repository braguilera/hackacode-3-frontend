import { useState, useEffect } from "react";
import Contexto from "./Contexto";

const Provider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("token") || "");
    const [logeado, setLogeado] = useState(() => !!localStorage.getItem("token"));
    const [darkMode, setDarkMode] = useState(() => {
        const savedDarkMode = localStorage.getItem('darkMode');
        return savedDarkMode ? JSON.parse(savedDarkMode) : false;
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
            setLogeado(true);
        } else {
            localStorage.removeItem("token");
            setLogeado(false);
        }
    }, [token]);

    return (
        <Contexto.Provider value={{ darkMode, setDarkMode, logeado, setLogeado, token, setToken }}>
            {children}
        </Contexto.Provider>
    );
};

export default Provider;
