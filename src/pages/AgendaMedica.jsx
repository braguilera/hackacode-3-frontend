import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, subMonths, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Clock, 
  User, 
  Stethoscope,
  Calendar,
  Filter
} from 'lucide-react';

// Datos ficticios de ejemplo
const consultasFicticias = {
    "2025-02": [
      {
        codigo: 1,
        paciente: {
          id: 1,
          nombre: "Alex",
          apellido: "Andrada",
          dni: "35465433",
          fechaNac: "2000-02-03",
          email: "alex.andrada@mail.com",
          telefono: "4363246",
          direccion: "Av. Siempre Viva 742",
          tieneObraSocial: false
        },
        medico: {
          id: 1,
          nombre: "Norberto",
          apellido: "Gomez",
          dni: "58656443",
          fechaNac: "1990-02-05",
          email: "dr.gomez@clinica.com",
          telefono: "658456845",
          direccion: "Calle Falsa 123",
          sueldo: 1500.00,
          especialidades: [
            {
              id: 1,
              especialidad: {
                id: 1,
                nombre: "Alergología"
              },
              disponibilidades: [
                {
                  cubreTurno: "mañana",
                  horaInicio: "09:00:00",
                  horaFin: "12:00:00",
                  diaSemana: "LUNES"
                }
              ]
            }
          ]
        },
        servicioMedico: {
          codigo: 3,
          precio: 340.00,
          nombre: "Pruebas Alérgicas",
          tipoServicio: "PAQUETE"
        },
        fecha: "2025-02-08",
        hora: "12:00:00",
        estado: "CONFIRMADO"
      },
      {
        codigo: 2,
        paciente: {
          id: 2,
          nombre: "María",
          apellido: "López",
          dni: "28987654",
          fechaNac: "1995-08-15",
          email: "maria.lopez@mail.com",
          telefono: "11223344",
          direccion: "Calle Principal 456",
          tieneObraSocial: true
        },
        medico: {
          id: 3,
          nombre: "Laura",
          apellido: "Fernández",
          dni: "32456178",
          fechaNac: "1985-11-20",
          email: "dra.fernandez@clinica.com",
          telefono: "600112233",
          direccion: "Av. Central 789",
          sueldo: 1800.00,
          especialidades: [
            {
              id: 2,
              especialidad: {
                id: 2,
                nombre: "Pediatría"
              },
              disponibilidades: [
                {
                  cubreTurno: "tarde",
                  horaInicio: "15:00:00",
                  horaFin: "18:00:00",
                  diaSemana: "MIÉRCOLES"
                }
              ]
            }
          ]
        },
        servicioMedico: {
          codigo: 5,
          precio: 500.00,
          nombre: "Control Pediátrico",
          tipoServicio: "SERVICIO"
        },
        fecha: "2025-02-15",
        hora: "10:30:00",
        estado: "PENDIENTE"
      }
    ]
  };
  
  const detalleConsultasFicticio = {
    "2025-02-14": [
      {
        codigo: 1,
        paciente: {
          id: 1,
          nombre: "Alex",
          apellido: "Andrada",
          dni: "35465433",
          fechaNac: "2000-02-03",
          email: "alex.andrada@mail.com",
          telefono: "4363246",
          direccion: "Av. Siempre Viva 742",
          tieneObraSocial: false
        },
        medico: {
          id: 1,
          nombre: "Norberto",
          apellido: "Gomez",
          dni: "58656443",
          fechaNac: "1990-02-05",
          email: "dr.gomez@clinica.com",
          telefono: "658456845",
          direccion: "Calle Falsa 123",
          sueldo: 1500.00,
          especialidades: [
            {
              id: 1,
              especialidad: {
                id: 1,
                nombre: "Alergología"
              },
              disponibilidades: [
                {
                  cubreTurno: "mañana",
                  horaInicio: "09:00:00",
                  horaFin: "12:00:00",
                  diaSemana: "LUNES"
                }
              ]
            }
          ]
        },
        servicioMedico: {
          codigo: 3,
          precio: 340.00,
          nombre: "Pruebas Alérgicas",
          tipoServicio: "PAQUETE"
        },
        fecha: "2025-02-08",
        hora: "12:00:00",
        estado: "CONFIRMADO"
      }
    ]
  };

const AgendaMedica = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [consultas, setConsultas] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [detalleConsultas, setDetalleConsultas] = useState([]);
  const [filterStatus, setFilterStatus] = useState('TODAS');
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar consultas del mes
  useEffect(() => {
    const mesKey = format(currentDate, 'yyyy-MM');
    const consultasMes = consultasFicticias[mesKey] || [];
    setConsultas(consultasMes);
  }, [currentDate]);

  // Cargar detalle del día
  const cargarDetalleDia = (fecha) => {
    const diaKey = format(fecha, 'yyyy-MM-dd');
    const consultasDia = detalleConsultasFicticio[diaKey] || [];
    setDetalleConsultas(consultasDia);
  };

