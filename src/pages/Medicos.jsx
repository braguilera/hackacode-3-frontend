import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, Plus, X, ArrowRight, Stethoscope, Award, Calendar, HeartPulse, Wrench, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CardMedico from '../components/CardMedico';
import FormPersona from '../components/FormPersona';
import { deleteDatos, getDatos, postDatos, putDatos } from '../api/crud';

const Medicos = () => {
  const [medicos, setMedicos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEspecialidadForm, setShowEspecialidadForm] = useState(false);
  const [medicoToEdit, setMedicoToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [especialidadData, setEspecialidadData] = useState({
    nombre: ''
  });

  // Fetch functions
  const fetchMedicos = async () => {
    try {
      const data = await getDatos('/api/medicos', 'Error cargando medicos');
      setMedicos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEspecialidades = async () => {
    try {
      const data = await getDatos('/api/especialidades', 'Error cargando especialidades');
      setEspecialidades(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicos();
    fetchEspecialidades();
  }, []);

  // Existing handlers
  const deleteMedic = async (e) => {
    try {
      await deleteDatos(`/api/medicos/${e.id}`, 'Error eliminando paciente');
      await fetchMedicos();
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };

  const handleEditPaciente = (medico) => {
    setMedicoToEdit(medico);
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
      setShowForm(false);
    } catch (error) {
      console.error(error.message);
      throw error;
    } finally {
      setMedicoToEdit(null);
    }
  };

  // Filter médicos based on search
  const medicosFiltrados = medicos.filter(medico =>
    medico.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medico.apellido?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className='w-full h-full flex flex-col gap-6 p-6'>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-50 pr-2">
            {medicosFiltrados.map(medico => (
              <CardMedico 
                dataMedico={medico} 
                key={medico.id} 
                onEdit={handleEditPaciente} 
                onDelete={deleteMedic}
              />
            ))}
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

            {/* Especialidades List */}
            {especialidades.map((especialidad) => (
              <motion.div
                key={especialidad.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{especialidad.nombre}</h3>
                    
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded-full">
                    <X size={16} className="text-gray-400" />
                  </button>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">0</span> médicos asignados
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
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
