import React, { useEffect, useState } from 'react';
import CardServicio from '../components/CardServicio';
import CardPaquete from '../components/CardPaquete';
import { ArrowRight, Package, Plus, Wrench, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { deleteDatos, getDatos, postDatos } from '../api/crud';

const Servicios = () => {
  const [servicios, setServicios] = useState([]);
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
  const [serviciosActuales, setServiciosActuales] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFormServicios, setOpenFormServicios] = useState(false);
  const [openFormPaquetes, setOpenFormPaquetes] = useState(false);
  const [servicioData, setServicioData] = useState({
    nombre: '',
    descripcion: '',
    precio: ''
  });
  const [paqueteData, setPaqueteData] = useState({
    nombre: '',
    servicios: []
  });

  const editService = () => alert("editado");
  const editPaquete = () => alert("editado");
  const deletePaquete = () => alert("eliminado");

      const fetchServicios = async () => {
        try {
          const data = await getDatos('/api/servicios/individuales', 'Error cargando medicos');
          setServicios(data);
          setServiciosDisponibles(data);
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
        e.preventDefault();
      
        try {
          await postDatos('/api/servicios/individuales', servicioData, 'Error creando servicio');
          await fetchServicios();

          setServicioData({ nombre: '', descripcion: '', precio: '' });
      
          setOpenFormServicios(false);
        } catch (error) {
          console.error(error.message);
        }
      };

      // 🔹 Agregar servicio a los actuales y quitarlo de los disponibles
      const handleAgregarServicio = (servicio) => {
        setServiciosActuales((prev) => [...prev, servicio]);
        setServiciosDisponibles((prev) => prev.filter((s) => s.codigo !== servicio.codigo));

        setPaqueteData((prev) => ({
          ...prev,
          servicios: [...prev.servicios, servicio.codigo] // Guardamos solo los códigos en el paquete
        }));
      };

      // 🔹 Quitar servicio de los actuales y regresarlo a los disponibles
      const handleQuitarServicio = (servicio) => {
        setServiciosDisponibles((prev) => [...prev, servicio]);
        setServiciosActuales((prev) => prev.filter((s) => s.codigo !== servicio.codigo));

        setPaqueteData((prev) => ({
          ...prev,
          servicios: prev.servicios.filter((codigo) => codigo !== servicio.codigo)
        }));
      };

      // 🔹 Manejar cambios en el nombre del paquete
      const handleChangePaquete = (e) => {
        setPaqueteData({ ...paqueteData, [e.target.name]: e.target.value });
      };

      // 🔹 Enviar el paquete al backend
      const handleSubmitPaquete = async (e) => {
        e.preventDefault();

        try {
          await postDatos('/api/paquetes', paqueteData, 'Error creando paquete');
          setPaqueteData({ nombre: '', servicios: [] });
          setServiciosActuales([]);
          fetchServicios();
          setOpenFormPaquetes(false);
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
        
        <article className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pr-4 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-50'>
        <aside className="h-40 w-full">
      <AnimatePresence mode="wait">
        {openFormServicios ? (
          <motion.main
            key="service-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full flex flex-col h-40 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden relative group"
          >
            {/* Header with Icon */}
            <header className="absolute top-0 left-0 right-0 flex items-center gap-2 p-4 bg-white">
              <aside className="p-2 bg-blue-100 rounded-lg">
                <Wrench size={20} className="text-blue-600" />
              </aside>
              <input
                type="text"
                name="nombre"
                value={servicioData.nombre}
                onChange={handleChange}
                placeholder="Nombre del servicio"
                required
                className="flex-1 text-xl font-semibold text-gray-800 bg-transparent border-0 focus:ring-0 outline-none placeholder:text-gray-400"
              />
              <button
                onClick={() => setOpenFormServicios(false)}
                className="p-1.5 rounded-full hover:bg-gray-50 text-gray-600"
              >
                <X size={16} />
              </button>
            </header>

            {/* Form Content */}
            <form onSubmit={handleSubmitServicio} className="h-full pt-16 px-4 pb-2">
              <article className="flex flex-col justify-between h-full">
                <div className="space-y-2">
                  <textarea
                    name="descripcion"
                    value={servicioData.descripcion}
                    onChange={handleChange}
                    placeholder="Descripción breve del servicio"
                    required
                    className="w-full text-base text-gray-600 bg-transparent border-0 focus:ring-0 outline-none resize-none placeholder:text-gray-400 line-clamp-2"
                    rows={2}
                  />
                </div>

                <footer className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Precio:</span>
                    <input
                      type="number"
                      name="precio"
                      value={servicioData.precio}
                      onChange={handleChange}
                      placeholder="0.00"
                      required
                      className="w-24 text-xl font-semibold text-slate-600 bg-transparent border-0 focus:ring-0 outline-none placeholder:text-gray-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-sm"
                  >
                    <ArrowRight size={18} />
                  </button>
                </footer>
              </article>
            </form>
          </motion.main>
        ) : (
          <motion.button
            key="open-button"
            className="border-gray-300 h-full w-full border-2 border-dashed rounded-xl flex justify-center items-center p-6 group hover:bg-blue-50 hover:border-blue-400"
            onClick={() => setOpenFormServicios(true)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
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
          
        <aside className="w-full">
      <AnimatePresence mode="wait">
        {openFormPaquetes ? (
          <motion.article
            key="close-button"
            className="w-full bg-white rounded-xl relative border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ y: 50, opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            layout
          >
            <header className="flex items-center gap-2 p-4 border-b border-gray-100">
              <aside className="p-2 bg-blue-100 rounded-lg">
                <Package size={20} className="text-blue-600" />
              </aside>
              <input
                type="text"
                name="nombre"
                value={paqueteData.nombre}
                onChange={handleChangePaquete}
                placeholder="Nombre del Paquete"
                required
                className="flex-1 px-3 py-1.5 text-lg font-semibold text-gray-800 bg-transparent border-0 placeholder:text-gray-400 focus:ring-0 outline-none"
              />
              <button
                onClick={() => {
                  setOpenFormPaquetes(false);
                  setPaqueteData({ nombre: '', servicios: [] });
                  setServiciosActuales([]);
                  fetchServicios();
                }}
                className="p-1.5 rounded-full hover:bg-gray-50 text-gray-600"
              >
                <X size={16} />
              </button>
            </header>
            
            <form onSubmit={handleSubmitPaquete} className="flex flex-col">
              <div className="p-4 grid grid-rows-[auto_1fr] gap-4" style={{ height: '460px' }}>
                {/* Selected Services */}
                <article className="h-[180px]">
                  <h2 className="text-sm font-semibold text-gray-800 mb-2">Servicios Seleccionados</h2>
                  <div className="h-[150px] overflow-y-auto pr-2 space-y-1.5">
                    <AnimatePresence>
                      {serviciosActuales.length === 0 ? (
                        <p className="text-sm text-gray-400 italic p-2">No hay servicios seleccionados</p>
                      ) : (
                        serviciosActuales.map((servicio) => (
                          <motion.div
                            key={servicio.codigo}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex justify-between items-center text-sm py-2 px-3 bg-gray-100 rounded-lg group"
                          >
                            <span className="text-gray-700">{servicio.nombre}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-700 font-semibold">${servicio.precio}</span>
                              <button
                                onClick={() => handleQuitarServicio(servicio)}
                                className="p-1 rounded-full hover:bg-white text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                </article>

                {/* Available Services */}
                <article className="h-[180px]">
                  <h2 className="text-sm font-semibold text-gray-800 mb-2">Servicios Disponibles</h2>
                  <div className="h-[150px] overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                      <AnimatePresence>
                        {serviciosDisponibles.map((servicio) => (
                          <motion.button
                            key={servicio.codigo}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            onClick={() => handleAgregarServicio(servicio)}
                            className="flex justify-between items-center py-2 px-3 bg-white border border-gray-200 rounded-lg hover:border-blue-200 hover:bg-blue-50/50 transition-all text-left group"
                          >
                            <span className="text-sm text-gray-700">{servicio.nombre}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-gray-700">${servicio.precio}</span>
                              <Plus size={14} className="text-gray-400 group-hover:text-blue-500" />
                            </div>
                          </motion.button>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </article>
              </div>

              {/* Footer with Submit Button */}
              <footer className="p-4 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <span>Guardar Paquete</span>
                  <ArrowRight size={18} />
                </button>
              </footer>
            </form>
          </motion.article>
        ) : (
          <motion.button
            key="open-button"
            className="border-gray-300 h-40 w-full border-2 border-dashed rounded-xl flex justify-center items-center p-6 group hover:bg-orange-50 hover:border-orange-400"
            onClick={() => setOpenFormPaquetes(true)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Plus size={48} className="text-gray-400 group-hover:text-orange-500 transition-all duration-300" />
          </motion.button>
        )}
      </AnimatePresence>
    </aside>

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
