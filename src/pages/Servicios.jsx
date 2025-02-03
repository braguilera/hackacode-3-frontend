import React from 'react'
import CardServicio from '../components/CardServicio'
import CardPaquete from '../components/CardPaquete'
import dataServicios from '../tests/servicios.json'
import dataPaquetes from '../tests/paquetes.json'


const Servicios = () => {
  const {servicios} = dataServicios;
  const {paquetes} = dataPaquetes;


  return (
    <main className='w-full h-full flex '>
      <article className='bg-white m-10 p-2 rounded-3xl w-3/4 flex flex-wrap overflow-y-scroll'>
        {
          servicios.map( servicio => (
            <CardServicio dataServicio={servicio}/>
          ))
        }
      </article>
      <article className='bg-white m-10 p-2 rounded-3xl w-1/4 flex flex-wrap overflow-y-scroll'>
        {
          paquetes.map( paquete => (
            <CardPaquete dataPaquete={paquete}/>
          ))
        }
      </article>
    </main>
  )
}

export default Servicios
