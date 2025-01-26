import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { useContext } from "react";
import Contexto from "./contexto/Contexto";

const App = () => {
  const {darkMode} = useContext(Contexto); 

  return (
    <main className={darkMode && "dark"}>
      <BrowserRouter>
        <Routes>



        </Routes>
      </BrowserRouter>
    </main>
    
  )
}

export default App;