
import React from 'react'
import dataPacientes from '../tests/pacientes.json'
import dataConsultas from '../tests/consultas.json'
import TablePacientes from '../components/TablePacientes'

const Pacientes = () => {
  const {pacientes} = dataPacientes;
  const {consultas} = dataConsultas;

  return (
    <div className='w-full flex flex-col justify-center items-center'>
      
      <TablePacientes pacientes={pacientes} consultas={consultas}></TablePacientes>
    </div>
  )
}

export default Pacientes
