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
    <main className='flex justify-center items-center bg-light-background w-full h-screen'>
        <button onClick={manejarLogeo}
        className='bg-slate-400 p-4 rounded-full '
        >
          Iniciar sesion
        </button>
    </main>
  )
}

export default Login
