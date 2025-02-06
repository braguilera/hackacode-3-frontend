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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 w-full max-w-2xl relative shadow-lg"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"
      >
        <X size={24} className="text-gray-600" />
      </button>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditing ? 'Editar' : 'Crear nuevo'} {tipo}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campos comunes */}
        <div className="grid grid-cols-2 gap-4">
          {['nombre', 'apellido', 'dni', 'email', 'telefono'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 capitalize">
                {field}
              </label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              name="fechaNac"
              value={formData.fechaNac}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Dirección
            </label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {tipo === 'paciente' && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="tieneObraSocial"
                checked={formData.tieneObraSocial}
                onChange={handleChange}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Tiene Obra Social
              </label>
            </div>
          )}
        </div>

        {/* Campos específicos para médicos */}
        {tipo === 'medico' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sueldo
              </label>
              <input
                type="number"
                name="sueldo"
                value={formData.sueldo}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0"
                required
              />
            </div>

            <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Especialidades
      </label>
      <select
  multiple
  name="especialidadesIDs"
  value={formData.especialidadesIDs}
  onChange={(e) => {
    const selected = Array.from(e.target.selectedOptions, opt => opt.value);
    setFormData(prev => ({
      ...prev,
      // Mantener como strings hasta el envío
      especialidadesIDs: selected 
    }));
  }}
  className="w-full border rounded-lg p-2 h-32"
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

<div className="mt-2 text-sm text-gray-600">
  {formData.especialidadesIDs.length > 0 ? (
    <>
      Seleccionadas:{" "}
      {formData.especialidadesIDs.map(id => {
        const especialidad = especialidades.find(e => String(e.id) === id);
        return (
          <span 
            key={id} 
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-1"
          >
            {especialidad?.nombre || 'Especialidad eliminada'}
          </span>
        );
      })}
    </>
  ) : (
    <span className="text-red-500">Debe seleccionar al menos una especialidad</span>
  )}
</div>
    </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-700">
                  Disponibilidades
                </h3>
                <button
                  type="button"
                  onClick={addDisponibilidad}
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                >
                  <Plus size={16} /> Agregar
                </button>
              </div>

              {disponibilidades.map((disp, index) => (
                <div key={index} className="grid grid-cols-4 gap-2 items-end">
                  <div>
                    <label className="block text-xs text-gray-600">Día</label>
                    <select
                      value={disp.diaSemana}
                      onChange={(e) => handleDisponibilidadChange(index, 'diaSemana', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {['MONDAY', 'WEDNESDAY', 'SATURDAY', 'THURSDAY', 'TUESDAY', 'FRIDAY', 'SUNDAY'].map(dia => (
                        <option key={dia} value={dia}>{dia}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600">Turno</label>
                    <select
                      value={disp.cubreTurno}
                      onChange={(e) => handleDisponibilidadChange(index, 'cubreTurno', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="MAÑANA">Mañana</option>
                      <option value="TARDE">Tarde</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600">Inicio</label>
                    <input
                      type="time"
                      value={disp.horaInicio}
                      onChange={(e) => handleDisponibilidadChange(index, 'horaInicio', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600">Fin</label>
                      <input
                        type="time"
                        value={disp.horaFin}
                        onChange={(e) => handleDisponibilidadChange(index, 'horaFin', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDisponibilidad(index)}
                      className="text-red-500 hover:text-red-600 pb-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {initialData ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default FormPersona;