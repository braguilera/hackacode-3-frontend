import React, { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Contexto from '../contexto/Contexto';

const Nav = () => {
  const navegacion = useNavigate();
  const {setLogeado} = useContext(Contexto);

  const logout = () => {
    navegacion('/login');
    setLogeado(false);
};

  return (

    <>
    <main className='bg-white flex flex-col justify-between py-10 w-52 text-2xl box-border'>

        <section className='flex flex-col px-2 box-border'>
          <header className='flex justify-center py-6'>
            Logo
          </header>

          <NavLink
            to="dashboard"
            className={({ isActive }) =>
              isActive
                ? "text-light-accent bg-light-muted px-2 py-1 my-2 rounded-lg font-semibold transition-all duration-200 select-none" 
                : "text-blue-300 px-2 font-semibold py-1 my-2 hover:text-light-accent hover:transition-all hover:duration-200"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="consultas"
            className={({ isActive }) =>
              isActive
                ? "text-light-accent bg-light-muted px-2 py-1 my-2 rounded-lg font-semibold transition-all duration-200 " 
                : "text-blue-300 px-2 font-semibold py-1 my-2 hover:text-light-accent hover:transition-all hover:duration-200"
            }
          >
            Consultas
          </NavLink>

          <NavLink
            to="pacientes"
            className={({ isActive }) =>
              isActive
                ? "text-light-accent bg-light-muted px-2 py-1 my-2 rounded-lg font-semibold transition-all duration-200 " 
                : "text-blue-300 px-2 font-semibold py-1 my-2 hover:text-light-accent hover:transition-all hover:duration-200"
            }
          >
            Pacientes
          </NavLink>

          <NavLink
            to="medicos"
            className={({ isActive }) =>
              isActive
                ? "text-light-accent bg-light-muted px-2 py-1 my-2 rounded-lg font-semibold transition-all duration-200"
                : "text-blue-300 px-2 font-semibold py-1 my-2 hover:text-light-accent hover:transition-all hover:duration-200"
            }
          >
            Medicos
          </NavLink>


          <NavLink
            to="servicios"
            className={({ isActive }) =>
              isActive
                ? "text-light-accent bg-light-muted px-2 py-1 my-2 rounded-lg font-semibold transition-all duration-200 "
                : "text-blue-300 px-2 font-semibold py-1 my-2 hover:text-light-accent hover:transition-all hover:duration-200"
            }
          >
            Servicios
          </NavLink>

        </section>

    <footer>

      <button onClick={logout} className='text-gray-400 hover:text-gray-600 px-2 text-xl'>
        Cerrar sesión
      </button>

    </footer>


    </main>

    </>
  )
}

export default Nav
    