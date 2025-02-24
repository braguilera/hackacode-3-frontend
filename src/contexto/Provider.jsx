import { useState, useEffect } from "react";
import { decodeToken } from "react-jwt";
import Contexto from "./Contexto";

const Provider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("token") || "");
    const [logeado, setLogeado] = useState(() => !!localStorage.getItem("token"));
    const [rol, setRol] = useState(() => localStorage.getItem("rol") || "");
    const [darkMode, setDarkMode] = useState(() => {
        const savedDarkMode = localStorage.getItem('darkMode');
        return savedDarkMode ? JSON.parse(savedDarkMode) : false;
    });

    // Efecto para decodificar el token y manejar el rol
    useEffect(() => {
        if (token) {
            try {
                const decoded = decodeToken(token);
                
                if (decoded?.authorities) {
                    setRol(decoded.authorities);
                    localStorage.setItem("rol", decoded.authorities);
                }
            } catch (error) {
                console.error("Error decodificando token:", error);
                setRol("");
                localStorage.removeItem("rol");
            }
        } else {
            setRol("");
            localStorage.removeItem("rol");
        }
    }, [token]);

    // Efecto para dark mode
    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    // Efecto principal para manejar el token
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
        <Contexto.Provider value={{ 
            darkMode, 
            setDarkMode,
            logeado,
            setLogeado,
            token,
            setToken,
            rol
        }}>
            {children}
        </Contexto.Provider>
    );
};

export default Provider;