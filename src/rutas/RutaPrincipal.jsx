import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../components/Login'
import RutaPublica from './RutaPublica'
import RutaPrivada from './RutaPrivada'
import RutaSecundaria from './RutaSecundaria'

const RutaPrincipal = () => {
  return (
    <>
      <Routes>
        <Route path='login' element={
          <RutaPublica>
              <Login/>
          </RutaPublica>
        }/>

        <Route path='/*' element={
          <RutaPrivada>
            <RutaSecundaria/>
          </RutaPrivada>
        }/>
      </Routes>
    </>
  )
}

export default RutaPrincipal
