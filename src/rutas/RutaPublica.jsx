import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import Contexto from '../contexto/Contexto';

const RutaPublica = ({children}) => {
  const {logeado}=useContext(Contexto);

  return (!logeado)
  ? children
  : <Navigate to="/dashboard"/>
}


export default RutaPublica
