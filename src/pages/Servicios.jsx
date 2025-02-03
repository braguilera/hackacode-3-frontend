import React from 'react'
import CardServicio from '../components/CardServicio'
import CardPaquete from '../components/CardPaquete'
import dataServicios from '../tests/servicios.json'
import dataPaquetes from '../tests/paquetes.json'


const Servicios = () => {
  const {servicios} = dataServicios;
  const {paquetes} = dataPaquetes;

  const editService = () =>{
    alert("editado")
  }

  const deleteService = () =>{
    alert("eliminado")
  }

  return (
    <main className='w-full h-full flex '>
      <article className='m-4 p-2 rounded-3xl w-3/4 grid grid-cols-3 gap-4 overflow-y-scroll overflow-x-hidden '>
        {
          servicios.map( servicio => (
            <CardServicio dataServicio={servicio} onEdit={editService} onDelete={deleteService}/>
          ))
        }
      </article>
      <article className='m-10 p-2 rounded-3xl w-1/4 grid grid-cols-1 gap-4 overflow-y-scroll overflow-x-hidden'>
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
