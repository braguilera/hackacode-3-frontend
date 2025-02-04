import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Stethoscope, Users, User, ClipboardList, LogOut } from 'lucide-react';
import Contexto from '../contexto/Contexto';

const Nav = () => {
  const navegacion = useNavigate();
  const { setLogeado } = useContext(Contexto);

  const logout = () => {
    navegacion('/login');
    setLogeado(false);
  };

  return (
    <main className='bg-white flex flex-col justify-between py-6 w-64 text-lg box-border shadow-xl h-screen'>
      <section className='flex flex-col px-4 box-border'>
        <header className='flex justify-center py-6 mb-4'>
          <span className='text-2xl font-bold text-blue-500'>Logo</span>
        </header>

        {/* Links Navigate */}
        <NavLink
          to="dashboard"
          className={({ isActive }) =>
            isActive
              ? "flex items-center text-blue-500 bg-blue-50 px-4 py-2 my-1 rounded-lg font-semibold transition-all duration-200 select-none"
              : "flex items-center text-gray-600 px-4 py-2 my-1 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200"
          }
        >
          <Home className="w-5 h-5 mr-2" />
          Dashboard
        </NavLink>

        <NavLink
          to="consultas"
          className={({ isActive }) =>
            isActive
              ? "flex items-center text-blue-500 bg-blue-50 px-4 py-2 my-1 rounded-lg font-semibold transition-all duration-200"
              : "flex items-center text-gray-600 px-4 py-2 my-1 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200"
          }
        >
          <Stethoscope className="w-5 h-5 mr-2" />
          Consultas
        </NavLink>

        <NavLink
          to="pacientes"
          className={({ isActive }) =>
            isActive
              ? "flex items-center text-blue-500 bg-blue-50 px-4 py-2 my-1 rounded-lg font-semibold transition-all duration-200"
              : "flex items-center text-gray-600 px-4 py-2 my-1 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200"
          }
        >
          <Users className="w-5 h-5 mr-2" />
          Pacientes
        </NavLink>

        <NavLink
          to="medicos"
          className={({ isActive }) =>
            isActive
              ? "flex items-center text-blue-500 bg-blue-50 px-4 py-2 my-1 rounded-lg font-semibold transition-all duration-200"
              : "flex items-center text-gray-600 px-4 py-2 my-1 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200"
          }
        >
          <User className="w-5 h-5 mr-2" />
          Médicos
        </NavLink>

        <NavLink
          to="servicios"
          className={({ isActive }) =>
            isActive
              ? "flex items-center text-blue-500 bg-blue-50 px-4 py-2 my-1 rounded-lg font-semibold transition-all duration-200"
              : "flex items-center text-gray-600 px-4 py-2 my-1 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200"
          }
        >
          <ClipboardList className="w-5 h-5 mr-2" />
          Servicios
        </NavLink>
      </section>

      {/* Logout */}
      <footer className='px-4 py-6 border-t border-gray-100'>
        <button
          onClick={logout}
          className='flex items-center text-gray-600 hover:text-blue-500 w-full px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200'
        >
          <LogOut className="w-5 h-5 mr-2" />
          Cerrar sesión
        </button>
      </footer>
    </main>
  );
};

export default Nav;