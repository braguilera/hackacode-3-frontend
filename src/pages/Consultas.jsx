import React, { useEffect, useState } from 'react';
import { getDatos, postDatos } from '../api/crud';
import Notification from '../components/Notification';
import { Stethoscope, UserPlus, Calendar, Clock, ChevronRight, ChevronLeft, Check, User, Mail, Phone, MapPin, FileCheck, CalendarCheck, Package, DollarSign, CheckCircle, AlertCircle, FileText, Sparkles, IdCard, CheckCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StepIndicator from '../components/StepIndicator';
import EmptyState from '../components/EmptyState';

const Consultas = () => {
  const [medicos, setMedicos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [turnosMedico, setTurnosMedico] = useState([]);
  const [isEspecializada, setIsEspecializada] = useState(null);
  const [paciente, setPaciente] = useState(null);
  const [pacienteNotExist, setPacienteNotExist] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [messageNotification, setMessageNotification] = useState(null);
  const [serviciosInPaquete, setServiciosInPaquete] = useState([]);
  const [selectedPaquete, setSelectedPaquete] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [formData, setFormData] = useState({
    pacienteId: "",              
    medicoId: "",
    servicioMedicoCodigo: "",
    fecha: "",
    hora: "",
    estado: "pendiente",
    metodoPago: "tarjeta",
    esPagado: true
  });
  const [newPacienteData, setNewPacienteData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    fechaNac: "",
    email: "",
    telefono: "",
    direccion: "",
    tieneObraSocial: false
  });
  const [step, setStep] = useState(0);

  const getAvailableDates = (year, month) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return [];
    }
    let startDay = 1;
    if (year === currentYear && month === currentMonth) {
      startDay = today.getDate();
    }
    const lastDay = new Date(year, month + 1, 0).getDate();
    let dates = [];
    let workingDays = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
    const doctor = medicos.find(m => m.id === Number(formData.medicoId));
    if (doctor && doctor.disponibilidades && doctor.disponibilidades.length > 0) {
      workingDays = doctor.disponibilidades.map(d => d.diaSemana.toUpperCase());
    }
    for (let d = startDay; d <= lastDay; d++) {
      const date = new Date(year, month, d);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
      if (workingDays.includes(dayName)) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    return dates;
  };

  /* Default for no specialitation */
  const defaultTimeSlots = [
    "08:00:00", "08:30:00", "09:00:00", "09:30:00",
    "10:00:00", "10:30:00", "11:00:00", "11:30:00"
  ];

  const availableDates = getAvailableDates(selectedYear, selectedMonth - 1);
    
  /* Buttons to go to next step */
  const NavigationButtons = ({ onBack, onNext, step, isLastStep, isNextEnabled = true }) => (
    <aside className="w-full flex justify-between gap-4 mt-6 absolute bottom-0">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onBack}
        className={`flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors ${step===0 && 'invisible'}`}
      >
        <ChevronLeft className="w-5 h-5" />
        Anterior
      </motion.button>
      <motion.button
        whileHover={isNextEnabled ? { scale: 1.02 } : {}}
        whileTap={isNextEnabled ? { scale: 0.98 } : {}}
        onClick={isNextEnabled ? onNext : undefined}
        disabled={!isNextEnabled}
        className={`flex-1 px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
          isNextEnabled
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isLastStep ? (
          <>
            Confirmar
            <Check className="w-5 h-5" />
          </>
        ) : (
          <>
            Siguiente
            <ChevronRight className="w-5 h-5" />
          </>
        )}
      </motion.button>
    </aside>
  );
  
  const fetchMedicos = async () => {
    try {
      const data = await getDatos('/api/medicos', 'Error cargando medicos');
      setMedicos(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchServicios = async () => {
    try {
      const data = await getDatos('/api/servicios/individuales', 'Error cargando servicios');
      setServicios(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchPaquetes = async () => {
    try {
      const data = await getDatos('/api/servicios/paquetes', 'Error cargando paquetes');
      setPaquetes(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const createPaciente = async (pacienteData) => {
    try {
      const data = await postDatos('/api/pacientes', pacienteData, 'Error creando paciente');
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const fetchTurnosMedicos = async () => {
    if (!formData.medicoId) return;
    try {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const data = await getDatos(
        `/api/medicos/turnos-disponibles?medicoId=${formData.medicoId}&mes=${currentMonth}&anio=${currentYear}`,
        'Error obteniendo los turnos'
      );
      setTurnosMedico(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchMedicos();
    fetchServicios();
    fetchPaquetes();
  }, []);

  const fetchServicioEspecializado = async () => {
    if (!formData.servicioMedicoCodigo) {
      setIsEspecializada(null);
      return;
    }
    try {
      const data = await getDatos(
        `/api/servicios/individuales/${formData.servicioMedicoCodigo}`, 'Error cargando servicio especializado'
      );
      if (data.nombre === 'Consulta Especializada') {
        setIsEspecializada(data);
      } else {
        setIsEspecializada(null);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const isServiciosInPaquete = async () => {
    if (!formData.servicioMedicoCodigo) {
      return
    }
    try {
      const data = await getDatos(`/api/servicios/paquetes?servicioIndividualId=${formData.servicioMedicoCodigo}`,'Error cargando servicios en paquetes')
      setServiciosInPaquete(data)
    } catch (err){
      console.log(err.message)
    }
  }

  useEffect(() => {
    fetchServicioEspecializado();
    isServiciosInPaquete();
  }, [formData.servicioMedicoCodigo]);

  useEffect(() => {
    fetchTurnosMedicos();
  }, [formData.medicoId]);

  useEffect(() => {
    const fetchPaciente = async () => {
      if (!newPacienteData.dni) return;
      try {
        const data = await getDatos(`/api/pacientes/dni/${newPacienteData.dni}`);
        setPaciente(data);
        setPacienteNotExist(false);
        setFormData(prev => ({ ...prev, pacienteId: data.id }));
      } catch (err) {
        setPaciente(null);
        setPacienteNotExist(true);
        setFormData(prev => ({ ...prev, pacienteId: "" }));
      }
    };
    fetchPaciente();
  }, [newPacienteData.dni]);

  const groupTurnosByFecha = () => {
    const groups = {};
    turnosMedico.forEach(turno => {
      if (!groups[turno.fecha]) {
        groups[turno.fecha] = [];
      }
      groups[turno.fecha].push(turno);
    });
    return groups;
  };

  const groupedTurnos = groupTurnosByFecha();

  const handleCreatePaciente = async (e) => {
    e.preventDefault();
    
    try {
      const createdPaciente = await createPaciente(newPacienteData);
      setFormData(prev => ({ ...prev, pacienteId: createdPaciente.id }));
      setPaciente(createdPaciente);
      setPacienteNotExist(false);
    } catch (error) {
      console.error(error);
    }
  };

  const createConsulta = async () => {
    try {
      const consultaData = { ...formData };
      if (selectedPaquete) {
        consultaData.servicioMedicoCodigo = selectedPaquete.codigo;
      }
      console.log(consultaData)
      await postDatos('/api/consultas', consultaData, 'Error creando consulta');
      setMessageNotification({
        type: 'success',
        text: 'Consulta creada exitosamente'
      });
      setShowNotification(true);
      setStep(step + 1);
    } catch (error) {
      setMessageNotification({
        type: 'error',
        text: 'Error al crear la consulta'
      });
      setShowNotification(true);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col justify-center items-center p-8 relative mx-auto h-screen w-full"
      >

        <StepIndicator currentStep={step} totalSteps={4} />
  
        <AnimatePresence mode="wait">
          <motion.article
            key={step}
            {...fadeInUp}
            className="bg-white rounded-xl shadow-lg p-6 w-4/5 space-y-6 h-4/5"
          >
          {/* First Step - Select Service or Package and Medic */}
            {step === 0 && (
              <section className="flex pt-32 h-full relative w-full gap-10">
                <main className="flex flex-col w-2/3">
                  <header className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg w-full absolute top-0">
                    <Stethoscope className="w-8 h-8 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-800">Seleccionar Servicio</h2>
                  </header>

                  {/* Service Selection */}
                  <section className="w-full space-y-4 mb-6 ">
                    <header className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <label className="text-lg font-medium text-gray-700">Servicio Médico</label>
                    </header>
                    <select
                      className="w-full truncate p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={formData.servicioMedicoCodigo}
                      onChange={(e) => setFormData(prev => ({ ...prev, servicioMedicoCodigo: e.target.value }))}
                    >
                      <option value="">Seleccione un servicio</option>
                      {servicios.map(servicio => (
                        <option key={servicio.codigo} value={servicio.codigo}>
                          {servicio.nombre}
                        </option>
                      ))}
                    </select>
                  </section>

                  {/* Medic Selection */}
                  <motion.section
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="w-full space-y-4"
                  >
                    <header className="flex items-center gap-2 mb-2">
                      <User className="w-5 h-5 text-blue-500" />
                      <label className="text-lg font-medium text-gray-700">Médico Especialista</label>
                    </header>
                    <select
                      className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={formData.medicoId}
                      onChange={(e) => setFormData(prev => ({ ...prev, medicoId: e.target.value }))}
                    >
                      <option value="">Seleccione un médico</option>
                      {medicos.map(medico => (
                        <option key={medico.id} value={medico.id}>
                          {medico.nombre} {medico.apellido} - {medico.especialidad.nombre}
                        </option>
                      ))}
                    </select>
                  </motion.section>
                </main>

                {/* Packages Section */}
                {formData.servicioMedicoCodigo ? (
                  <aside className="w-full h-96 border overflow-y-scroll scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-50 rounded-lg">
                  {serviciosInPaquete.length === 0 ? 
                    <aside className="w-full h-full bg-white rounded-lg  divide-y divide-gray-100 justify-center">
                      <EmptyState type='serviciosInConsulta' />
                    </aside>
                    :
                    <header className="sticky top-0 bg-gradient-to-l from-blue-50 to-white p-4 border-b border-gray-100 z-10">
                      <article className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-blue-500" />
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">Paquetes Recomendados</h4>
                          <p className="text-sm text-gray-600">Descubre paquetes que incluyen este servicio y mucho más</p>
                        </div>
                      </article>
                    </header>
                  }
                    {serviciosInPaquete.map((paquete, index) => {
                      const isSelected = selectedPaquete && selectedPaquete.codigo === paquete.codigo;
                      return (
                        <article
                          key={index}
                          className={`p-6 space-y-4 cursor-pointer transition-all duration-200 hover:bg-blue-50 m-4 rounded-lg ${
                            isSelected ? "bg-blue-50 shadow-lg transform scale-[1.01]" : "hover:transform hover:scale-[1.01] hover:border-none border border-gray-200 "
                          }`}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedPaquete(null);
                            } else {
                              setSelectedPaquete(paquete);
                            }
                          }}
                        >
                          <header className="flex items-center justify-between mb-4">
                            <article className="flex items-center gap-3">
                              <Package className='w-6 h-6 text-blue-500'/>
                              <h4 className="text-xl font-bold text-gray-800 w-56 truncate">{paquete.nombre}</h4>
                            </article>
                            {isSelected && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                                Seleccionado
                              </span>
                            )}
                          </header>
                          <main className="space-y-3">
                            {paquete.servicios.map((servicio, sIndex) => (
                              <article 
                                key={sIndex} 
                                className={`flex items-center justify-between p-3 rounded-md ${isSelected ? 'bg-white' : 'bg-gray-50'}`}
                              >
                                <header className="flex items-center gap-2">
                                  <AlertCircle className={`w-4 h-4 ${isSelected ? 'text-blue-500' : 'text-gray-400'}`} />
                                  <h4 className="text-gray-700 w-56 truncate">{servicio.nombre}</h4>
                                </header>
                                <p className="font-medium text-gray-900">
                                  <DollarSign className="w-4 h-4 inline-block mr-1" />
                                  {servicio.precio}
                                </p>
                              </article>
                            ))}
                          </main>
                          <footer className="mt-6 pt-4 border-t border-gray-100">
                            <article className="flex justify-end items-center gap-2">
                              <span className="text-gray-600">Precio Total:</span>
                              <span className={`text-2xl font-bold ${isSelected ? 'text-blue-600' : 'text-gray-700'}`}>
                                <DollarSign className="w-6 h-6 inline-block mr-1" />
                                {paquete.precio}
                              </span>
                            </article>
                          </footer>
                        </article>
                      );
                    })}
                  </aside>
                ) : (
                  <aside className="w-full h-96 bg-white rounded-lg border divide-y divide-gray-100 justify-center">
                    <EmptyState type='serviciosInConsulta' />
                  </aside>
                )}

                <NavigationButtons
                  onNext={() => setStep(step + 1)}
                  onBack={() => null}
                  step={step}
                  isNextEnabled={(formData.servicioMedicoCodigo && formData.medicoId) ? true : false}
                  isLastStep={false}
                />
              </section>
            )}
            
          {/* Second Step - Select Date and hour */}
            {step === 1 && (
              isEspecializada ? (
                <section className="h-full relative w-full mx-auto">
                  <header className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg w-full absolute top-0">
                    <Calendar className="w-7 h-7 text-blue-500" />
                    <h2 className="text-2xl font-bold text-gray-800">Seleccione Fecha y Hora</h2>
                  </header>
                  <main className="pt-20">
                    {/* Select mounth */}
                    <aside className="flex gap-4 mb-4">
                      <label className="text-sm font-medium text-gray-700">Mes:</label>
                      <select 
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className="p-2 border rounded"
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i} value={i + 1}>
                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                          </option>
                        ))}
                      </select>
                      {/* Select Age */}
                      <article className="flex gap-2 items-center">
                        <label className="text-sm font-medium text-gray-700">Año:</label>
                        <select 
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(Number(e.target.value))}
                          className="p-2 border rounded"
                        >
                          {Array.from({ length: 5 }, (_, i) => {
                            const year = new Date().getFullYear() - 2 + i;
                            return (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            );
                          })}
                        </select>
                      </article>
                    </aside>
                    <article className="h-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {availableDates.length > 0 ? (
                        availableDates.map(date => (
                          <main key={date} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                            <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                              <Calendar className="w-5 h-5 text-blue-500" />
                              {date}
                            </h4>
                            <article className="grid grid-cols-3 gap-3">
                              {defaultTimeSlots.map(time => (
                                <motion.button
                                  key={`${date}-${time}`}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className={`px-4 py-2 rounded-lg flex justify-center items-center transition-all shadow-sm
                                    ${formData.fecha === date && formData.hora === time
                                      ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                                  onClick={() => setFormData(prev => ({ ...prev, fecha: date, hora: time }))}
                                >
                                  {time.slice(0, 5)}
                                </motion.button>
                              ))}
                            </article>
                          </main>
                        ))
                      ) : (
                        <article className="text-center p-6 text-gray-500">
                          No hay fechas disponibles en este mes para el médico seleccionado.
                        </article>
                      )}
                    </article>
                  </main>
                  <NavigationButtons
                    onNext={() => setStep(step + 1)}
                    onBack={() => setStep(step - 1)}
                    step={1}
                    isNextEnabled={!!formData.fecha}
                    isLastStep={false}
                  />
                </section>
              ) : (
                <section className="h-full relative w-full mx-auto">
                  {/* Seccion Service is nos specialized */}
                  <header className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg w-full absolute top-0">
                    <Calendar className="w-7 h-7 text-blue-500" />
                    <h2 className="text-2xl font-bold text-gray-800">Seleccione Fecha y Hora</h2>
                  </header>
                  <main className="pt-20">
                    <article className="h-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {availableDates.length > 0 ? (
                        availableDates.map(date => (
                          <section key={date} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                            <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                              <Calendar className="w-5 h-5 text-blue-500" />
                              {date}
                            </h4>
                            <article className="grid grid-cols-3 gap-3">
                              {defaultTimeSlots.map(time => (
                                <motion.button
                                  key={`${date}-${time}`}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className={`px-4 py-2 rounded-lg flex justify-center items-center transition-all shadow-sm
                                    ${formData.fecha === date && formData.hora === time
                                      ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                                  onClick={() => setFormData(prev => ({ ...prev, fecha: date, hora: time }))}
                                >
                                  {time.slice(0, 5)}
                                </motion.button>
                              ))}
                            </article>
                          </section>
                        ))
                      ) : (
                        <section className="text-center p-6 text-gray-500">
                          No hay fechas disponibles en este mes para el médico seleccionado.
                        </section>
                      )}
                    </article>
                  </main>
                  <NavigationButtons
                    onNext={() => setStep(step + 1)}
                    onBack={() => setStep(step - 1)}
                    step={1}
                    isNextEnabled={!!formData.fecha}
                    isLastStep={false}
                  />
                </section>
              )
            )}

          {/* Third Step - Pacient Data */}
            {step === 2 && (
                <section className="w-full h-full relative mx-auto">
                  <header className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg w-full absolute top-0">
                    <UserPlus className="w-7 h-7 text-blue-500" />
                    <h2 className="text-2xl font-bold text-gray-800">Datos del Paciente</h2>
                  </header>

                  <aside className=" pt-20 relative">
                    <input 
                      type="text"
                      placeholder="Documento del paciente"
                      className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all hover:border-gray-300"
                      value={newPacienteData.dni}
                      onChange={(e) => {
                        const doc = e.target.value;
                        setNewPacienteData(prev => ({ ...prev, dni: doc }));
                        if (!doc) {
                          setPaciente(null);
                          setFormData(prev => ({ ...prev, pacienteId: "" }));
                          setPacienteNotExist(true);
                        }
                      }}
                    />

                    <User className="w-5 h-5 text-blue-500 absolute left-4 top-24" />
                  </aside>

                  {/* Form When the Pacient Doesn't exist */}
                  <AnimatePresence>
                    {pacienteNotExist && (
                      <motion.main
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white shadow-sm mt-4"
                      >
                        <header className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg text-blue-700">
                          <UserPlus className="w-5 h-5 text-blue-500" />
                          <p className="text-sm font-medium">Complete los datos para crear el paciente</p>
                        </header>

                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <article className="relative">
                            <input
                              type="text"
                              placeholder="Nombre"
                              className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all hover:border-gray-300"
                              value={newPacienteData.nombre}
                              onChange={(e) => setNewPacienteData(prev => ({ ...prev, nombre: e.target.value }))}
                              required
                            />
                            <User className="w-5 h-5 text-blue-500 absolute left-4 top-4" />
                          </article>

                          <article className="relative">
                            <input
                              type="text"
                              placeholder="Apellido"
                              className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all hover:border-gray-300"
                              value={newPacienteData.apellido}
                              onChange={(e) => setNewPacienteData(prev => ({ ...prev, apellido: e.target.value }))}
                              required
                            />
                            <User className="w-5 h-5 text-blue-500 absolute left-4 top-4" />
                          </article>
                        </section>

                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

                          <article className="relative">
                            <input
                              type="date"
                              className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all hover:border-gray-300"
                              value={newPacienteData.fechaNac}
                              onChange={(e) => setNewPacienteData(prev => ({ ...prev, fechaNac: e.target.value }))}
                              required
                            />
                            <Calendar className="w-5 h-5 text-blue-500 absolute left-4 top-4" />
                          </article>

                          <article className="relative">
                            <input
                              type="email"
                              placeholder="Email"
                              className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all hover:border-gray-300"
                              value={newPacienteData.email}
                              onChange={(e) => setNewPacienteData(prev => ({ ...prev, email: e.target.value }))}
                              required
                            />
                            <Mail className="w-5 h-5 text-blue-500 absolute left-4 top-4" />
                          </article>
                        </section>

                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <article className="relative">
                            <input
                              type="tel"
                              placeholder="Teléfono"
                              className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all hover:border-gray-300"
                              value={newPacienteData.telefono}
                              onChange={(e) => setNewPacienteData(prev => ({ ...prev, telefono: e.target.value }))}
                              required
                            />
                            <Phone className="w-5 h-5 text-blue-500 absolute left-4 top-4" />
                          </article>

                          <article className="relative">
                            <input
                              type="text"
                              placeholder="Dirección"
                              className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all hover:border-gray-300"
                              value={newPacienteData.direccion}
                              onChange={(e) => setNewPacienteData(prev => ({ ...prev, direccion: e.target.value }))}
                              required
                            />
                            <MapPin className="w-5 h-5 text-blue-500 absolute left-4 top-4" />
                          </article>

                        </section>

                        
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <article className="relative">
                            <input
                              type="text"
                              placeholder="DNI"
                              className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all hover:border-gray-300"
                              value={newPacienteData.dni}
                              onChange={(e) => setNewPacienteData(prev => ({ ...prev, dni: e.target.value }))}
                              required
                            />
                            <IdCard className="w-5 h-5 text-blue-500 absolute left-4 top-4" />
                          </article>

                          <article className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl relative">
                            <input
                              type="checkbox"
                              id="obraSocial"
                              className="w-5 h-5 text-blue-500 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-0"
                              checked={newPacienteData.tieneObraSocial}
                              onChange={(e) => setNewPacienteData(prev => ({ ...prev, tieneObraSocial: e.target.checked }))}
                            />
                            <label htmlFor="obraSocial" className="text-sm font-medium text-gray-700">
                              Tiene obra social
                            </label>
                          </article>
                        </section>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleCreatePaciente}
                          className="w-full px-6 py-4 bg-green-500 text-white rounded-xl flex items-center justify-center gap-3 hover:bg-green-600 transition-colors shadow-sm font-medium"
                        >
                          <UserPlus className="w-5 h-5" />
                          Crear Paciente
                        </motion.button>
                      </motion.main>
                    )}

                    {paciente && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-6 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 shadow-sm mt-6"
                      >
                        <header className="bg-green-100 p-2 rounded-full">
                          <Check className="w-6 h-6 text-green-600" />
                        </header>
                        <aside className='flex flex-col gap-4'>

                          <p className="text-green-800 font-medium">
                            Paciente encontrado: 
                          </p>
                          <p className="text-green-800 font-medium">
                            Nombre y apellido: {paciente.nombre} {paciente.apellido}
                          </p>
                          <p className="text-green-800 font-medium">
                            DNI: {paciente.dni}
                          </p>
                        </aside>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <NavigationButtons
                    onNext={() => setStep(step + 1)}
                    onBack={() => setStep(step - 1)}
                    step={step}
                    isNextEnabled={!formData.pacienteId ? false : true }
                    isLastStep={false}
                  />
                </section>
            )}

          {/* Fourth Step - Data Preview And confirm consult */}
            {step === 3 && (
              <section className="h-full relative pt-20 w-full mx-auto">
                <header className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg w-full absolute top-0">
                  <FileCheck className="w-7 h-7 text-blue-500" />
                  <h2 className="text-2xl font-bold text-gray-800">Confirmar Consulta</h2>
                </header>

                <motion.main
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                >
                  <article className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2 ">
                        {selectedPaquete 
                            ? 'Paquete'
                            : 'Servicio'
                        }
                      </h3>
                      <p className="text-gray-900 flex items-center gap-2 text-lg w-full truncate">
                        {selectedPaquete 
                            ? <Package className="w-5 h-5 text-blue-500" />
                            : <FileText className="w-5 h-5 text-blue-500" />
                        }
                        
                        {selectedPaquete 
                          ? selectedPaquete.nombre 
                          : (servicios.find(s => s.codigo === Number(formData.servicioMedicoCodigo))?.nombre || "-")
                        }
                      </p>
                    </section>

                    
                    <section className="bg-gray-50 rounded-lg p-4">
                      {isEspecializada 
                      ? 
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Médico Asistente</h3>
                      :
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Médico Referente</h3>
                      }
                      <p className="text-gray-900 flex items-center gap-2 text-lg w-full truncate">
                        <User className="w-5 h-5 text-blue-500" />
                        {(() => {
                          const medico = medicos.find(m => m.id === Number(formData.medicoId));
                          return medico ? `${medico.nombre} ${medico.apellido}` : "-";
                        })()}
                      </p>

                    </section>
                    

                    <section className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Fecha</h3>
                      <p className="text-gray-900 flex items-center gap-2 text-lg w-full truncate">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        {formData.fecha || "-"}
                      </p>
                    </section>

                    <section className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Hora</h3>
                      <p className="text-gray-900 flex items-center gap-2 text-lg w-full truncate">
                        <Clock className="w-5 h-5 text-blue-500" />
                        {formData.hora ? formData.hora.slice(0, 5) : "-"}
                      </p>
                    </section>

                    <section className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Paciente</h3>
                      <p className="text-gray-900 flex items-center gap-2 text-lg w-full truncate">
                        <User className="w-5 h-5 text-blue-500" />
                        {paciente ? `${paciente.nombre} ${paciente.apellido}` : (newPacienteData.nombre ? `${newPacienteData.nombre} ${newPacienteData.apellido}` : "-")}
                      </p>
                    </section>
                    
                    <section className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Obra social</h3>
                      <p className="text-gray-900 flex items-center gap-2 text-lg ">
                        
                        {paciente.tieneObraSocial ? <CheckCheck className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-red-500" />}
                        {paciente.tieneObraSocial ? 'Tiene obra social' : 'No cuenta con obra social'}
                      </p>
                    </section>
                  </article>
                  <footer className="mt-8 p-5 bg-blue-100 rounded-xl">
                    <h3 className="text-blue-500 flex items-center gap-2 text-xl font-medium">Precio del {selectedPaquete ? 'Paquete' : 'Servicio'}</h3>
                    <p className="text-blue-700 flex items-center gap-2 text-2xl font-bold mt-1"> 
                      ${selectedPaquete 
                      ? selectedPaquete.precio 
                      : (servicios.find(s => s.codigo === Number(formData.servicioMedicoCodigo))?.precio || "-")} 
                    </p>
                  </footer>
                </motion.main>

                <NavigationButtons
                  onNext={() => {
                    createConsulta();
                    
                  }}
                  onBack={() => setStep(step - 1)}
                  step={step}
                  isNextEnabled={
                    (
                      !formData.servicioMedicoCodigo &&
                      !formData.pacienteId &&
                      !formData.fecha
                    )  ? false : true }
                  isLastStep={true}
                />
              </section>
            )}

          {/* Fifth Step - Confirmation Container */}
            {step === 4 && (
              <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-3xl mx-auto h-full relative p-6 flex flex-col items-center justify-center space-y-8"
              >
                <main className="w-full bg-white rounded-xl p-8 space-y-8">
                  <motion.header
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center ring-8 ring-green-50"
                  >
                    <Check className="w-10 h-10 text-green-600" />
                  </motion.header>
                  
                  <article className="space-y-4 text-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                      ¡Consulta Creada Exitosamente!
                    </h2>
                    
                    <aside className="bg-green-50 rounded-lg p-4 border border-green-100">
                      <p className="text-green-800">
                        La consulta ha sido programada correctamente.
                      </p>
                    </aside>
                  </article>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setFormData({
                        pacienteId: "",
                        medicoId: "",
                        servicioMedicoCodigo: "",
                        fecha: "",
                        hora: "",
                        estado: "pendiente"
                      });
                      setStep(0);
                    }}
                    className="w-full px-6 py-4 bg-blue-500 text-white rounded-xl inline-flex items-center justify-center gap-3 hover:bg-blue-600 transition-colors shadow-sm font-medium"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Nueva Consulta
                  </motion.button>
                </main>
              </motion.section>
            )}

          </motion.article>
        </AnimatePresence>
      <Notification
        message={messageNotification}
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </motion.main>
  );
};

export default Consultas;
