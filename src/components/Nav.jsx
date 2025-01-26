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
    <main className='bg-white flex flex-col'>
        <header>
          Logo
        </header>

        <section className='flex flex-col'>
        <NavLink
          to="dashboard"
          className={({ isActive }) =>
            isActive
              ? "text-blue-500 font-bold underline" // Clases para cuando está activo
              : "text-gray-500 hover:text-gray-800" // Clases para cuando no está activo
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="consultas"
          className={({ isActive }) =>
            isActive
              ? "text-blue-500 font-bold underline" // Clases para cuando está activo
              : "text-gray-500 hover:text-gray-800" // Clases para cuando no está activo
          }
        >
          Consultas
        </NavLink>

        <NavLink
          to="pacientes"
          className={({ isActive }) =>
            isActive
              ? "text-blue-500 font-bold underline" // Clases para cuando está activo
              : "text-gray-500 hover:text-gray-800" // Clases para cuando no está activo
          }
        >
          Pacientes
        </NavLink>

        <NavLink
          to="medicos"
          className={({ isActive }) =>
            isActive
              ? "text-blue-500 font-bold underline" // Clases para cuando está activo
              : "text-gray-500 hover:text-gray-800" // Clases para cuando no está activo
          }
        >
          Medicos
        </NavLink>


        <NavLink
          to="servicios"
          className={({ isActive }) =>
            isActive
              ? "text-blue-500 font-bold underline" // Clases para cuando está activo
              : "text-gray-500 hover:text-gray-800" // Clases para cuando no está activo
          }
        >
          Servicios
        </NavLink>

        </section>


    </main>

    <footer>

      <button onClick={logout}>
        Cerrar sesión
      </button>

    </footer>

    </>
  )
}

export default Nav
    