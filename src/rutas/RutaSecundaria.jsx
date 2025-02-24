import React, { useContext } from 'react'
import Nav from '../components/Nav'
import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import Consultas from '../pages/Consultas'
import Pacientes from '../pages/Pacientes'
import Medicos from '../pages/Medicos'
import Servicios from '../pages/Servicios'
import AgendaMedica from '../pages/AgendaMedica'
import Contexto from '../contexto/Contexto'

const RutaSecundaria = () => {
  const { rol } = useContext(Contexto);

  return (
    <main className='flex h-screen bg-light-background'>
      <Nav/>

      <Routes>
        {rol === 'ROLE_DIRECTOR' && <Route path='dashboard' element={<Dashboard/>}/>}
        
        <Route path='consultas' element={<Consultas/>}/>
        <Route path='pacientes' element={<Pacientes/>}/>

        {(rol === 'ROLE_ADMIN' || rol === 'ROLE_DIRECTOR') && (
          <Route path='medicos' element={<Medicos/>}/>
        )}
        
        {(rol === 'ROLE_ADMIN' || rol === 'ROLE_DIRECTOR') && (
          <Route path='servicios' element={<Servicios/>}/>
        )}
        
        {(rol === 'ROLE_RECEPCIONISTA' || rol === 'ROLE_DIRECTOR') && (
          <Route path='agenda' element={<AgendaMedica/>}/>
        )}

        <Route 
          path="/" 
          element={<Navigate to={
            rol === 'ROLE_DIRECTOR' ? "dashboard" : 
            rol === 'ROLE_ADMIN' ? "consultas" : 
            "pacientes"
          } replace />} 
        />
        <Route 
          path="*" 
          element={<Navigate to={
            rol === 'ROLE_DIRECTOR' ? "/dashboard" : 
            rol === 'ROLE_ADMIN' ? "/consultas" : 
            "/pacientes"
          } replace />} 
        />
      </Routes>
    </main>
  )
}

export default RutaSecundaria;