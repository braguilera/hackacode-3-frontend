import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Calendar, Clock, Plus, X } from 'lucide-react';
import { Listbox } from '@headlessui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import medicos from '../tests/medicos.json'
const Consultas = () => {
  const dataMedico = medicos;

  const [selectedMedico, setSelectedMedico] = useState(null);
  const [consultType, setConsultType] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [startDate, endDate] = dateRange;

  // Generar horarios basados en disponibilidad
  const generateTimeSlots = (medico) => {
    if (!medico) return [];
    
    return medico.disponibilidad.map(disp => {
      const start = new Date(`2000-01-01T${disp.horaInicio}`);
      const end = new Date(`2000-01-01T${disp.horaFin}`);
      const hours = [];
      
      while (start < end) {
        hours.push(start.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }));
        start.setMinutes(start.getMinutes() + 30);
      }
      
      return {
        day: disp.diaSemana,
        date: disp.diaSemana, // En realidad debería calcularse según el rango de fechas
        hours: hours
      };
    });
  };

  const timeSlots = selectedMedico ? generateTimeSlots(selectedMedico) : [];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 bg-white rounded-3xl shadow-sm max-w-4xl mx-auto"
    >
      {/* Selector de Médico */}
      <div className="mb-8">
        <Listbox value={selectedMedico} onChange={setSelectedMedico}>
          {({ open }) => (
            <>
              <Listbox.Label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar médico
              </Listbox.Label>
              <div className="relative">
                <Listbox.Button className="w-full bg-gray-50 rounded-lg p-4 pr-10 text-left border-2 border-gray-200 hover:border-blue-300 transition-colors">
                  {selectedMedico ? (
                    <MedicoOption dataMedico={selectedMedico} />
                  ) : (
                    <span className="text-gray-400">Seleccione un médico</span>
                  )}
                  <ChevronDown className={`absolute right-3 top-4 h-5 w-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                </Listbox.Button>
                
                <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg py-2 max-h-96 overflow-auto">
                  {dataMedico.medicos.map((medico) => (
                    <Listbox.Option
                      key={medico.id}
                      value={medico}
                      className={({ active }) => `p-3 cursor-pointer ${active ? 'bg-blue-50' : ''}`}
                    >
                      <MedicoOption dataMedico={medico} />
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </>
          )}
        </Listbox>
      </div>

      {/* Tipo de Consulta */}
      {selectedMedico && (
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de consulta
          </label>
          <select
            value={consultType}
            onChange={(e) => setConsultType(e.target.value)}
            className="w-full bg-gray-50 rounded-lg p-4 border-2 border-gray-200 hover:border-blue-300 transition-colors"
          >
            <option value="">Seleccione tipo de consulta</option>
            <option value="general">Consulta General</option>
            <option value="especialidad">Consulta de Especialidad</option>
            <option value="seguimiento">Seguimiento</option>
          </select>
        </motion.div>
      )}

      {/* Selector de Fechas */}
      {consultType && (
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="text-blue-500" />
            <span className="text-sm font-medium text-gray-700">
              Rango de fechas
            </span>
          </div>
          
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setDateRange(update)}
            className="w-full bg-gray-50 rounded-lg p-4 border-2 border-gray-200 hover:border-blue-300"
            placeholderText="Seleccione fecha inicial y final"
          />
        </motion.div>
      )}

      {/* Botón para ver turnos */}
      {startDate && endDate && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowTimeSlots(true)}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          Ver turnos disponibles
        </motion.button>
      )}

      {/* Modal de Turnos */}
      {showTimeSlots && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-xl"
          >
            {/* Header del Modal */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedMedico.nombre} {selectedMedico.apellido}
                </h3>
                <span className={`text-sm ${especialidadColors[selectedMedico.especialidades[0].nombre].badge} px-3 py-1 rounded-full`}>
                  {selectedMedico.especialidades[0].nombre}
                </span>
              </div>
              <button 
                onClick={() => setShowTimeSlots(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Listado de Turnos */}
            <div className="max-h-96 overflow-auto">
              {timeSlots.map((slot, index) => (
                <div key={index} className="border-b last:border-0 py-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="text-blue-500 h-4 w-4" />
                    <span className="font-medium">{slot.day}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {slot.hours.map((hour) => (
                      <motion.button
                        key={hour}
                        whileHover={{ scale: 1.05 }}
                        className="bg-gray-50 rounded-lg p-2 text-sm hover:bg-blue-50 transition-colors"
                      >
                        {hour}
                        <Plus className="h-4 w-4 ml-1 inline-block text-blue-500" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

// Componente para mostrar la opción del médico
const MedicoOption = ({ dataMedico }) => {
  const especialidad = dataMedico.especialidades[0].nombre;
  const colors = especialidadColors[especialidad] || {
    bgLight: 'bg-gray-100',
    textDark: 'text-gray-800',
    badge: 'bg-gray-50 text-gray-700'
  };

  return (
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colors.bgLight}`}>
        <span className={`font-medium ${colors.textDark}`}>
          {dataMedico.nombre.charAt(0)}{dataMedico.apellido.charAt(0)}
        </span>
      </div>
      <div>
        <div className="font-medium">
          {dataMedico.nombre} {dataMedico.apellido}
        </div>
        <span className={`text-sm ${colors.badge} px-2 py-1 rounded-full`}>
          {especialidad}
        </span>
      </div>
    </div>
  );
};

// Colores para especialidades
const especialidadColors = {
  'Cardiología': { 
    bgLight: 'bg-red-100',
    textDark: 'text-red-800',
    badge: 'bg-red-50 text-red-700' 
  },
  'Pediatría': { 
    bgLight: 'bg-blue-100',
    textDark: 'text-blue-800',
    badge: 'bg-blue-50 text-blue-700' 
  },
  'Neurología': { 
    bgLight: 'bg-purple-100',
    textDark: 'text-purple-800',
    badge: 'bg-purple-50 text-purple-700' 
  },
  'Dermatología': { 
    bgLight: 'bg-pink-100',
    textDark: 'text-pink-800',
    badge: 'bg-pink-50 text-pink-700' 
  },
  'Oftalmología': { 
    bgLight: 'bg-teal-100',
    textDark: 'text-teal-800',
    badge: 'bg-teal-50 text-teal-700' 
  }
};

export default Consultas;