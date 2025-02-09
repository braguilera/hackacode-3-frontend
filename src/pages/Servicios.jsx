import React, { useEffect, useState } from 'react';
import CardServicio from '../components/CardServicio';
import CardPaquete from '../components/CardPaquete';
import { Activity, ArrowRight, DollarSign, HeartPulse, Package, Plus, TrendingUp, Users, Wrench, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { deleteDatos, getDatos, postDatos } from '../api/crud';

const Servicios = () => {
  const [servicios, setServicios] = useState([]);
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
  const [serviciosActuales, setServiciosActuales] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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


      const handleAgregarServicio = (servicio) => {
        setServiciosActuales((prev) => [...prev, servicio]);
        setServiciosDisponibles((prev) => prev.filter((s) => s.codigo !== servicio.codigo));
        setPaqueteData((prev) => ({
          ...prev,
          servicios: [...prev.servicios, servicio.codigo] 
        }));
      };
      const handleQuitarServicio = (servicio) => {
        setServiciosDisponibles((prev) => [...prev, servicio]);
        setServiciosActuales((prev) => prev.filter((s) => s.codigo !== servicio.codigo));

        setPaqueteData((prev) => ({
          ...prev,
          servicios: prev.servicios.filter((codigo) => codigo !== servicio.codigo)
        }));
      };

      const handleChangePaquete = (e) => {
        setPaqueteData({ ...paqueteData, [e.target.name]: e.target.value });
      };

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

      const calcularEstadisticas = () => {
        const precioPromedio = servicios.reduce((acc, serv) => acc + Number(serv.precio), 0) / servicios.length;
        const precioTotal = servicios.reduce((acc, serv) => acc + Number(serv.precio), 0);
        return {
          precioPromedio: precioPromedio || 0,
          precioTotal: precioTotal || 0,
          serviciosEnPaquetes: paquetes.reduce((acc, paq) => acc + paq.servicios?.length || 0, 0)
        };
      };
    
      const stats = calcularEstadisticas();

      const serviciosFiltrados = servicios.filter(servicio =>
        servicio.nombre?.toLowerCase().startsWith(searchTerm.toLowerCase())
      );

  return (
<main className='w-full h-full flex flex-col gap-6 p-6 bg-gray-50'>
      {/* Dashboard Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 border-b border-gray-200 pb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm ">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="text-blue-600 h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Servicios Activos</p>
              <p className="text-xl font-semibold text-gray-800">{servicios.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm ">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="text-green-600 h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Paquetes Disponibles</p>
              <p className="text-xl font-semibold text-gray-800">{paquetes.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm ">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="text-purple-600 h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Precio Promedio</p>
              <p className="text-xl font-semibold text-gray-800">${stats.precioPromedio.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm ">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="text-orange-600 h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Servicios en Paquetes</p>
              <p className="text-xl font-semibold text-gray-800">{stats.serviciosEnPaquetes}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className='flex gap-6 h-[calc(100%-120px)]'>
        {/* Principal Container - Services */}
        <section className='flex-1 flex flex-col h-full pl-6'>
          <header className='flex items-center justify-between mb-6'>
            <div>
              <h2 className='text-2xl font-bold text-gray-800'>
                Servicios Médicos
                <span className='text-gray-400 font-normal ml-2 text-lg'>({servicios.length} disponibles)</span>
              </h2>
              <p className='text-gray-500 mt-1'>Gestiona los servicios individuales disponibles para los pacientes</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Valor total de servicios:</span>
              <span className="text-lg font-semibold text-gray-800">${stats.precioTotal.toFixed(2)}</span>
            </div>
          </header>
                    {/* Search Bar */}
                    <div className="mb-6">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Buscar servicios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
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
            <header className="absolute top-0 left-0 w-full flex items-center gap-2 p-4 bg-white">
              <aside className="p-2 bg-blue-100 rounded-lg">
                <HeartPulse  size={20} className="text-blue-600" />
              </aside>
              <input
                type="text"
                name="nombre"
                maxLength={50}

                value={servicioData.nombre}
                onChange={handleChange}
                placeholder="Nombre del servicio"
                required
                className="flex-1 text-lg w-full font-semibold text-gray-800 bg-transparent border-0 focus:ring-0 outline-none placeholder:text-gray-400"
              />
              <button
                onClick={() => setOpenFormServicios(false)}
                className=" p-1.5 rounded-full hover:bg-gray-50 text-gray-600"
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
                    maxLength={50}
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
                      maxLength={50}
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
            transition={{ duration: 0.2 }}
          >
            <Plus size={48} className="text-gray-400 group-hover:text-blue-500 transition-all duration-300" />
          </motion.button>
        )}
      </AnimatePresence>
    </aside>
          {serviciosFiltrados.map((servicio) => (
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
        <section className='w-96 min-w-96 flex flex-col h-full pl-6 border-l border-gray-200'>
          <header className='mb-6'>
            <h2 className='text-2xl font-bold text-gray-800'>
              Paquetes
              <span className='text-gray-400 font-normal ml-2 text-lg'>
                {paquetes.length} 
                {paquetes.length === 1
                ? ' combinación'
                : ' combinaciones'}
                
                
                </span>
            </h2>
            <p className='text-gray-500 mt-1'>Combina servicios para crear ofertas especiales</p>
          </header>
          
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
                  maxLength={50}
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
                    className="w-full justify-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
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
              className="border-gray-300 h-40 w-full border-2 border-dashed rounded-xl flex justify-center items-center p-6 group hover:bg-blue-50 hover:border-blue-400"
              onClick={() => setOpenFormPaquetes(true)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Plus size={48} className="text-gray-400 group-hover:text-blue-500 transition-all duration-300" />
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
      </div>
    </main>
  );
};

export default Servicios;
