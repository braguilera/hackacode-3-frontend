import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import Contexto from '../contexto/Contexto';

const RutaPublica = ({children}) => {
  const {logeado, rol} = useContext(Contexto);

  if (logeado) {
    const rutaRedireccion = rol === 'ROLE_DIRECTOR' ? '/dashboard' : 
                            rol === 'ROLE_ADMIN' ? '/consultas' : 
                            '/pacientes';
    return <Navigate to={rutaRedireccion} replace />;
  }

  return children;
}

export default RutaPublica;