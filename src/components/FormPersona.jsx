import { motion } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getDatos } from '../api/crud';

const FormPersona = ({ 
    tipo = 'paciente', 
    onClose, 
    onSubmit, 
    initialData, 
    isEditing = false 
  }) => {
    const [formData, setFormData] = useState(() => {
      const initial = initialData || getInitialData(tipo);
      
      return {
        ...initial,
        especialidadId: initialData?.especialidadId 
          ? String(initialData.especialidadId) 
          : ''
      };
    });
    
  const [especialidades, setEspecialidades] = useState([])
  const [hasInitialized, setHasInitialized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setErrorEspecialidades] = useState(null);
  const [disponibilidades, setDisponibilidades] = useState(
    initialData?.disponibilidades || [getNuevaDisponibilidad()]
  );

  function getInitialData(tipo) {
    const base = {
      nombre: '',
      apellido: '',
      dni: '',
      fechaNac: '',
      email: '',
      telefono: '',
      direccion: ''
    };

    return tipo === 'medico' ? {
      ...base,
      especialidadesIDs: '',
      sueldo: 0,
      disponibilidades: [getNuevaDisponibilidad()]
    } : {
      ...base,
      tieneObraSocial: false
    };
  }

  function getNuevaDisponibilidad() {
    return {
      cubreTurno: "Mañana", // Cambiar a español
      horaInicio: "08:00:00", // Agregar segundos
      horaFin: "12:00:00", // Agregar segundos
      diaSemana: "MONDAY"
    };
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Manejar especialidadId como string
    if (name === 'especialidadId') {
      setFormData(prev => ({ ...prev, [name]: value }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDisponibilidadChange = (index, field, value) => {
    const updated = [...disponibilidades];
    updated[index][field] = value;
    setDisponibilidades(updated);
  };

  const addDisponibilidad = () => {
    setDisponibilidades([...disponibilidades, getNuevaDisponibilidad()]);
  };

  const removeDisponibilidad = (index) => {
    setDisponibilidades(disponibilidades.filter((_, i) => i !== index));
  };

  


  // 1. Cargar especialidades primero
  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const data = await getDatos('/api/especialidades', 'Error cargando especialidades');
        setEspecialidades(data);
        
        // Sincronización solo si hay datos iniciales y no se ha inicializado
        if (initialData && !hasInitialized) {
          // 3. Obtener IDs de dos fuentes posibles (especialidades o especialidadesIDs)
          const initialIds = initialData.especialidades
            ? initialData.especialidades.map(e => String(e.id))
            : initialData.especialidadesIDs?.map(String) || [];

          // 4. Filtrar solo IDs válidos existentes
          const validIds = data.filter(e => 
            initialIds.includes(String(e.id))
          ).map(e => String(e.id));

          setFormData(prev => ({
            ...prev,
            especialidadesIDs: validIds
          }));
          setHasInitialized(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchEspecialidades();
  }, [initialData, hasInitialized]);

// En handleSubmit
const handleSubmit = (e) => {
  e.preventDefault();
  
  const dataToSend = {
    ...formData,
    especialidadId: Number(formData.especialidadId),
    disponibilidades: disponibilidades.map(disp => ({
      ...disp,
      horaInicio: `${disp.horaInicio}:00`, // Formato HH:mm:ss
      horaFin: `${disp.horaFin}:00`       // Formato HH:mm:ss
    }))
  };

  onSubmit(dataToSend);
};


  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-3xl p-6 h-auto w-full ${tipo==="medico" ? "max-w-5xl" : "max-w-3xl" } relative shadow-lg border border-gray-100`}
    >
      {/* Close Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={18} />
      </motion.button>
  
      {/* Title */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {isEditing ? 'Editar' : 'Crear nuevo'} {tipo}
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Complete los campos para {isEditing ? 'actualizar' : 'registrar'} {tipo === 'paciente' ? 'al paciente' : 'al médico'}
        </p>
      </div>
  
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={`grid ${tipo==="medico" ? "grid-cols-2" : "grid-cols-1"} gap-6`}>
          {/* Columna izquierda - Datos personales */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  required
                />
              </div>
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                required
              />
            </div>
  
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  required
                />
              </div>
            </div>
  
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                <input
                  type="date"
                  name="fechaNac"
                  value={formData.fechaNac}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  required
                />
              </div>
            </div>
  
            {tipo === 'medico' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sueldo</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="sueldo"
                    value={formData.sueldo}
                    onChange={handleChange}
                    className="w-full pl-7 pr-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                    min="0"
                    required
                  />
                </div>
              </div>
            )}
  
            {tipo === 'paciente' && (
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <input
                  type="checkbox"
                  name="tieneObraSocial"
                  checked={formData.tieneObraSocial}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label className="text-sm font-medium text-gray-700">
                  Tiene Obra Social
                </label>
              </div>
            )}
          </div>
  
          {/* Columna derecha - Especialidades y Disponibilidades */}
          {tipo === 'medico' && (
            <div className="space-y-4">
              {/* Especialidades */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Especialidad</h3>
                <select
                  name="especialidadId"
                  value={formData.especialidadId}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                >
                  <option value="">Seleccionar especialidad</option>
                  {especialidades.map(especialidad => (
                    <option
                      key={especialidad.id}
                      value={String(especialidad.id)}
                    >
                      {especialidad.nombre}
                    </option>
                  ))}
                </select>
              </div>
                
              {/* Disponibilidades */}
              <div className="bg-gray-50 p-4 rounded-xl h-80 overflow-hidden">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-semibold text-gray-800">Disponibilidades</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={addDisponibilidad}
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Plus size={14} /> Agregar
                  </motion.button>
                </div>
  
                <div className="space-y-3 max-h-[280px] overflow-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-50 pr-2 pb-6">
                  {disponibilidades.map((disp, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      key={index}
                      className="bg-white p-3 rounded-lg relative group shadow-sm border border-gray-100"
                    >
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Día</label>
                          <select
                            value={disp.diaSemana}
                            onChange={(e) => handleDisponibilidadChange(index, 'diaSemana', e.target.value)}
                            className="w-full px-2 py-1.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          >
                            <option value="MONDAY">Lunes</option>
                            <option value="TUESDAY">Martes</option>
                            <option value="WEDNESDAY">Miércoles</option>
                            <option value="THURSDAY">Jueves</option>
                            <option value="FRIDAY">Viernes</option>
                            <option value="SATURDAY">Sábado</option>
                            <option value="SUNDAY">Domingo</option>
                          </select>
                                                  </div>
                            
                                                  <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Turno</label>
                                                    <select
                            value={disp.cubreTurno}
                            onChange={(e) => handleDisponibilidadChange(index, 'cubreTurno', e.target.value)}
                            className="w-full px-2 py-1.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          >
                            <option value="Mañana">Mañana</option>
                            <option value="Tarde">Tarde</option>
                          </select>
                        </div>
  
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Inicio</label>
                            <input
                              type="time"
                              value={disp.horaInicio}
                              onChange={(e) => handleDisponibilidadChange(index, 'horaInicio', e.target.value)}
                              className="w-full px-2 py-1.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                          </div>
  
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Fin</label>
                            <input
                              type="time"
                              value={disp.horaFin}
                              onChange={(e) => handleDisponibilidadChange(index, 'horaFin', e.target.value)}
                              className="w-full px-2 py-1.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {(disponibilidades.length > 1) &&
                        <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => removeDisponibilidad(index)}
                        className="absolute right-1 top-1 p-1 bg-white rounded-full text-red-500 hover:text-red-600 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        <Trash2 size={14} />
                      </motion.button>
                      }

                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
  
        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Cancelar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            {initialData ? 'Actualizar' : 'Crear'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default FormPersona;