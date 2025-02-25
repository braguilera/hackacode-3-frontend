import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addDays, isBefore, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, X, Clock, User, Stethoscope,Trash2, Download} from 'lucide-react';
import { deleteDatos, getDatos, putDatos } from '../api/crud';
import Notification from '../components/Notification';
import { jsPDF } from "jspdf";

const AgendaMedica = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [consultas, setConsultas] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [consultasDetalladas, setConsultasDetalladas] = useState([]);
  const currentDate = new Date(selectedYear, selectedMonth - 1, 1);
  const [showNotification, setShowNotification] = useState(false);
  const [messageNotification, setMessageNotification] = useState(null);
  const firstDayOfMonth = startOfMonth(currentDate);
  const emptySlotsCount = firstDayOfMonth.getDay();
  const emptySlots = Array(emptySlotsCount).fill(null);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const calendarCells = [...emptySlots, ...daysInMonth];

  const fetchConsultas = async () => {
    try {
      const data = await getDatos('/api/consultas', 'Error cargando consultas');
      setConsultas(data);
      console.log(data)
    } catch (err) {
      console.log(err.message);
    } 
  };

  const editConsulta = async (consultaActualizada) => {
    try {
      // payload with correct structure
      const payload = {
        pacienteId: consultaActualizada.pacienteId,
        medicoId: consultaActualizada.medicoId,
        servicioMedicoCodigo: consultaActualizada.servicioMedico.codigo,
        fecha: consultaActualizada.fecha,
        hora: consultaActualizada.hora,
        estado: consultaActualizada.estado
      };

      console.log("ID:",consultaActualizada.codigo,payload)
  
      await putDatos(`/api/consultas/${consultaActualizada.codigo}`, payload,'Error editando consulta');
      
      await fetchConsultas();
      setMessageNotification({
        type: 'success',
        text: 'Estado actualizado exitosamente'
      });
      setShowNotification(true)
    } catch (error) {
      setMessageNotification({
        type: 'error',
        text: 'Error al actualizar el estado'
      });
      setShowNotification(true)
    }
  };

  const deleteConsulta = async (consulta) => {
    console.log('Delete:',consulta)
    try {
      await deleteDatos(`/api/consultas/${consulta.codigo}`, 'Error eliminando consulta');
      fetchConsultas();
    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    fetchConsultas();
  }, []);

  const generateTicket = (consulta) => {
    const doc = new jsPDF();
  
    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Ticket de Consulta", 105, 20, { align: "center" });
  
    // Body
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Número de Consulta: ${consulta.codigo}`, 20, 40);
    const formattedDate = format(
      parse(consulta.fecha, 'yyyy-MM-dd', new Date()),
      'dd/MM/yyyy'
    );
    doc.text(`Fecha: ${formattedDate}`, 20, 50);
    doc.text(`Hora: ${consulta.hora.slice(0, 5)}`, 20, 60);
    doc.text(
      `Paciente: ${consulta.paciente.nombre} ${consulta.paciente.apellido}`,
      20,
      70
    );
    doc.text(
      `Médico: ${consulta.medico.nombre} ${consulta.medico.apellido}`,
      20,
      80
    );
    doc.text(`Servicio: ${consulta.servicioMedico.nombre}`, 20, 90);
    doc.text(`Estado: ${consulta.estado}`, 20, 100);
  
    // Payment Deatils 
    const metodo = consulta.pago.metodo ? consulta.pago.metodo : "No especificado";
    doc.text(`Método de pago: ${metodo}`, 20, 110);
    doc.text(`Costo final: $${consulta.pago.total}`, 20, 120);
    const obraSocial =
      consulta.pago.total < consulta.servicioMedico.precio ? "Sí" : "No";
    doc.text(`Obra Social: ${obraSocial}`, 20, 130);
  
    doc.setLineWidth(0.5);
    doc.line(20, 135, 190, 135);
  
    doc.setFontSize(10);
    doc.text("Gracias por confiar en nosotros.", 105, 145, { align: "center" });
  
    // Download PDF
    doc.save(`TicketConsulta_${consulta.codigo}.pdf`);
  };
  
  /* Consult's Details per Day */
  useEffect(() => {
    const fetchDetails = async () => {
      if (!selectedDay) return;
      
      try {
        const dayKey = format(selectedDay, 'yyyy-MM-dd');
        const consultasDia = consultas.filter(c => 
          format(parse(c.fecha, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd') === dayKey
        );
        
        const detailed = await Promise.all(
          consultasDia.map(async (consulta) => {
            try {
              const [paciente, medico] = await Promise.all([
                consulta.pacienteId 
                  ? getDatos(`/api/pacientes/${consulta.pacienteId}`, 'Error fetching paciente')
                      .catch(() => null)
                  : null,
                consulta.medicoId 
                  ? getDatos(`/api/medicos/${consulta.medicoId}`, 'Error fetching medico')
                      .catch(() => null)
                  : null
              ]);
              return { 
                ...consulta,
                paciente: paciente || { nombre: 'No encontrado', apellido: '' },
                medico: medico || { nombre: 'No encontrado', apellido: '' }
              };
            } catch (error) {
              console.error('Error cargando detalles:', error);
              return { 
                ...consulta,
                paciente: { nombre: 'Error cargando', apellido: '' },
                medico: { nombre: 'Error cargando', apellido: '' }
              };
            }
          })
        );
        
        setConsultasDetalladas(detailed);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchDetails();
  }, [selectedDay, consultas]);
  

  useEffect(() => {
    setSelectedDay(null);
  }, [selectedMonth, selectedYear]);

  const handleDayClick = (day) => {
    setConsultasDetalladas([]);
    setSelectedDay(day);
  };

  useEffect(() => {
    setSelectedDay(null);
    setConsultasDetalladas([]);
  }, [selectedMonth, selectedYear]);

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


  return (
    <main className="w-full h-full flex flex-col py-6 px-12">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <section>
          <h2 className="text-2xl font-bold text-gray-800">
            Agenda Médica
            <span className="text-gray-400 font-normal ml-2 text-lg">
              ({consultasMes.length} consultas este mes)
            </span>
          </h2>
          <p className="text-gray-500 mt-1">
            Gestiona las citas y consultas médicas
          </p>
        </section>
        <section className="flex gap-4 mt-4 sm:mt-0">
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
        </section>
      </header>

      {/* Calendar Section */}
      <section className="bg-white rounded-xl h-[90%] shadow-sm border border-gray-200 p-6">
        {/* Month Navigation */}
        <article className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-gray-800">
            {format(currentDate, 'MMMM yyyy', { locale: es })}
          </h3>
          <aside className="flex gap-2">
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
          </aside>
        </article>

        {/* Calendar Grid */}
        <article className="grid grid-cols-7 gap-4 mb-4">
          {['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'].map(day => (
            <article key={day} className="text-center font-medium text-gray-500">
              {day}
            </article>
          ))}
        </article>

        <article className="grid grid-cols-7 gap-2">
          {calendarCells.map((cell, index) => {
            if (!cell) {
              // Empty grid
              return (
                <div key={`empty-${index}`} className="h-24"></div>
              );
            }

            const adjustedDay = cell; 
            const adjustedDayKey = format(adjustedDay, 'yyyy-MM-dd');
            const consultasDia = consultas.filter(c => 
              format(parse(c.fecha, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd') === adjustedDayKey
            );

            
            return (
              <motion.button
                key={adjustedDay.toString()}
                onClick={() => handleDayClick(adjustedDay)}
                className={`
                  h-24 p-3 relative rounded-lg border transition-all
                  ${adjustedDayKey === format(new Date(), 'yyyy-MM-dd') ? 'border-blue-500 border-2' : 'border-gray-200'}
                  ${isBefore(adjustedDay, new Date()) ? 'bg-gray-50' : 'bg-white hover:border-blue-300'}
                `}
                whileHover={{ scale: 1.02 }}
              >
                <header className="flex justify-between items-start">
                  <span className={`text-lg font-semibold ${adjustedDayKey === format(new Date(), 'yyyy-MM-dd') ? 'text-blue-600' : 'text-gray-700'}`}>
                    {format(adjustedDay, 'd')}
                  </span>
                  {consultasDia.length > 0 && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                      {consultasDia.length}
                    </span>
                  )}
                </header>
                <article className="mt-2 space-y-1">
                  {consultasDia.slice(0, 2).map(consulta => (
                    <div key={consulta.codigo} className="text-xs text-gray-600 truncate flex items-center">
                      <Clock size={10} className="mr-1 flex-shrink-0" />
                      <span>{consulta.hora.slice(0, 5)} - {consulta.paciente?.nombre}</span>
                    </div>
                  ))}
                  {consultasDia.length > 2 && (
                    <div className="text-xs text-gray-500 absolute bottom-3 right-4">+ {consultasDia.length - 2} más</div>
                  )}
                </article>
              </motion.button>
            );
          })}
        </article>
      </section>

      {/* Modal for Day Details */}
      <AnimatePresence>
        {selectedDay && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedDay(null)}
          >
            <motion.article
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-xl w-full max-w-2xl h-4/5 overflow-y-scroll scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-50"
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
              <section className="p-6">
                {consultasDetalladas.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">
                    No hay consultas programadas para este día
                  </p>
                  ) : (
                    consultasDetalladas.map(consulta => (
                  <motion.div
                    key={consulta.codigo}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border rounded-lg mb-4 hover:border-blue-200 transition-all group relative"
                  >
                    <header className="flex items-center gap-3 mb-3">
                      <Clock size={18} className="text-gray-500" />
                      <span className="text-lg font-medium">{consulta.hora.slice(0, 5)}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        consulta.estado === 'finalizado' ? 'bg-green-100 text-green-700' :
                        consulta.estado === 'pendiente' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {consulta.estado}
                      </span>
                    </header>
                    <article className="space-y-2 text-gray-600">
                      <section className="flex items-center gap-2">
                        <User size={18} />
                        <span>
                          {consulta.paciente 
                            ? `${consulta.paciente.nombre} ${consulta.paciente.apellido}`
                            : "Paciente no encontrado"}
                        </span>
                      </section>
                      <section className="flex items-center gap-2">
                        <Stethoscope size={18} />
                        <span>
                          {consulta.medico
                            ? `${consulta.medico.nombre} ${consulta.medico.apellido}`
                            : "Médico no encontrado"}
                        </span>
                      </section>
                      <section className="pl-6 text-sm text-gray-500">
                        {consulta.servicioMedico.nombre}
                      </section>
                    </article>
                    {/* Edit, Delete and Download */}
                    <aside className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <select
                        value={consulta.estado}
                        onChange={(e) => {
                          const nuevoEstado = e.target.value;
                          const consultaActualizada = { ...consulta, estado: nuevoEstado };
                          editConsulta(consultaActualizada);
                        }}
                        className="px-2 py-1 rounded border border-gray-200 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="finalizado">Finalizado</option>
                      </select>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="p-1.5 rounded-full bg-white hover:bg-red-50 text-gray-600 hover:text-red-500 shadow-sm"
                        onClick={(e) => { e.stopPropagation(); deleteConsulta(consulta); }}
                      >
                        <Trash2 size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="p-1.5 rounded-full bg-white hover:bg-blue-50 text-gray-600 hover:text-blue-500 shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          generateTicket(consulta);
                        }}
                      >
                        <Download size={16} />
                      </motion.button>
                    </aside>
                  </motion.div>
                ))

                )}
              </section>
            </motion.article>
          </motion.main>
        )}
      </AnimatePresence>

      <Notification
        message={messageNotification}
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </main>
  );
};

export default AgendaMedica;
