import React from 'react';
import CardServicio from '../components/CardServicio';
import CardPaquete from '../components/CardPaquete';
import dataServicios from '../tests/servicios.json';
import dataPaquetes from '../tests/paquetes.json';

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
      <div className='flex-1 flex flex-col h-full'>
        <h2 className='text-2xl font-bold text-gray-800 mb-4 px-2'>
          Servicios Médicos
          <span className='text-gray-400 font-normal ml-2 text-lg'>({servicios.length} disponibles)</span>
        </h2>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-50'>
          {servicios.map((servicio) => (
            <CardServicio
              key={servicio.id}
              dataServicio={servicio}
              onEdit={editService}
              onDelete={deleteService}
            />
          ))}
        </div>
      </div>

      {/* Contenedor Lateral - Paquetes */}
      <div className='w-96 min-w-96 flex flex-col h-full border-l border-gray-200 pl-6'>
        <h2 className='text-2xl font-bold text-gray-800 mb-4 px-2'>
          Paquetes
          <span className='text-gray-400 font-normal ml-2 text-lg'>({paquetes.length} combinaciones)</span>
        </h2>
        
        <div className='flex flex-col gap-4 pr-2 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-gray-50'>
          {paquetes.map((paquete) => (
            <CardPaquete
              key={paquete.id}
              dataPaquete={paquete}
              onEdit={editPaquete}
              onDelete={deletePaquete}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Servicios;