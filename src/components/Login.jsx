import React, { useContext } from 'react'
import Contexto from '../contexto/Contexto'
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const {setLogeado} = useContext(Contexto);
    const navegacion = useNavigate();

    const manejarLogeo = () => {
      setLogeado(true);
      navegacion('/dashboard');
    };

  return (
    <div>
        <button onClick={manejarLogeo}>Iniciar sesion</button>
    </div>
  )
}

export default Login
