import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Clock, 
  User, 
  Stethoscope,
  Calendar
} from 'lucide-react';
import { getDatos } from '../api/crud';


const AgendaMedica = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [consultas, setConsultas] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [detalleConsultas, setDetalleConsultas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [consultasDetalladas, setConsultasDetalladas] = useState([]);
  const currentDate = new Date(selectedYear, selectedMonth - 1, 1);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const fetchConsultas = async () => {
    setLoading(true);
    try {
      const data = await getDatos('/api/consultas', 'Error cargando consultas');
      setConsultas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultas();
  }, []);


  useEffect(() => {
    const fetchDetailsForConsultas = async () => {
      try {
        if (detalleConsultas.length > 0 && detalleConsultas.some(c => !c.paciente || !c.medico)) {
          const detailed = await Promise.all(
            detalleConsultas.map(async (consulta) => {
              let paciente = consulta.paciente;
              let medico = consulta.medico;
              if (!paciente) {
                paciente = await getDatos(`/api/pacientes/${consulta.pacienteId}`, 'Error fetching paciente');
              }
              if (!medico) {
                medico = await getDatos(`/api/medicos/${consulta.medicoId}`, 'Error fetching medico');
              }
              return { ...consulta, paciente, medico };
            })
          );
          setConsultasDetalladas(detailed);
        } else {
          setConsultasDetalladas(detalleConsultas);
        }
      } catch (err) {
        console.error(err);
      }
    };
  
    if (detalleConsultas.length > 0) {
      fetchDetailsForConsultas();
    } else {
      setConsultasDetalladas([]);
    }
  }, [detalleConsultas]);
  

  useEffect(() => {
    setSelectedDay(null);
  }, [selectedMonth, selectedYear]);

  const handleDayClick = (day) => {
    setSelectedDay(day);
    const dayKey = format(day, 'yyyy-MM-dd');
    const consultasDia = consultas.filter(consulta => 
      format(new Date(consulta.fecha), 'yyyy-MM-dd') === dayKey
    );
    setDetalleConsultas(consultasDia);
  };
  

  const monthOptions = Array.from({ length: 12 }).map((_, i) => {
    const monthNumber = i + 1;
    const monthName = new Date(0, i).toLocaleString('default', { month: 'long' });
    return { value: monthNumber, label: monthName };
  });
  const yearOptions = Array.from({ length: 5 }).map((_, i) => {
    const year = new Date().getFullYear() - 2 + i;
    return year;
  });

  const consultasMes = consultas.filter(consulta => {
    const d = new Date(consulta.fecha);
    return d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear;
  });

  const renderDayDetailsModal = () => (
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
          <header className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">
              {format(selectedDay, 'EEEE, d MMMM yyyy', { locale: es })}
            </h3>
            <button 
              onClick={() => setSelectedDay(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </header>
          <div className="p-6">
            {consultasDetalladas.length > 0 ? (
              consultasDetalladas.map(consulta => (
                <motion.div
                  key={consulta.codigo}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border rounded-lg mb-4 hover:border-blue-200 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Clock size={18} className="text-gray-500" />
                    <span className="text-lg font-medium">{consulta.hora.slice(0, 5)}</span>
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
                      <span>
                        {consulta.paciente
                          ? `${consulta.paciente.nombre} ${consulta.paciente.apellido}`
                          : "Cargando paciente..."}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Stethoscope size={18} />
                      <span>
                        {consulta.medico
                          ? `Dr. ${consulta.medico.nombre} ${consulta.medico.apellido}`
                          : "Cargando médico..."}
                      </span>
                    </div>
                    <div className="pl-6 text-sm text-gray-500">
                      {consulta.servicioMedico.nombre}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-center py-8 text-gray-500">
                No hay consultas programadas para este día
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
  );

  return (
    <main className="w-full h-full flex flex-col py-6 px-12">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Agenda Médica
            <span className="text-gray-400 font-normal ml-2 text-lg">
              ({consultasMes.length} consultas este mes)
            </span>
          </h2>
          <p className="text-gray-500 mt-1">
            Gestiona las citas y consultas médicas
          </p>
        </div>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <select
            className="p-2 border border-gray-300 rounded"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {monthOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            className="p-2 border border-gray-300 rounded"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {yearOptions.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
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
              onClick={() => {
                const newDate = new Date(selectedYear, selectedMonth - 2, 1);
                setSelectedMonth(newDate.getMonth() + 1);
                setSelectedYear(newDate.getFullYear());
              }}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const newDate = new Date(selectedYear, selectedMonth, 1);
                setSelectedMonth(newDate.getMonth() + 1);
                setSelectedYear(newDate.getFullYear());
              }}
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
            const dayKey = format(day, 'yyyy-MM-dd');
            const consultasDia = consultas.filter(c => 
              format(new Date(c.fecha), 'yyyy-MM-dd') === dayKey
            );
            return (
              <motion.button
                key={day.toString()}
                onClick={() => handleDayClick(day)}
                className={`
                  h-28 p-3 rounded-lg border transition-all
                  ${dayKey === format(new Date(), 'yyyy-MM-dd') ? 'border-blue-500 border-2' : 'border-gray-200'}
                  ${isBefore(day, new Date()) ? 'bg-gray-50' : 'bg-white hover:border-blue-300'}
                `}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-lg font-semibold ${dayKey === format(new Date(), 'yyyy-MM-dd') ? 'text-blue-600' : 'text-gray-700'}`}>
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
      {renderDayDetailsModal()}
    </main>
  );
};

export default AgendaMedica;