// Modificar la generación de días
const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  }).map(day => new Date(day.getFullYear(), day.getMonth(), day.getDate()));

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleDayClick = async (day) => {
    setSelectedDay(day);
    await cargarDetalleDia(day); // Eliminar la validación de fecha pasada
  };

  const filteredConsultas = detalleConsultas.filter(consulta => 
    filterStatus === 'TODAS' || consulta.estado === filterStatus
  );

  const getDayStyle = (day) => {
    const baseStyles = "h-32 p-4 border rounded-lg flex flex-col justify-between";
    const todayStyle = isSameDay(day, new Date()) ? "border-2 border-blue-500" : "";
    const pastStyle = isBefore(day, new Date()) ? "bg-gray-50 opacity-75" : "bg-white";
    
    return `${baseStyles} ${todayStyle} ${pastStyle}`;
  };


  return (
    <main className="w-full h-full flex flex-col py-6 px-12">
      {/* Header Section */}
      <header className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Agenda Médica
            <span className="text-gray-400 font-normal ml-2 text-lg">
              ({consultas.length} consultas este mes)
            </span>
          </h2>
          <p className="text-gray-500 mt-1">
            Gestiona las citas y consultas médicas
          </p>
        </div>
        
      </header>

      {/* Calendar Section */}
      <section className="bg-white rounded-xl h-[90%] shadow-sm border border-gray-200 p-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-gray-800">
            {format(currentDate, 'MMMM yyyy', { locale: es })}
          </h3>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevMonth}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNextMonth}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </motion.button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-4 mb-4">
          {['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'].map(day => (
            <div key={day} className="text-center font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-4">
          {daysInMonth.map(day => {
            const consultasDia = consultas.filter(c => 
              isSameDay(new Date(c.fecha), day)
            );
            
            return (
              <motion.button
                key={day.toString()}
                onClick={() => handleDayClick(day)}
                className={`
                  h-28 p-3 rounded-lg border transition-all
                  ${isSameDay(day, new Date()) ? 'border-blue-500 border-2' : 'border-gray-200'}
                  ${isBefore(day, new Date()) ? 'bg-gray-50' : 'bg-white hover:border-blue-300'}
                `}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-lg font-semibold ${
                    isSameDay(day, new Date()) ? 'text-blue-600' : 'text-gray-700'
                  }`}>
                    {format(day, 'd')}
                  </span>
                  {consultasDia.length > 0 && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                      {consultasDia.length}
                    </span>
                  )}
                </div>
                
                <div className="mt-2 space-y-1">
                  {consultasDia.slice(0, 2).map(consulta => (
                    <div key={consulta.codigo} className="text-xs text-gray-600 truncate flex items-center">
                      <Clock size={10} className="mr-1 flex-shrink-0" />
                      <span>{consulta.hora.slice(0, 5)} - {consulta.paciente?.nombre}</span>
                    </div>
                  ))}
                  {consultasDia.length > 2 && (
                    <div className="text-xs text-gray-500">+ {consultasDia.length - 2} más</div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Modal for Day Details */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedDay(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-xl w-full max-w-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <header className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800">
                    {format(selectedDay, 'EEEE d MMMM', { locale: es })}
                  </h3>
                  <button 
                    onClick={() => setSelectedDay(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </header>

              <div className="p-6">
                <div className="space-y-4">
                  {filteredConsultas.length > 0 ? (
                    filteredConsultas.map(consulta => (
                      <motion.div
                        key={consulta.codigo}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 border rounded-lg hover:border-blue-200 transition-all"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <Clock size={18} className="text-gray-500" />
                          <span className="text-lg font-medium">
                            {consulta.hora.slice(0, 5)}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            consulta.estado === 'CONFIRMADO' ? 'bg-green-100 text-green-700' :
                            consulta.estado === 'CANCELADO' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {consulta.estado}
                          </span>
                        </div>
                        <div className="space-y-2 text-gray-600">
                          <div className="flex items-center gap-2">
                            <User size={18} />
                            <span>{consulta.paciente.nombre} {consulta.paciente.apellido}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Stethoscope size={18} />
                            <span>Dr. {consulta.medico.nombre} {consulta.medico.apellido}</span>
                          </div>
                          <div className="pl-6 text-sm text-gray-500">
                            {consulta.servicioMedico.nombre}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No hay consultas programadas para este día
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default AgendaMedica;