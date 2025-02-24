import React, { useContext } from 'react'
import Contexto from '../contexto/Contexto';
import { Navigate, useLocation } from 'react-router-dom';

const RutaPrivada = ({children}) => {
  const {logeado, rol} = useContext(Contexto);
  const location = useLocation();
  
  if (!logeado) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const rutasPermitidas = {
    ROLE_RECEPCIONISTA: ['consultas', 'agenda', 'pacientes'],
    ROLE_ADMIN: ['consultas', 'pacientes', 'medicos', 'servicios', 'agenda'],
    ROLE_DIRECTOR: ['dashboard', 'consultas', 'pacientes', 'medicos', 'servicios', 'agenda']
  };

  const rutaActual = location.pathname.split('/')[1];
  
  if (!rutasPermitidas[rol]?.includes(rutaActual)) {
    const rutaPorDefecto = rol === 'ROLE_DIRECTOR' ? '/dashboard' : '/consultas';
    return <Navigate to={rutaPorDefecto} replace />;
  }

  return children;
}

export default RutaPrivada;