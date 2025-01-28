import React from 'react'
import Nav from '../components/Nav'
import { Navigate, Route, Routes } from 'react-router-dom'
import Dashborad from '../pages/Dashboard'
import Consultas from '../pages/Consultas'
import Pacientes from '../pages/Pacientes'
import Medicos from '../pages/Medicos'
import Servicios from '../pages/Servicios'

const RutaSecundaria = () => {
  return (
    <main className='flex h-screen bg-light-background'>
      <Nav/>

      <Routes>

        <Route path='dashboard' element={<Dashborad/>}/>
        <Route path='consultas' element={<Consultas/>}/>
        <Route path='pacientes' element={<Pacientes/>}/>
        <Route path='medicos' element={<Medicos/>}/>
        <Route path='servicios' element={<Servicios/>}/>


        <Route path="/" element={<Navigate to="dashboard" />} />

      </Routes>
    </main>
  )
}

export default RutaSecundaria
