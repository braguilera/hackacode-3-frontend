
import React from 'react'
import dataPacientes from '../tests/pacientes.json'
import dataConsultas from '../tests/consultas.json'
import TablePacientes from '../components/TablePacientes'

const Pacientes = () => {
  const {pacientes} = dataPacientes;
  const {consultas} = dataConsultas;

  const editPaciente = () => alert("editado");
  const deletePaciente = () => alert("eliminado");

  return (
    <div className='w-full flex flex-col justify-center items-center box-border mx-10'>
      
      <TablePacientes pacientes={pacientes} consultas={consultas} onEdit={editPaciente} onDelete={deletePaciente}></TablePacientes>
    </div>
  )
}

export default Pacientes
