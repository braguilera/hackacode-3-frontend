import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { useContext } from "react";
import Contexto from "./contexto/Contexto";
import RutaPrincipal from "./rutas/RutaPrincipal"

const App = () => {
  const {darkMode} = useContext(Contexto); 

  return (
    <main className={darkMode && "dark"}>
      <RutaPrincipal/>
    </main>
    
  )
}

export default App;