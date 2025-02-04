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

// Función para generar los turnos con fechas específicas
const generateTimeSlots = (medico, start, end) => {
  if (!medico || !start || !end) return [];
  
  const dates = [];
  const currentDate = new Date(start);
  
  // Generar todas las fechas en el rango
  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return medico.disponibilidad.flatMap(disp => {
    return dates
      .filter(date => {
        const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });
        return dayName.toLowerCase() === disp.diaSemana.toLowerCase();
      })
      .map(date => {
        const startTime = new Date(date);
        const [hours, minutes] = disp.horaInicio.split(':');
        startTime.setHours(hours, minutes);
        
        const endTime = new Date(date);
        const [endHours, endMinutes] = disp.horaFin.split(':');
        endTime.setHours(endHours, endMinutes);
        
        const hoursSlots = [];
        let currentTime = startTime;
        
        while (currentTime < endTime) {
          hoursSlots.push(
            currentTime.toLocaleTimeString('es-AR', { 
              hour: '2-digit', 
              minute: '2-digit'
            })
          );
          currentTime = new Date(currentTime.getTime() + 30 * 60000); // +30 minutos
        }
        
        return {
          date: date.toLocaleDateString('es-AR'),
          day: date.toLocaleDateString('es-ES', { weekday: 'long' }),
          hours: hoursSlots
        };
      });
  });
};

// Actualizar el uso de la función
const timeSlots = selectedMedico 
  ? generateTimeSlots(selectedMedico, startDate, endDate)
  : [];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-5/6 h-1/2 self-center p-6 bg-white rounded-3xl shadow-sm max-w-4xl mx-auto"
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
                
                <Listbox.Options className="absolute z-10 mt-1 w-full scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-50 bg-white shadow-lg rounded-lg py-2 max-h-96 overflow-auto">
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
            className="w-full bg-gray-50 rounded-lg p-4 border-2 border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
          >
            <option value="" className='cursor-pointer'>Seleccione tipo de consulta</option>
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
          className="mb-8 flex w-full items-center justify-between"
        >
          <div className="flex flex-col  items-start  gap-2 mb-4">
            <div className="flex justify-center items-center text-sm font-medium text-gray-700">
              <Calendar className="text-blue-500" />
              <p>Rango de fechas</p>
            </div>
            <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setDateRange(update)}
            className="w-full bg-gray-50 rounded-lg p-4 border-2 border-gray-200 hover:border-blue-300 cursor-pointer"
            placeholderText="Seleccione fecha inicial y final"
          />
          </div>

          {/* Botón para ver turnos */}
          {startDate && endDate && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowTimeSlots(true)}
              className="w-1/2 self-center bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Ver turnos disponibles
            </motion.button>
          )}
        </motion.div>
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
                    <span className="font-medium">
                      {slot.day.charAt(0).toUpperCase() + slot.day.slice(1)} - {slot.date}
                    </span>
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