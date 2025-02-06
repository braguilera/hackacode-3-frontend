import React, { useEffect, useState } from 'react';
import CardServicio from '../components/CardServicio';
import CardPaquete from '../components/CardPaquete';
import { ArrowRight, Plus, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { deleteDatos, getDatos, postDatos } from '../api/crud';

const Servicios = () => {
  const [servicios, setServicios] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false)
  const [servicioData, setServicioData] = useState({
    nombre: '',
    descripcion: '',
    precio: ''
  });

  const editService = () => alert("editado");
  const editPaquete = () => alert("editado");
  const deletePaquete = () => alert("eliminado");

      const fetchServicios = async () => {
        try {
          const data = await getDatos('/api/servicios/individuales', 'Error cargando medicos');
          setServicios(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      const fetchPaquetes = async () => {
        try {
          const data = await getDatos('/api/servicios/paquetes', 'Error cargando medicos');
          setPaquetes(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
    
      useEffect(() => {
        fetchServicios();
        fetchPaquetes();
      }, []);

      const deleteService = async (e) => {
        try {
          await deleteDatos(`/api/servicios/individuales/${e.codigo}`, 'Error eliminando servicio');
          await fetchServicios();
        } catch (error) {
          console.error(error.message);
          throw error;
        }
      };

      const handleChange = (e) => {
        const { name, value } = e.target;
        setServicioData(prev => ({ ...prev, [name]: value }));
      };
      

      const handleSubmitServicio = async (e) => {
        e.preventDefault(); // Evitar recarga de la página
      
        try {
          await postDatos('/api/servicios/individuales', servicioData, 'Error creando servicio');
          await fetchServicios(); // Recargar lista de servicios
      
          // 🔹 Resetear el estado con un nuevo objeto
          setServicioData({ nombre: '', descripcion: '', precio: '' });
      
          setOpenForm(false); // Cerrar formulario después de enviar
        } catch (error) {
          console.error(error.message);
        }
      };

  return (
    <main className='w-full h-full flex gap-6 p-6 bg-gray-50'>

      {/* Principal Container - Services */}
      <section className='flex-1 flex flex-col h-full'>
        <h2 className='text-2xl font-bold text-gray-800 mb-4 px-2'>
          Servicios Médicos
          <span className='text-gray-400 font-normal ml-2 text-lg'>({servicios.length} disponibles)</span>
        </h2>
        
        <article className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-50'>
          <aside className='h-40 w-full'>
          <AnimatePresence mode="wait">
      {openForm ? (
        <motion.article
          key="close-button"
          className="h-full w-full bg-white rounded-xl relative p-4 shadow-sm border border-gray-100"
          initial={{ y: -50, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
          layout
        >
          <button
            onClick={() => setOpenForm(false)}
            className="hover:bg-gray-50 rounded-full p-1.5 absolute top-2 right-2 transition-colors"
          >
            <X size={16} className="text-gray-400" />
          </button>

          <form onSubmit={handleSubmitServicio} className="flex flex-col gap-2 h-full">
            <div className="space-y-3 flex-1">
              <input
                type="text"
                name="nombre"
                value={servicioData.nombre}
                onChange={handleChange}
                placeholder="Nombre del servicio"
                required
                className="w-4/5 px-3 py-1.5 text-sm bg-gray-50 rounded-md border-0 placeholder:text-gray-400 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />

              <input
                type="text"
                name="descripcion"
                value={servicioData.descripcion}
                onChange={handleChange}
                placeholder="Descripción breve"
                required
                className="w-4/5 px-3 py-1.5 text-sm bg-gray-50 rounded-md border-0 placeholder:text-gray-400 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />

              <input
                type="number"
                name="precio"
                value={servicioData.precio}
                onChange={handleChange}
                placeholder="Precio"
                required
                className="w-4/5 px-3 py-1.5 text-sm bg-gray-50 rounded-md border-0 placeholder:text-gray-400 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="absolute bottom-5 right-4 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
            >
              <ArrowRight size={20} />
            </button>
          </form>
        </motion.article>
      ) : (
        <motion.button
          key="open-button"
          className="border-gray-300 h-full w-full border-2 border-dashed rounded-xl flex justify-center items-center p-6 group hover:bg-blue-50 hover:border-blue-400"
          onClick={() => setOpenForm(true)}
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -50, opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          layout
        >
          <Plus size={48} className="text-gray-400 group-hover:text-blue-500 transition-all duration-300" />
        </motion.button>
      )}
    </AnimatePresence>
            

          </aside>  
          {servicios.map((servicio) => (
            <CardServicio
              key={servicio.codigo}
              dataServicio={servicio}
              onEdit={editService}
              onDelete={deleteService}
            />
          ))}
        </article>
      </section>

      {/* Secundary Container - Packages */}
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
