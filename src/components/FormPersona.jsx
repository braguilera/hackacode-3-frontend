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
      // 1. Corregir inicialización de especialidadesIDs
      const initial = initialData || getInitialData(tipo);
      
      return {
        ...initial,
        especialidadesIDs: initialData?.especialidades 
          ? initialData.especialidades.map(e => String(e.id)) 
          : initial.especialidadesIDs?.map(String) || []
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
      especialidadesIDs: [],
      sueldo: 0,
      disponibilidades: [getNuevaDisponibilidad()]
    } : {
      ...base,
      tieneObraSocial: false
    };
  }

  function getNuevaDisponibilidad() {
    return {
      cubreTurno: 'MAÑANA',
      horaInicio: '08:00',
      horaFin: '12:00',
      diaSemana: 'MONDAY'
    };
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const dataToSend = {
      ...formData,
      // Convertir a números para el backend
      especialidadesIDs: formData.especialidadesIDs.map(Number)
    };

    onSubmit(dataToSend);
  };


  return (
<motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-3xl p-8 w-full max-w-3xl relative shadow-lg border border-gray-100"
    >
      {/* Close Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={20} />
      </motion.button>

      {/* Title */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditing ? 'Editar' : 'Crear nuevo'} {tipo}
        </h2>
        <p className="text-gray-500 mt-1">
          Complete los campos para {isEditing ? 'actualizar' : 'registrar'} {tipo === 'paciente' ? 'al paciente' : 'al médico'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information Section */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
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
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
              <input
                type="date"
                name="fechaNac"
                value={formData.fechaNac}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
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
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
              required
            />
          </div>

          {tipo === 'paciente' && (
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
              <input
                type="checkbox"
                name="tieneObraSocial"
                checked={formData.tieneObraSocial}
                onChange={handleChange}
                className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label className="text-sm font-medium text-gray-700">
                Tiene Obra Social
              </label>
            </div>
          )}
        </div>

        {/* Doctor Specific Fields */}
        {tipo === 'medico' && (
          <div className="space-y-6 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sueldo</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  name="sueldo"
                  value={formData.sueldo}
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Especialidades</label>
              <select
                multiple
                name="especialidadesIDs"
                value={formData.especialidadesIDs}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, opt => opt.value);
                  setFormData(prev => ({ ...prev, especialidadesIDs: selected }));
                }}
                className="w-full border border-gray-200 rounded-xl p-3 h-32 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {especialidades.map(especialidad => (
                  <option
                    key={especialidad.id}
                    value={String(especialidad.id)}
                    className="p-2 hover:bg-blue-50"
                  >
                    {especialidad.nombre}
                  </option>
                ))}
              </select>

              <div className="mt-3 flex flex-wrap gap-2">
                {formData.especialidadesIDs.map(id => {
                  const especialidad = especialidades.find(e => String(e.id) === id);
                  return (
                    <span
                      key={id}
                      className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {especialidad?.nombre || 'Especialidad eliminada'}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Disponibilidades Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-700">Disponibilidades</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={addDisponibilidad}
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Plus size={16} /> Agregar
                </motion.button>
              </div>

              <div className="space-y-4">
                {disponibilidades.map((disp, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    key={index}
                    className="grid grid-cols-4 gap-4 items-end bg-gray-50 p-4 rounded-xl relative group"
                  >
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Día</label>
                      <select
                        value={disp.diaSemana}
                        onChange={(e) => handleDisponibilidadChange(index, 'diaSemana', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        {['MONDAY', 'WEDNESDAY', 'SATURDAY', 'THURSDAY', 'TUESDAY', 'FRIDAY', 'SUNDAY'].map(dia => (
                          <option key={dia} value={dia}>{dia}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Turno</label>
                      <select
                        value={disp.cubreTurno}
                        onChange={(e) => handleDisponibilidadChange(index, 'cubreTurno', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="MAÑANA">Mañana</option>
                        <option value="TARDE">Tarde</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Inicio</label>
                      <input
                        type="time"
                        value={disp.horaInicio}
                        onChange={(e) => handleDisponibilidadChange(index, 'horaInicio', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div className="relative">
                      <label className="block text-xs text-gray-600 mb-1">Fin</label>
                      <input
                        type="time"
                        value={disp.horaFin}
                        onChange={(e) => handleDisponibilidadChange(index, 'horaFin', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => removeDisponibilidad(index)}
                        className="absolute -right-2 -top-2 p-1.5 bg-white rounded-full text-red-500 hover:text-red-600 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
          >
            Cancelar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
          >
            {initialData ? 'Actualizar' : 'Crear'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default FormPersona;