import React, { useEffect, useState } from 'react';
import CardServicio from '../components/CardServicio';
import CardPaquete from '../components/CardPaquete';
import { Activity, ArrowRight, DollarSign, HeartPulse, Package, Plus, TrendingUp, Users, Wrench, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { deleteDatos, getDatos, postDatos, putDatos } from '../api/crud';
import PopUpConfirmation from '../components/PopUpConfirmation';
import LoadingIndicator from '../components/LoadingIndicator';
import EditableCardService from '../components/EditableCardService';
import CardPaqueteEdit from '../components/CardPaqueteEdit';
import Notification from '../components/Notification';
import EmptyState from '../components/EmptyState';

const Servicios = () => {
  const [servicios, setServicios] = useState([]);
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
  const [serviciosActuales, setServiciosActuales] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [loadingServicios, setLoadingServicios] = useState(true);
  const [loadingPaquetes, setLoadingPaquetes] = useState(true);
  const [selecteServicioToDelete, SetSelecteServicioToDelete] = useState(null)
  const [selecteServicioToEdit, SetSelecteServicioToEdit] = useState(null)
  const [selectedPaqueteToDelete, setSelectedPaqueteToDelete] = useState(null);
  const [selectedServicioToEdit, setSelectedServicioToEdit] = useState(null);
  const [selectedPaqueteToEdit, setSelectedPaqueteToEdit] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [openFormServicios, setOpenFormServicios] = useState(false);
  const [openFormPaquetes, setOpenFormPaquetes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [servicioData, setServicioData] = useState({
    nombre: '',
    descripcion: '',
    precio: ''
  });
  const [servicioDataEdit, setServicioDataEdit] = useState({
    nombre: '',
    descripcion: '',
    precio: ''
  });
  const [paqueteData, setPaqueteData] = useState({
    nombre: '',
    servicios: []
  });
  const [paqueteEditando, setPaqueteEditando] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [messageNotification, setMessageNotification] = useState(null);



      const fetchServicios = async () => {
        setLoadingServicios(true);
        try {
          const data = await getDatos('/api/servicios/individuales', 'Error cargando medicos');
          setServicios(data);
          setServiciosDisponibles(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoadingServicios(false);
        }
      };

      const fetchPaquetes = async () => {
        setLoadingPaquetes(true)
        try {
          const data = await getDatos('/api/servicios/paquetes', 'Error cargando medicos');
          setPaquetes(data);
        } catch (err) {
          setError(err.message);
        }finally{
          setLoadingPaquetes(false);
        }

      };
    
      useEffect(() => {
        fetchServicios();
        fetchPaquetes();
      }, []);

      const deleteService = async (e) => {
        try {
          await deleteDatos(`/api/servicios/individuales/${e}`, 'Error eliminando servicio');
          await fetchServicios();
          setMessageNotification({
            type: 'success',
            text: 'Servicio eliminado exitosamente'
          });
          setShowNotification(true)
        } catch (error) {
          setMessageNotification({
            type: 'error',
            text: 'Error al eliminar el servicio'
          });
          setShowNotification(true)
        }
        finally{
          SetSelecteServicioToDelete(null)
        }
      };

      const handleEditClick = (servicio) => {
        setEditingService(servicio);
        setServicioDataEdit({
          nombre: servicio.nombre,
          descripcion: servicio.descripcion,
          precio: servicio.precio
        });
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
          setMessageNotification({
            type: 'success',
            text: 'Servicio creado exitosamente'
          });
          setShowNotification(true)
        } catch (error) {
          setMessageNotification({
            type: 'error',
            text: 'Error al crear el servicio'
          });
          setShowNotification(true)
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

        if (paqueteData.servicios.length === 0) {
          alert('Debe seleccionar al menos un servicio');
          return;
        }
      
        if (!paqueteData.nombre.trim()) {
          alert('El nombre del paquete es requerido');
          return;
        }
        try {
          setIsSubmitting(true)
          await postDatos('/api/servicios/paquetes', paqueteData, 'Error creando paquete');
          fetchServicios();
          fetchPaquetes();
          setPaqueteData({ nombre: '', servicios: [] });
          setServiciosActuales([]);
          setMessageNotification({
            type: 'success',
            text: 'Servicio creado exitosamente'
          });
          setShowNotification(true)
        } catch (error) {
          setMessageNotification({
            type: 'error',
            text: 'Error al crear el servicio'
          });
          setShowNotification(true)
        } finally {
          setTimeout(() => {
            setIsSubmitting(false);
            setOpenFormPaquetes(false);
            
          }, 1000);
        }
      };

      const iniciarEdicion = (paquete) => {
        setPaqueteEditando(paquete);
      };
      
      const cancelarEdicion = () => {
        setPaqueteEditando(null);
      };
      

      const serviciosFiltrados = servicios.filter(servicio =>
        servicio.nombre?.toLowerCase().startsWith(searchTerm.toLowerCase())
      );

      const confirmSubmitServiceEdit = async () => {
        try {
          await putDatos(
            `/api/servicios/individuales/${selectedServicioToEdit.codigo}`,
            selectedServicioToEdit.data,
            'Error editando servicio'
          );
          await fetchServicios();
          setEditingService(null);
          setMessageNotification({
            type: 'success',
            text: 'Servicio actualizado exitosamente'
          });
          setShowNotification(true)

        } catch (error) {
          setMessageNotification({
            type: 'error',
            text: 'Error al editar el servicio'
          });
          setShowNotification(true)
        } finally {
          setServicioDataEdit({ nombre: '', descripcion: '', precio: '' });
          setSelectedServicioToEdit(null);
          setOpenFormPaquetes(false);
        }
      };

      const confirmSubmitPaqueteEdit = async () => {
        console.log(selectedPaqueteToEdit);
        try {
          const payload = {
            nombre: selectedPaqueteToEdit.nombre,
            servicios: selectedPaqueteToEdit.servicios.map(s => s.codigo) // Extrae solo los códigos
          };
          await putDatos(
            `/api/servicios/paquetes/${selectedPaqueteToEdit.codigo}`,
            payload,
            'Error editando paquete'
          );
          await fetchPaquetes();
          setMessageNotification({
            type: 'success',
            text: 'Paquete actualizado exitosamente'
          });
          setShowNotification(true);
        } catch (error) {
          setMessageNotification({
            type: 'error',
            text: 'Error al editar el paquete'
          });
          setShowNotification(true);
        } finally {
          setSelectedPaqueteToEdit(null);
          setPaqueteEditando(null);
        }
      };
      
      
      const deletePaquete = async (paqueteCodigo) => {
        try {
          await deleteDatos(`/api/servicios/paquetes/${paqueteCodigo}`, 'Error eliminando servicio');
          await fetchPaquetes();
          setMessageNotification({
            type: 'success',
            text: 'Paquete eliminado exitosamente'
          });
          setShowNotification(true)
        } catch (error) {
          setMessageNotification({
            type: 'error',
            text: 'Error al eliminar el paquete'
          });
          setShowNotification(true)
        }
        
      }

  return (
<main className='w-full h-full flex flex-col gap-6 p-6 '>

      {/* Main Content */}
      <div className='flex gap-6 h-full'>


      {selecteServicioToDelete && (
        <div className="w-full fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <PopUpConfirmation 
            isOpen={!!selecteServicioToDelete}
            onConfirm={() => deleteService(selecteServicioToDelete.codigo)}
            onCancel={() => SetSelecteServicioToDelete(null)}
            itemId={selecteServicioToDelete.codigo}
            isDelete={true}
          />
        </div>
      )}

      {selectedServicioToEdit && (
  <div className="w-full fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
    <PopUpConfirmation
      isOpen={!!selectedServicioToEdit}
      onConfirm={confirmSubmitServiceEdit}
      onCancel={() => setSelectedServicioToEdit(null)}
      itemId={selectedServicioToEdit.codigo}
      isDelete={false}
    />
  </div>
)}


      {selectedPaqueteToDelete && (
        <div className="w-full fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <PopUpConfirmation 
            isOpen={!!selectedPaqueteToDelete}
            onConfirm={() => {
              deletePaquete(selectedPaqueteToDelete.codigo);
              setSelectedPaqueteToDelete(null);
            }}
            onCancel={() => setSelectedPaqueteToDelete(null)}
            itemId={selectedPaqueteToDelete.codigo}
            isDelete={true}
          />
        </div>
      )}

      {selectedPaqueteToEdit && (
  <div className="w-full fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
    <PopUpConfirmation
      isOpen={!!selectedPaqueteToEdit}
      onConfirm={confirmSubmitPaqueteEdit}
      onCancel={() => setSelectedPaqueteToEdit(null)}
      itemId={selectedPaqueteToEdit.codigo}
      isDelete={false}
    />
  </div>
)}



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
              <span className="text-lg font-semibold text-gray-800">1</span>
            </div>
          </header>
                    {/* Search Bar */}

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
          
          
          <article className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pr-4 pt-6  scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-50'>
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

        {loadingServicios 
        ?
        (
          Array.from({ length: 15 }).map((_, index) => (
            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                key={index}
                className={`w-full flex flex-col h-40 bg-white rounded-xl shadow-sm  overflow-hidden relative group select-none`}
            >
          <article className="pt-4 px-4 pb-2 flex flex-col justify-between h-full" >
                <header className='w-full flex flex-col items-start gap-2'>
                    <h2 className={`text-xl w-auto font-semibold text-gray-800 py-1 rounded-full`}>
                        <LoadingIndicator width={'w-32'} height={'h-7'}/>
                    </h2>
                    <p className="text-base text-gray-600 line-clamp-2"><LoadingIndicator width={'w-52'} height={'h-4'}/></p>
                </header>
                
                <footer className="flex items-center justify-between mt-2">
                    <article className="flex items-center gap-2 pt-2 border-t border-gray-100 w-full">
                        <span className='text-xl font-semibold text-slate-600'><LoadingIndicator width={'w-20'} height={'h-6'}/></span>
                    </article>
                </footer>
            </article>
            </motion.main>
          )))
        :
        (
        serviciosFiltrados.length!==0 
        ?
        serviciosFiltrados.map((servicio) => (
          <AnimatePresence mode="wait" key={servicio.codigo}>
            {editingService?.codigo === servicio.codigo ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative z-10"
              >
              <EditableCardService
                servicioData={servicioDataEdit}
                setServicioData={setServicioDataEdit}
                onCancel={() => setEditingService(null)}
                onSubmit={(e) => {
                  e.preventDefault();
                  setSelectedServicioToEdit({
                    codigo: editingService.codigo,
                    data: servicioDataEdit
                  });
                }}
              />
              </motion.div>
            ) : (
              <CardServicio
                key={servicio.codigo}
                dataServicio={servicio}
                onEdit={handleEditClick}
                onDelete={() => SetSelecteServicioToDelete(servicio)}
              />
            )}
          </AnimatePresence>
        ))
        :
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
          <EmptyState type='servicios'/>
        </div>
        )}
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
                              type="button"
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
                    disabled={paqueteData.servicios.length === 0}
                    className="w-full justify-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                  {isSubmitting ? (
                      <span>Guardando...</span>
                    ) : (
                      <>
                        <span>Guardar Paquete</span>
                        <ArrowRight size={18} />
                      </>
                    )}
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
  
      {loadingPaquetes ? (
        Array.from({ length: 5 }).map((_, index) => (
          <motion.main
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={index}
                  transition={{ duration: 0.02 }}
                  className='relative bg-white rounded-xl shadow-sm p-4 border border-gray-100 group select-none'
              >
                  <header className="flex items-center gap-2 mb-2">
                      <aside className="p-2 bg-blue-100 rounded-lg">
                          <Package size={20} className="text-blue-600" />
                      </aside>
                      <LoadingIndicator height={'h-6'}/>
                  </header>

                  <article className="space-y-2 mb-3">
                          <div className="flex justify-between items-center text-sm bg-gray-100 rounded-lg">
                      <LoadingIndicator height={'h-20'}/>
                          </div>

                  </article>

                  <footer className="pt-2 border-t border-gray-200">
                      <div className="flex justify-between items-center mt-2">

                      <LoadingIndicator height={'h-6'}/>
                      </div>
                  </footer>
              </motion.main>
        ))
        ) : (
          paquetes.length!==0 
          ?
            paquetes.map((paquete) => (
              <div key={paquete.codigo} className="relative">
                <AnimatePresence>
                  {paqueteEditando?.codigo === paquete.codigo ? (
                    <motion.div
                      className=" inset-0 z-10"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                    >
                    <CardPaqueteEdit
                      paquete={paqueteEditando}
                      serviciosDisponibles={serviciosDisponibles}
                      onCancel={cancelarEdicion}
                      onSave={(paqueteActualizado) => setSelectedPaqueteToEdit(paqueteActualizado)}
                    />
                    </motion.div>
                  )
                
                :

                (<motion.div layout
                >
                  <CardPaquete
                    dataPaquete={paquete}
                    onEdit={() => iniciarEdicion(paquete)}
                    onDelete={() => setSelectedPaqueteToDelete(paquete)}
                  />
                </motion.div>)}
                </AnimatePresence>
              </div>
            ))
            :
            <div>
                <EmptyState type='paquetes'/>
            </div>
      )}

            
          </article>
        </section>
      </div>



      <Notification
        message={messageNotification}
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
      />
    
    </main>
  );
};

export default Servicios;
