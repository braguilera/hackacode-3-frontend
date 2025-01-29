import React from 'react'
import CardMedico from '../components/CardMedico'
import data from '../tests/medicos.json'



const Medicos = () => {
  const {medicos} = data;



  return (
    <div className="w-full p-6 grid grid-rows-none sm:grid-rows-5 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" >
      {medicos.map(medico => (
        <CardMedico dataMedico={medico}></CardMedico>
      ))}
    </div>
  )
}

export default Medicos
