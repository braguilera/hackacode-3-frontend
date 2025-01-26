import React from 'react'
import Nav from '../components/Nav'
import { Navigate, Route, Routes } from 'react-router-dom'
import Dashborad from '../components/Dashboard'
import Consultas from '../components/Consultas'
import Pacientes from '../components/Pacientes'
import Medicos from '../components/Medicos'
import Servicios from '../components/Servicios'

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
