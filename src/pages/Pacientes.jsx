
import React from 'react'
import dataPacientes from '../tests/pacientes.json'
import TablePacientes from '../components/TablePacientes'

const Pacientes = () => {
  const {pacientes} = dataPacientes;

  return (
    <div className='w-full flex flex-col justify-center items-center'>
      
      <TablePacientes pacientes={pacientes}></TablePacientes>
    </div>
  )
}

export default Pacientes
