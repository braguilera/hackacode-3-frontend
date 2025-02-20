import React, { useEffect, useState } from 'react';
import { getDatos, postDatos } from '../api/crud';
import Notification from '../components/Notification';
import { 
  Stethoscope, 
  UserPlus, 
  Calendar,
  Clock,
  ChevronRight,
  ChevronLeft,
  Check,
  User,
  Mail,
  Phone,
  MapPin,
  FileCheck,
  CalendarCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StepIndicator from '../components/StepIndicator';

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
  const [formData, setFormData] = useState({
    pacienteId: "",              // Documento ingresado
    medicoId: "",
    servicioMedicoCodigo: "",
    fecha: "",
    hora: "",
    estado: "activo"
  });
  // Estado para los datos del nuevo paciente a crear
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

  const getAvailableDates = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-indexado
    const lastDay = new Date(year, month + 1, 0).getDate();
    let dates = [];
    for (let d = today.getDate(); d <= lastDay; d++) {
      const date = new Date(year, month, d);
      const day = date.getDay(); // 0: domingo, 6: sábado
      if (day >= 1 && day <= 5) { // lunes a viernes
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    return dates;
  };
  
  // Array de horarios por defecto
  const defaultTimeSlots = [
    "08:00:00", "08:30:00", "09:00:00", "09:30:00",
    "10:00:00", "10:30:00", "11:00:00", "11:30:00"
  ];

  const availableDates = getAvailableDates();
    
  const NavigationButtons = ({ onBack, onNext, step, isLastStep }) => (
    <div className=" w-full flex justify-between gap-4 mt-6 absolute bottom-0">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onBack}
        className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        Anterior
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNext}
        className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
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
    </div>
  );

  // Fetch de médicos, servicios y paquetes
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

  // Fetch de turnos para el médico seleccionado
  const fetchTurnosMedicos = async () => {
    if (!formData.medicoId) return;
    try {
      const currentMonth = new Date().getMonth() + 1;
      const data = await getDatos(
        `/api/medicos/turnos-disponibles?medicoId=${formData.medicoId}&mes=${currentMonth}`,
        'Error obteniendo los turnos'
      );
      setTurnosMedico(data);
      console.log(data)
    } catch (err) {
      console.log(err.message);
    }
  };
  

  // Buscar paciente por documento
  const fetchPaciente = async () => {
    if (!formData.pacienteId) return;
    try {
      const data = await getDatos(`/api/pacientes/${formData.pacienteId}`);
      setPaciente(data);
      setPacienteNotExist(false);
    } catch (err) {
      setPaciente(null);
      setPacienteNotExist(true);
    }
  };

  useEffect(() => {
    fetchMedicos();
    fetchServicios();
    fetchPaquetes();
  }, []);

  useEffect(() => {
    // Se ejecuta cuando cambia el código del servicio
    const fetchServicioEspecializado = async () => {
      if (!formData.servicioMedicoCodigo) {
        setIsEspecializada(null);
        return;
      }
      try {
        const data = await getDatos(
          `/api/servicios/individuales/${formData.servicioMedicoCodigo}`,
          'Error cargando servicio especializado'
        );
        // Si el servicio se llama "Consulta Especializada", se considera especializado
        if (data.nombre === 'Consulta Especializada') {
          setIsEspecializada(data);
        } else {
          setIsEspecializada(null);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchServicioEspecializado();
  }, [formData.servicioMedicoCodigo]);

  useEffect(() => {
    fetchTurnosMedicos();
  }, [formData.medicoId]);

  useEffect(() => {
    fetchPaciente();
  }, [formData.pacienteId]);

  // Función para agrupar turnos por fecha
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

  // Función para manejar la creación del paciente cuando no existe
  const handleCreatePaciente = async (e) => {
    e.preventDefault();
    try {
      const createdPaciente = await createPaciente(newPacienteData);
      // Actualizamos el formData con el id (o documento) del paciente creado
      setFormData(prev => ({ ...prev, pacienteId: createdPaciente.id }));
      setPaciente(createdPaciente);
      setPacienteNotExist(false);
    } catch (error) {
      console.error(error);
    }
  };

  const createConsulta = async () => {
    try {
      await postDatos('/api/consultas', formData, 'Error creando paciente');
      setMessageNotification({
        type: 'success',
        text: 'Consulta creada exitosamente'
      });
      setShowNotification(true)
    } catch (error) {
      setMessageNotification({
        type: 'error',
        text: 'Error al crear la consulta'
      });
      setShowNotification(true)
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-8 max-w-7xl mx-auto h-screen w-full"
      >
        <StepIndicator currentStep={step} totalSteps={4} />
  
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            {...fadeInUp}
            className="bg-white rounded-xl shadow-lg p-6 space-y-6 h-4/5 "
          >
            {step === 0 && (
              <section className="space-y-6 h-full relative">
                <div className="flex items-center gap-2 mb-6">
                  <Stethoscope className="w-6 h-6 text-blue-500" />
                  <h2 className="text-xl font-semibold text-gray-800">Seleccionar Servicio</h2>
                </div>
  
                <select
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
  
                {isEspecializada && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="space-y-4"
                  >
                    <select
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  </motion.div>
                )}
  
                <NavigationButtons
                  onNext={() => setStep(step + 1)}
                  onBack={() => null}
                  step={step}
                  isLastStep={false}
                />
              </section>
            )}
  
            {step === 1 && (
              isEspecializada ? (
                <section className="space-y-6 h-full relative">
                  <div className="flex items-center gap-2 mb-6">
                    <CalendarCheck className="w-6 h-6 text-blue-500" />
                    <h2 className="text-xl font-semibold text-gray-800">Seleccionar Turno</h2>
                  </div>
                  <div className="space-y-4 h-[90%]">
                    {Object.keys(groupedTurnos).map(fecha => (
                      <motion.div
                        key={fecha}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          {fecha}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {groupedTurnos[fecha].map(turno => (
                            <motion.button
                              key={`${fecha}-${turno.hora}`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all
                                ${formData.fecha === fecha && formData.hora === turno.hora
                                  ? 'bg-blue-500 text-white shadow-md'
                                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                              onClick={() => setFormData(prev => ({ ...prev, fecha: fecha, hora: turno.hora }))}
                            >
                              <Clock className="w-4 h-4" />
                              {turno.hora.slice(0, 5)}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <NavigationButtons
                    onNext={() => setStep(step + 1)}
                    onBack={() => setStep(step - 1)}
                    step={step}
                    isLastStep={false}
                  />
                </section>
              ) : (
                <section className="space-y-6 h-full">
                  <div className="flex items-center gap-2 mb-6">
                    <Calendar className="w-6 h-6 text-blue-500" />
                    <h2 className="text-xl font-semibold text-gray-800">Seleccione Fecha y Hora</h2>
                  </div>
                  <article className='h-3/4 grid grid-cols-4 gap-2'>
                  {availableDates.map(date => (
                    <div key={date} className="mb-4 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        {date}
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {defaultTimeSlots.map(time => (
                          <motion.button
                            key={`${date}-${time}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all
                              ${formData.fecha === date && formData.hora === time
                                ? 'bg-blue-500 text-white shadow-md'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                            onClick={() => setFormData(prev => ({ ...prev, fecha: date, hora: time }))}
                          >
                            <Clock className="w-4 h-4" />
                            {time.slice(0, 5)}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ))}
                  </article>
                  <NavigationButtons
                    onNext={() => setStep(step + 1)}
                    onBack={() => setStep(step - 1)}
                    step={step}
                    isLastStep={false}
                  />
                </section>
              )
            )}
  
            {step === 2 && (
              <section className="space-y-6 h-full relative">
                <div className="flex items-center gap-2 mb-6">
                  <UserPlus className="w-6 h-6 text-blue-500" />
                  <h2 className="text-xl font-semibold text-gray-800">Datos del Paciente</h2>
                </div>

                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="Documento del paciente"
                      className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.pacienteId}
                      onChange={(e) => {
                        const doc = e.target.value;
                        setFormData(prev => ({ ...prev, pacienteId: doc }));
                        setNewPacienteData(prev => ({ ...prev, dni: doc }));
                      }}
                    />
                    <User className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                  </div>

                  <AnimatePresence>
                    {pacienteNotExist && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border border-gray-200 rounded-lg p-6 space-y-4 bg-gray-50"
                      >
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <UserPlus className="w-4 h-4" />
                          Complete los datos para crear el paciente
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Nombre"
                              className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={newPacienteData.nombre}
                              onChange={(e) => setNewPacienteData(prev => ({ ...prev, nombre: e.target.value }))}
                              required
                            />
                            <User className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                          </div>

                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Apellido"
                              className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={newPacienteData.apellido}
                              onChange={(e) => setNewPacienteData(prev => ({ ...prev, apellido: e.target.value }))}
                              required
                            />
                            <User className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                          </div>
                        </div>

                        <div className="relative">
                          <input
                            type="date"
                            className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={newPacienteData.fechaNac}
                            onChange={(e) => setNewPacienteData(prev => ({ ...prev, fechaNac: e.target.value }))}
                            required
                          />
                          <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                        </div>

                        <div className="relative">
                          <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={newPacienteData.email}
                            onChange={(e) => setNewPacienteData(prev => ({ ...prev, email: e.target.value }))}
                            required
                          />
                          <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                        </div>

                        <div className="relative">
                          <input
                            type="tel"
                            placeholder="Teléfono"
                            className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={newPacienteData.telefono}
                            onChange={(e) => setNewPacienteData(prev => ({ ...prev, telefono: e.target.value }))}
                            required
                          />
                          <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                        </div>

                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Dirección"
                            className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={newPacienteData.direccion}
                            onChange={(e) => setNewPacienteData(prev => ({ ...prev, direccion: e.target.value }))}
                            required
                          />
                          <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="obraSocial"
                            className="w-4 h-4 text-blue-500 border border-gray-300 rounded focus:ring-blue-500"
                            checked={newPacienteData.tieneObraSocial}
                            onChange={(e) => setNewPacienteData(prev => ({ ...prev, tieneObraSocial: e.target.checked }))}
                          />
                          <label htmlFor="obraSocial" className="text-sm text-gray-600">
                            Tiene obra social
                          </label>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleCreatePaciente}
                          className="w-full px-4 py-3 bg-green-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
                        >
                          <UserPlus className="w-5 h-5" />
                          Crear Paciente
                        </motion.button>
                      </motion.div>
                    )}

                    {paciente && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 bg-green-50 border border-green-100 rounded-lg flex items-center gap-3"
                      >
                        <Check className="w-5 h-5 text-green-500" />
                        <p className="text-green-700">
                          Paciente encontrado: {paciente.nombre} {paciente.apellido}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                

                <NavigationButtons
                  onNext={() => setStep(step + 1)}
                  onBack={() => setStep(step - 1)}
                  step={step}
                  isLastStep={false}
                />
              </section>
            )}

          {step === 3 && (
            <section className="space-y-6 h-full relative">
              <div className="flex items-center gap-2 mb-6">
                <FileCheck className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800">Confirmar Consulta</h2>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 bg-gray-50 p-6 rounded-lg"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Servicio</h3>
                    <p className="text-gray-900 flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-blue-500" />
                      {servicios.find(s => s.codigo === Number(formData.servicioMedicoCodigo))?.nombre || "-"}
                    </p>
                  </div>

                  {isEspecializada && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500">Médico</h3>
                      <p className="text-gray-900 flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-500" />
                        {medicos.find(m => m.id === Number(formData.medicoId))?.nombre || "-"}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Fecha</h3>
                    <p className="text-gray-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      {formData.fecha || "-"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Hora</h3>
                    <p className="text-gray-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      {formData.hora ? formData.hora.slice(0, 5) : "-"}
                    </p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500">Paciente</h3>
                    <p className="text-gray-900 flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-500" />
                      {paciente ? `${paciente.nombre} ${paciente.apellido}` : (newPacienteData.nombre ? `${newPacienteData.nombre} ${newPacienteData.apellido}` : "-")}
                    </p>
                  </div>
                </div>
              </motion.div>

              <NavigationButtons
                onNext={() => {
                  createConsulta();
                  setStep(step + 1);
                }}
                onBack={() => setStep(step - 1)}
                step={step}
                isLastStep={true}
              />
            </section>
          )}

          {step === 4 && (
            <motion.section
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4 py-8 h-full relative"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center"
              >
                <Check className="w-8 h-8 text-green-500" />
              </motion.div>
              
              <h2 className="text-2xl font-semibold text-gray-800">
                ¡Consulta Creada Exitosamente!
              </h2>
              
              <p className="text-gray-600">
                La consulta ha sido programada correctamente.
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  // Reset form and go back to first step
                  setFormData({
                    pacienteId: "",
                    medicoId: "",
                    servicioMedicoCodigo: "",
                    fecha: "",
                    hora: "",
                    estado: "activo"
                  });
                  setStep(0);
                }}
                className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg inline-flex items-center gap-2 hover:bg-blue-600 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Nueva Consulta
              </motion.button>
            </motion.section>
          )}
        </motion.div>
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
