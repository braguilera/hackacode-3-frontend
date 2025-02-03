import React from 'react';
import CardServicio from '../components/CardServicio';
import CardPaquete from '../components/CardPaquete';
import dataServicios from '../tests/servicios.json';
import dataPaquetes from '../tests/paquetes.json';
import { Plus } from 'lucide-react';

const Servicios = () => {
  const { servicios } = dataServicios;
  const { paquetes } = dataPaquetes;

  // Funciones de ejemplo
  const editService = () => alert("editado");
  const deleteService = () => alert("eliminado");
  const editPaquete = () => alert("editado");
  const deletePaquete = () => alert("eliminado");

  return (
    <main className='w-full h-full flex gap-6 p-6 bg-gray-50'>
      {/* Contenedor Principal - Servicios */}
      <section className='flex-1 flex flex-col h-full'>
        <h2 className='text-2xl font-bold text-gray-800 mb-4 px-2'>
          Servicios Médicos
          <span className='text-gray-400 font-normal ml-2 text-lg'>({servicios.length} disponibles)</span>
        </h2>
        
        <article className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-50'>
          <button className='border-gray-300 border-2 border-dashed rounded-xl flex justify-center items-center p-6 group hover:bg-blue-50 hover:border-blue-400 transition-all duration-300'>
            <Plus size={48} className='text-gray-400 group-hover:text-blue-500 transition-all duration-300' />
          </button>
          {servicios.map((servicio) => (
            <CardServicio
              key={servicio.id}
              dataServicio={servicio}
              onEdit={editService}
              onDelete={deleteService}
            />
          ))}
        </article>
      </section>

      {/* Contenedor Lateral - Paquetes */}
      <section className='w-96 min-w-96 flex flex-col h-full border-l border-gray-200 pl-6'>
        <h2 className='text-2xl font-bold text-gray-800 mb-4 px-2'>
          Paquetes
          <span className='text-gray-400 font-normal ml-2 text-lg'>({paquetes.length} combinaciones)</span>
        </h2>
        
        <article className='flex flex-col gap-4 pr-2 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-gray-50'>
          <button className='border-gray-300 border-2 border-dashed rounded-xl flex justify-center items-center p-6 group  hover:bg-orange-50 hover:border-orange-400 transition-all duration-300'>
            <Plus size={48} className='text-gray-400 group-hover:text-orange-500 transition-all duration-300' />
          </button>
          {paquetes.map((paquete) => (
            <CardPaquete
              key={paquete.id}
              dataPaquete={paquete}
              onEdit={editPaquete}
              onDelete={deletePaquete}
            />
          ))}
        </article>
      </section>
    </main>
  );
};

export default Servicios;
