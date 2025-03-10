import { motion } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getDatos } from '../api/crud';

const FormPersona = ({ tipo = 'paciente', onClose, onSubmit, initialData, isEditing = false }) => {

  const [especialidades, setEspecialidades] = useState([])
  const [hasInitialized, setHasInitialized] = useState(false);
  const [edadError, setEdadError] = useState('');

  /* Initial Data */

  const getNuevaDisponibilidad = () => {
    return {
      cubreTurno: "Mañana",
      horaInicio: "08:00:00", 
      horaFin: "12:00:00",
      diaSemana: "MONDAY"
    };
  }

  const [disponibilidades, setDisponibilidades] = useState(
    initialData?.disponibilidades || [getNuevaDisponibilidad()]
  );
  
  const getInitialData = (tipo) => {
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
      especialidadId: '',
      sueldo: null,
      disponibilidades: [getNuevaDisponibilidad()]
    } : {
      ...base,
      tieneObraSocial: false
    };
  }

  const [formData, setFormData] = useState(() => {
    const initial = initialData || getInitialData(tipo);
      return {
        ...initial,
        especialidadId: initialData?.especialidadId ? String(initialData.especialidadId) : ''
      };
  });

  /* Age Validation */

  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    
    const fechaMinima = new Date('1900-01-01');
    if (fechaNac < fechaMinima) return -1;
    
    if (fechaNac > hoy) return -1;
  
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    return edad;
  };
  
  /* handle data */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'especialidadId') {
      setFormData(prev => ({ ...prev, [name]: value }));
      return;
    }
  
    const newFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    };
  
    setFormData(newFormData);
  
    if (tipo === 'medico' && name === 'fechaNac') {
      const edad = calcularEdad(value);
      
      if (edad === -1) {
        setEdadError('Fecha de nacimiento inválida');
      } else if (edad < 18) {
        setEdadError('El médico debe ser mayor de edad (18+ años)');
      } else if (edad > 100) {
        setEdadError('La edad máxima permitida es 100 años');
      } else {
        setEdadError('');
      }
    }
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

  
  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const data = await getDatos('/api/especialidades', 'Error cargando especialidades');
        setEspecialidades(data);
        
        if (initialData?.especialidadId && !hasInitialized) {
          setFormData(prev => ({
            ...prev,
            especialidadId: String(initialData.especialidadId)
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
  
    if (tipo === 'medico') {
      if (!formData.fechaNac) {
        setEdadError('La fecha de nacimiento es requerida');
        return;
      }
      
      const edad = calcularEdad(formData.fechaNac);
      
      if (edad === -1) {
        setEdadError('Fecha de nacimiento inválida');
        return;
      }
      
      if (edad < 18 || edad > 100) {
        setEdadError(edad < 18 
          ? 'El médico debe ser mayor de edad (18+ años)' 
          : 'La edad máxima permitida es 100 años');
        return;
      }
    }
  
    const dataToSend = {
      ...formData,
      sueldo: Number(formData.sueldo),
      especialidadId: Number(formData.especialidadId),
      disponibilidades: disponibilidades.map(disp => ({
        cubreTurno: disp.cubreTurno,
        diaSemana: disp.diaSemana,
        horaInicio: disp.horaInicio.includes(':') ? `${disp.horaInicio}` : disp.horaInicio,
        horaFin: disp.horaFin.includes(':') ? `${disp.horaFin}` : disp.horaFin
      }))
    };
  
    delete dataToSend.especialidad;
    
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
      <header className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {isEditing ? 'Editar' : 'Crear nuevo'} {tipo}
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Complete los campos para {isEditing ? 'actualizar' : 'registrar'} {tipo === 'paciente' ? 'al paciente' : 'al médico'}
        </p>
      </header>
  
      <form onSubmit={handleSubmit} className="space-y-4">
        <main className={`grid ${tipo==="medico" ? "grid-cols-2" : "grid-cols-1"} gap-6`}>
          {/*  Left Column - Personal Data (Pacient and Medic) */}
          <section className="space-y-4">
            <article className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  maxLength={20}
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
                  maxLength={20}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  required
                />
              </div>
            </article>
  
            <article>
              <label className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                maxLength={20}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                required
              />
            </article>
  
            <article className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  maxLength={50}
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
                  maxLength={20}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  required
                />
              </div>
            </article>
  
            <article className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                <input
                  type="date"
                  name="fechaNac"
                  value={formData.fechaNac}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    edadError ? 'border-red-500' : 'border-gray-200'
                  } focus:ring-2 ${
                    edadError ? 'focus:ring-red-100' : 'focus:ring-blue-100'
                  } transition-all duration-200`}
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
                {edadError && (
                  <p className="mt-1 text-sm text-red-600">{edadError}</p>
                )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    maxLength={50}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                    required
                  />
                </div>
            </article>

            {/* Data only Pacient */}
            {tipo === 'paciente' && (
              <article className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
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
              </article>
            )}
  
            {/* Data only Medic */}
            {tipo === 'medico' && (
              <article>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sueldo</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="sueldo"
                    value={formData.sueldo}
                    onChange={handleChange}
                    maxLength={20}
                    className="w-full pl-7 pr-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                    placeholder='0'
                    required
                  />
                </div>
              </article>
            )}

          </section>

          {/* Rigth Column - Specialities and availability (Data only Medic)*/}
          {tipo === 'medico' && (
            <section className="space-y-4">
              {/* Especialidades */}
              <header className="bg-gray-50 p-4 rounded-xl">
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
              </header>
                
              {/* Disponibilidades */}
              <main className="bg-gray-50 p-4 rounded-xl h-80 overflow-hidden">
                <header className="flex justify-between items-center mb-3">
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
                </header>
  
                <section className="space-y-3 max-h-[280px] overflow-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-50 pr-2 pb-6">
                  {disponibilidades.map((disp, index) => (
                    <motion.article
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      key={index}
                      className="bg-white p-3 rounded-lg relative group shadow-sm border border-gray-100"
                    >
                      <section className="space-y-3">
                        <header>
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
                        </header>
                            
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
  
                        <footer className="grid grid-cols-2 gap-3">
                          <article>
                            <label className="block text-xs text-gray-600 mb-1">Inicio</label>
                            <input
                              type="time"
                              value={disp.horaInicio}
                              onChange={(e) => handleDisponibilidadChange(index, 'horaInicio', e.target.value)}
                              className="w-full px-2 py-1.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                          </article>
  
                          <article>
                            <label className="block text-xs text-gray-600 mb-1">Fin</label>
                            <input
                              type="time"
                              value={disp.horaFin}
                              onChange={(e) => handleDisponibilidadChange(index, 'horaFin', e.target.value)}
                              className="w-full px-2 py-1.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                          </article>
                        </footer>
                      </section>
                      
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

                    </motion.article>
                  ))}
                </section>
              </main>
            </section>
          )}
        </main>
  
        {/* Action Buttons */}
        <aside className="flex justify-end gap-3 pt-2">
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
        </aside>
      </form>
    </motion.div>
  );
};

export default FormPersona;