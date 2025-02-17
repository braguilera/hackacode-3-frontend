import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, Plus, X, ArrowRight, Stethoscope, Award, Calendar, HeartPulse, Wrench, Star, User, DollarSign, Edit2, Trash, Trash2, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CardMedico from '../components/CardMedico';
import FormPersona from '../components/FormPersona';
import { deleteDatos, getDatos, postDatos, putDatos } from '../api/crud';
import LoadingIndicator from '../components/LoadingIndicator';
import PopUpConfirmation from '../components/PopUpConfirmation';

const Medicos = () => {
  const [medicos, setMedicos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loadingMedico, setLoadingMedico] = useState(false);
  const [loadingEspecialidad, setLoadingEspecialidad] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEspecialidadForm, setShowEspecialidadForm] = useState(false);
  const [medicoToEdit, setMedicoToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedicoToDelete, setSelectedMedicoToDelete] = useState(null);
  const [especialidadData, setEspecialidadData] = useState({
    nombre: ''
  });
  const [medicosPorEspecialidad, setMedicosPorEspecialidad] = useState({});
  const [editingEspecialidadData, setEditingEspecialidadData] = useState({ nombre: '' });
  const [editingEspecialidad, setEditingEspecialidad] = useState(null);

  // Fetch functions
  const fetchMedicos = async () => {
    setLoadingMedico(true)
    try {
      const data = await getDatos('/api/medicos', 'Error cargando medicos');
      setMedicos(data);
    } catch (err) {
      setError(err.message);
    }finally {
      setTimeout(() => {
        setLoadingMedico(false);
      }, 1000);
    }
  };

  const fetchEspecialidades = async () => {
    try {
      const data = await getDatos('/api/especialidades', 'Error cargando especialidades');
      setEspecialidades(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingEspecialidad(false);
    }
  };

  useEffect(() => {
    fetchMedicos();
    fetchEspecialidades();
  }, []);

  useEffect(() => {
    const cargarCantidadMedicos = async () => {
      const counts = {};
      for (const especialidad of especialidades) {
        counts[especialidad.id] = await lengthMedicsPerSpeciality(especialidad.id);
      }
      setMedicosPorEspecialidad(counts);
    };
  
    cargarCantidadMedicos();
  }, [especialidades]);

  const handleDeleteMedic = async (medicoId) => {
    try {
      await deleteDatos(`/api/medicos/${medicoId}`, 'Error eliminando médico');
      await fetchMedicos();
      await fetchEspecialidades();
    } catch (error) {
      throw error;
    }
    finally{
      setSelectedMedicoToDelete(null);
    }
  };

  const handleEditPaciente = (medico) => {
    setMedicoToEdit({
      ...medico,
      especialidadId: medico.especialidad?.id || ''
    });
    setShowForm(true);
  };

  const handleSubmitMedico = async (medicoData) => {
    try {
      if (medicoToEdit) {
        await putDatos(`/api/medicos/${medicoToEdit.id}`, medicoData, 'Error actualizando medico');
      } else {
        await postDatos('/api/medicos', medicoData, 'Error creando médico');
      }
      await fetchMedicos();
      await fetchEspecialidades();
      
    } catch (error) {
      throw error;
    } finally {
      setShowForm(false);
      setMedicoToEdit(null);
      setSelectedMedicoToDelete(null);
    }
  };

  const submitEspecialidad = async (e) => {
    e.preventDefault();
  
    const nombre = editingEspecialidad 
      ? editingEspecialidadData.nombre.trim() 
      : especialidadData.nombre.trim();
  
    if (!nombre) {
      setError('El nombre de la especialidad es requerido');
      return;
    }
  
    try {
      if (editingEspecialidad) {
        console.log('Ejecutando PUT con:', {
          id: editingEspecialidad.id,
          editingEspecialidadData: editingEspecialidadData
        });
        
        await putDatos(
          `/api/especialidades/${editingEspecialidad.id}`, editingEspecialidadData, 'Error actualizando especialidad'
        );
      } else {
        await postDatos(
          '/api/especialidades', especialidadData, 'Error creando especialidad'
        );
      }
      
      await fetchEspecialidades();
      
    } catch (error) {
      console.error('Error completo:', error.response?.data || error.message);
      setError(error.message);
    } finally {
      console.log("finally")
      setEditingEspecialidad(null);
      setEspecialidadData({ nombre: '' });
      setEditingEspecialidadData({ nombre: '' });
      setShowEspecialidadForm(false);
    }
  };

  const editEspecialidad = (especialidad) => {
    setEditingEspecialidad(especialidad);
    setEditingEspecialidadData({ nombre: especialidad.nombre });
  };

  const deleteEspecialidad = async (especialidadId) =>{
    console.log(especialidadId)
    try {
      await deleteDatos(`/api/especialidades/${especialidadId.id}`, 'Error eliminando especialidad');
      await fetchMedicos();
      await fetchEspecialidades();
    } catch (error) {
      throw error;
    }
    finally{
      setSelectedMedicoToDelete(null);
    }
  }

  const lengthMedicsPerSpeciality = async (especialidadId) => {
    try {
      const data = await getDatos(`/api/medicos?especialidadId=${especialidadId}`, 'Error cargando especialidades');
      return data.length;
    } catch (err) {
      setError(err.message);
      return 0;
    }
  };

  const medicosFiltrados = medicos.filter(medico =>
    medico.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medico.apellido?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className='w-full h-full flex flex-col gap-6 p-6'>


      {selectedMedicoToDelete && (
        <div className="w-full fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <PopUpConfirmation 
            isOpen={!!selectedMedicoToDelete}
            onConfirm={() => handleDeleteMedic(selectedMedicoToDelete.id)}
            onCancel={() => setSelectedMedicoToDelete(null)}
            itemId={selectedMedicoToDelete.id}
            isDelete={true}
          />
        </div>
      )}
      
    
    
      {/* Main Content */}
      <div className='flex gap-6 h-full'>
        {/* Médicos Section */}
        <section className='flex-1 flex flex-col h-full  pl-6 '>
          <header className='flex items-center justify-between mb-6'>
            <div>
              <h2 className='text-2xl font-bold text-gray-800'>
                Personal Médico
                <span className='text-gray-400 font-normal ml-2 text-lg'>({medicos.length} registrados)</span>
              </h2>
              <p className='text-gray-500 mt-1'>Gestiona el equipo médico y sus especialidades</p>
            </div>
            <button 
              onClick={() => {
                setMedicoToEdit(null);
                setShowForm(true);
              }}
              className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Agregar Médico</span>
            </button>
          </header>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Buscar médicos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
              
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {loadingMedico ? (
              Array.from({ length: 16 }).map((_, index) => (
                <motion.article
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                  className="w-full bg-white rounded-xl shadow-sm overflow-hidden relative"
                >
                  <header className="p-4 flex items-start gap-4">


                    <div className="flex-1 space-y-3">
                      <LoadingIndicator height="h-6" />
                      

                      <LoadingIndicator height="h-6" width="w-52" />
                    </div>
                  </header>

                  <div className="grid grid-cols-2 divide-x border-t">
                    <div className="p-4 flex items-center gap-2">
                      <User size={18} className="text-gray-300" />
                      <div className="space-y-2">
                        <LoadingIndicator height="h-4" width="w-16" />
                        <LoadingIndicator height="h-5" width="w-8" />
                      </div>
                    </div>
                    
                    <div className="p-4 flex items-center gap-2">
                      <DollarSign size={18} className="text-gray-300" />
                      <div className="space-y-2">
                        <LoadingIndicator height="h-4" width="w-16" />
                        <LoadingIndicator height="h-5" width="w-20" />
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))
            ) : (
              medicosFiltrados.map(medico => (
        <CardMedico 
          key={medico.id}
          dataMedico={medico} 
          onEdit={handleEditPaciente}
          onDelete={() => setSelectedMedicoToDelete(medico)} 
        />
              ))
            )}
          
          </div>
        </section>

        {/* Especialidades Section */}
        <section className='w-96 min-w-96 flex flex-col h-full pl-6 border-l border-gray-200'>
          <header className='mb-6'>
            <h2 className='text-2xl font-bold text-gray-800'>
              Especialidades
              <span className='text-gray-400 font-normal ml-2 text-lg'>({especialidades.length})</span>
            </h2>
            <p className='text-gray-500 mt-1'>Gestiona las especialidades disponibles</p>
          </header>

          <div className='flex flex-col gap-4 h-full overflow-y-auto pr-2'>
            {/* Add Especialidad Button/Form */}
            <AnimatePresence mode="wait">
              {showEspecialidadForm ? (
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  onSubmit={submitEspecialidad}
                  className="flex flex-col bg-white rounded-lg border border-gray-200 p-4 relative gap-4"
                >
                  <header className="w-full flex items-center gap-2 bg-white">
                    <aside className="p-2 bg-blue-100 rounded-lg">
                      <Star  size={20} className="text-blue-600" />
                    </aside>
                    <input
                      type="text"
                      placeholder="Nombre de la especialidad"
                      className="flex-1 text-lg w-full font-semibold text-gray-800 bg-transparent border-0 focus:ring-0 outline-none placeholder:text-gray-400"
                      required
                      maxLength={50}
                      value={especialidadData.nombre}
                      onChange={(e) => setEspecialidadData(prev => ({ ...prev, nombre: e.target.value }))}
                    />
                    <button
                      type="button"
                      onClick={() => setShowEspecialidadForm(false)}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <X size={16} />
                    </button>
                  </header>
                  <button
                    type="submit"
                    disabled={!especialidadData.nombre.trim()}
                    className="w-full justify-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <span>Guardar Especialidad</span>
                    <ArrowRight size={18} />
                  </button>
                </motion.form>
              ) : (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  onClick={() => setShowEspecialidadForm(true)}
                  className="flex h-24 items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 group transition-all"
                >
                  <Plus size={24} className="text-gray-400 group-hover:text-blue-500" />
                </motion.button>
              )}
            </AnimatePresence>

            {especialidades.map((especialidad) => (
              <AnimatePresence mode="wait" key={especialidad.id}>
                {editingEspecialidad?.id === especialidad.id ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10"
                  >
                    <motion.form
                      onSubmit={submitEspecialidad}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col bg-white rounded-lg border border-gray-200 p-4 relative gap-4 shadow-lg"
                    >
                      <header className="w-full flex items-center gap-2 bg-white">
                        <aside className="p-2 bg-blue-100 rounded-lg">
                          <Star size={20} className="text-blue-600" />
                        </aside>
                        <input
                          type="text"
                          placeholder="Nombre de la especialidad"
                          className="flex-1 text-lg w-full font-semibold text-gray-800 bg-transparent border-0 focus:ring-0 outline-none placeholder:text-gray-400"
                          required
                          maxLength={50}
                          value={editingEspecialidadData.nombre}
                          onChange={(e) => setEditingEspecialidadData(prev => ({ ...prev, nombre: e.target.value }))}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setEditingEspecialidad(null);
                            setEspecialidadData({ nombre: '' });
                          }}
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          <X size={16} />
                        </button>
                      </header>
                      
                        <button
                          type="submit"
                          className="w-full justify-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                          {editingEspecialidad ? 'Actualizar Especialidad' : 'Guardar'}
                          <ArrowRight size={18} />
                        </button>
                      
                    </motion.form>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ y: -5 }}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md shadow-sm transition-shadow group"
                  >
                    <div className="flex items-start justify-between relative">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {loadingMedico ? (
                            <LoadingIndicator width={'w-32'} height={'h-4'}/>
                          ) : (
                            especialidad.nombre
                          )}
                        </h3>
                      </div>
                      <aside className="absolute top-0 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="p-1.5 rounded-full bg-white hover:bg-gray-50 text-gray-600 shadow-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            editEspecialidad(especialidad);
                          }}
                        >
                          <Edit3 size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="p-1.5 rounded-full bg-white hover:bg-red-50 text-gray-600 hover:text-red-500 shadow-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteEspecialidad(especialidad);
                          }}
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </aside>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-500">
                        {loadingMedico ? (
                          <LoadingIndicator width={'w-40'} height={'h-4'}/>
                        ) : (
                          <span className="font-medium">
                            {medicosPorEspecialidad[especialidad.id] || 0}
                            {medicosPorEspecialidad[especialidad.id] > 1 ||
                            medicosPorEspecialidad[especialidad.id] === 0
                              ? ' médicos asignados'
                              : ' médico asignado'}
                          </span>
                        )}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </div>
        </section>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="w-full fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <FormPersona
            tipo="medico"
            onClose={() => {
              setMedicoToEdit(null);
              setShowForm(false);
            }}
            onSubmit={handleSubmitMedico}
            initialData={medicoToEdit}
            isEditing={!!medicoToEdit}
          />
        </div>
      )}
    </main>
  );
};

export default Medicos;
