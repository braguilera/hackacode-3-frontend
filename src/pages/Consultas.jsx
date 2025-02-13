import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Calendar, Clock, User, CreditCard, Mail, Phone } from 'lucide-react';
import { Listbox } from '@headlessui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Consultas = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    medico: null,
    tipoConsulta: '',
    fecha: null,
    horario: null,
    paciente: null,
    pago: null
  });
  
  const [dateRange, setDateRange] = useState([null, null]);
  
  const steps = [
    { title: 'Médico', icon: User },
    { title: 'Tipo', icon: Clock },
    { title: 'Fecha', icon: Calendar },
    { title: 'Datos', icon: User },
    { title: 'Pago', icon: CreditCard }
  ];

  const validateStep = (step) => {
    switch(step) {
      case 0: return !!formData.medico;
      case 1: return !!formData.tipoConsulta;
      case 2: return !!formData.fecha && !!formData.horario;
      case 3: return !!formData.paciente;
      default: return true;
    }
  };

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));
  const handleSubmit = () => console.log('Form submitted:', formData);

  const ProgressIndicator = () => {
    const lineVariants = {
      incomplete: {
        backgroundImage: 'linear-gradient(to right, #e5e7eb 50%, #e5e7eb 50%)',
        backgroundSize: '200% 100%',
        backgroundPosition: 'left center'
      },
      complete: {
        backgroundImage: 'linear-gradient(to right, #3b82f6 50%, #3b82f6 50%)',
        backgroundSize: '200% 100%',
        backgroundPosition: 'right center'
      }
    };

    return (
      <div className="flex justify-between items-center mb-12 px-4">
        {steps.map((step, index) => (
          <div key={step.title} className="flex flex-col items-center relative">
            <motion.div
              className={`w-12 h-12 rounded-full flex items-center justify-center
                ${index < currentStep 
                  ? 'bg-blue-500 text-white' 
                  : index === currentStep
                    ? 'bg-white border-2 border-blue-500 text-blue-500'
                    : 'bg-white border-2 border-gray-200 text-gray-400'
                } transition-colors duration-300`}
              whileHover={{ scale: 1.1 }}
            >
              <step.icon className="w-5 h-5" />
            </motion.div>
            
            {index < steps.length - 1 && (
              <motion.div
                className="absolute w-24 h-0.5 left-full top-6 -translate-y-1/2"
                initial="incomplete"
                animate={index < currentStep ? "complete" : "incomplete"}
                variants={lineVariants}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{
                  background: index < currentStep - 1 
                    ? '#3b82f6' 
                    : '#e5e7eb'
                }}
              />
            )}
            
            <span className={`mt-2 text-sm ${
              index === currentStep 
                ? 'text-blue-500 font-medium' 
                : index < currentStep
                  ? 'text-gray-700'
                  : 'text-gray-400'
            }`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  // Sample data
  const dataMedico = {
    medicos: [
      {
        id: 1,
        nombre: "Dr. Juan",
        apellido: "Pérez",
        especialidades: [{ nombre: "Cardiología" }],
        disponibilidad: [
          { diaSemana: "Lunes", horaInicio: "09:00", horaFin: "12:00" }
        ]
      },
      {
        id: 2,
        nombre: "Dra. Ana",
        apellido: "García",
        especialidades: [{ nombre: "Pediatría" }],
        disponibilidad: [
          { diaSemana: "Martes", horaInicio: "14:00", horaFin: "18:00" }
        ]
      }
    ]
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl h-auto mx-auto bg-white rounded-2xl shadow-lg p-8"
    >
    <ProgressIndicator />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="min-h-[400px]"
        >
          {currentStep === 0 && (
            <SelectMedico 
              medicos={dataMedico.medicos}
              onSelect={(medico) => setFormData({...formData, medico})}
              selected={formData.medico}
            />
          )}
          {currentStep === 1 && (
            <SelectTipoConsulta 
              onSelect={(tipo) => setFormData({...formData, tipoConsulta: tipo})}
              selected={formData.tipoConsulta}
            />
          )}
          {currentStep === 2 && (
            <SelectDisponibilidad 
              medico={formData.medico}
              dateRange={dateRange}
              setDateRange={setDateRange}
              onSelect={(fecha, horario) => setFormData({...formData, fecha, horario})}
            />
          )}
          {currentStep === 3 && (
            <DatosPaciente 
              onComplete={(paciente) => setFormData({...formData, paciente})}
            />
          )}
          {currentStep === 4 && (
            <Pago data={formData} />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-12">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBack}
          disabled={currentStep === 0}
          className={`px-8 py-3 rounded-xl text-sm font-medium transition-colors
            ${currentStep === 0 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Anterior
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={currentStep < steps.length - 1 ? handleNext : handleSubmit}
          disabled={!validateStep(currentStep)}
          className={`px-8 py-3 rounded-xl text-sm font-medium text-white
            ${validateStep(currentStep)
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-blue-300 cursor-not-allowed'}`}
        >
          {currentStep < steps.length - 1 ? 'Siguiente' : 'Confirmar'}
        </motion.button>
      </div>
    </motion.div>
  );
};

const SelectMedico = ({ medicos, onSelect, selected }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="space-y-6"
  >
    <h2 className="text-2xl font-medium text-gray-800">Selecciona tu médico</h2>
    <Listbox value={selected} onChange={onSelect}>
      {({ open }) => (
        <div className="relative mt-4">
          <Listbox.Button className="w-full p-4 text-left bg-gray-50 rounded-xl border-2 border-gray-100 hover:border-blue-200 transition-all duration-200">
            {selected ? (
              <MedicoOption dataMedico={selected} />
            ) : (
              <span className="text-gray-400">Buscar médico...</span>
            )}
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </motion.div>
          </Listbox.Button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Listbox.Options className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg max-h-96 overflow-auto">
                  {medicos.map((medico) => (
                    <Listbox.Option key={medico.id} value={medico}>
                      {({ active }) => (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className={`p-4 cursor-pointer transition-colors
                            ${active ? 'bg-blue-50' : ''}`}
                        >
                          <MedicoOption dataMedico={medico} />
                        </motion.div>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </Listbox>
  </motion.div>
);

const SelectTipoConsulta = ({ onSelect, selected }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="space-y-6"
  >
    <h2 className="text-2xl font-medium text-gray-800">Tipo de consulta</h2>
    <div className="grid gap-4">
      {['Primera consulta', 'Consulta de seguimiento', 'Control rutinario'].map((tipo) => (
        <motion.button
          key={tipo}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(tipo)}
          className={`p-4 rounded-xl text-left transition-colors ${
            selected === tipo
              ? 'bg-blue-500 text-white'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="font-medium">{tipo}</div>
        </motion.button>
      ))}
    </div>
  </motion.div>
);

const SelectDisponibilidad = ({ medico, dateRange, setDateRange, onSelect }) => {
  const generateTimeSlots = () => {
    return [
      { time: '09:00', available: true },
      { time: '10:00', available: true },
      { time: '11:00', available: false },
      { time: '12:00', available: true },
    ];
  };

  const timeSlots = generateTimeSlots();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <h2 className="text-2xl font-medium text-gray-800">Selecciona fecha y hora</h2>
      
      <div className="bg-gray-50 p-4 rounded-xl">
        <DatePicker
          selectsRange
          startDate={dateRange[0]}
          endDate={dateRange[1]}
          onChange={(update) => setDateRange(update)}
          className="w-full bg-transparent outline-none"
          placeholderText="Seleccione fecha"
        />
      </div>

      {dateRange[0] && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4"
        >
          {timeSlots.map((slot) => (
            <motion.button
              key={slot.time}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!slot.available}
              onClick={() => onSelect(dateRange[0].toLocaleDateString(), slot.time)}
              className={`p-4 rounded-xl flex items-center gap-3 ${
                slot.available
                  ? 'bg-gray-50 hover:bg-gray-100'
                  : 'bg-gray-100 opacity-50 cursor-not-allowed'
              }`}
            >
              <Clock className="w-5 h-5 text-gray-500" />
              <span className="font-medium">{slot.time}</span>
            </motion.button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

const DatosPaciente = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    documento: ''
  });

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    if (newData.nombre && newData.email && newData.telefono && newData.documento) {
      onComplete(newData);
    }
  };

  const inputFields = [
    {
      id: 'nombre',
      label: 'Nombre completo',
      type: 'text',
      icon: User,
      placeholder: 'Ingresa tu nombre'
    },
    {
      id: 'email',
      label: 'Correo electrónico',
      type: 'email',
      icon: Mail,
      placeholder: 'tu@email.com'
    },
    {
      id: 'telefono',
      label: 'Teléfono',
      type: 'tel',
      icon: Phone,
      placeholder: '+34 XXX XXX XXX'
    },
    {
      id: 'documento',
      label: 'DNI/NIE',
      type: 'text',
      icon: CreditCard,
      placeholder: 'Ingresa tu documento'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <h2 className="text-2xl font-medium text-gray-800">Información personal</h2>
      <p className="text-gray-500">Por favor, completa tus datos para la consulta</p>
      
      <div className="grid gap-6">
        {inputFields.map(({ id, label, type, icon: Icon, placeholder }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-gray-600">{label}</label>
            <div className="relative">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={type}
                value={formData[id]}
                onChange={(e) => handleChange(id, e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 
                  focus:border-blue-200 outline-none transition-all duration-200
                  hover:border-gray-200"
                placeholder={placeholder}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const Pago = ({ data }) => {
  const resumenItems = [
    { label: 'Médico', value: `${data.medico?.nombre} ${data.medico?.apellido}` },
    { label: 'Especialidad', value: data.medico?.especialidades[0].nombre },
    { label: 'Tipo de consulta', value: data.tipoConsulta },
    { label: 'Fecha', value: data.fecha },
    { label: 'Hora', value: data.horario }
  ];

  const precio = 60; // Ejemplo de precio

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <h2 className="text-2xl font-medium text-gray-800">Resumen y pago</h2>
      
      <div className="bg-gray-50 rounded-xl p-6 space-y-6">
        <div className="space-y-4">
          {resumenItems.map(({ label, value }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-between items-center"
            >
              <span className="text-gray-500">{label}</span>
              <span className="font-medium">{value}</span>
            </motion.div>
          ))}
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">Total</span>
            <span className="text-2xl font-bold text-blue-500">{precio}€</span>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h3 className="font-medium">Método de pago</h3>
        {['Tarjeta de crédito', 'PayPal', 'Apple Pay'].map((method) => (
          <motion.button
            key={method}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full p-4 rounded-xl bg-white border-2 border-gray-100 
              hover:border-blue-200 transition-all duration-200
              flex items-center justify-between"
          >
            <span>{method}</span>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </motion.button>
        ))}
      </motion.div>

      <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
        <p>El pago se procesará de forma segura al confirmar la reserva</p>
      </div>
    </motion.div>
  );
};

const MedicoOption = ({ dataMedico }) => (
  <div className="flex items-center gap-4">
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`w-12 h-12 rounded-full flex items-center justify-center
        ${dataMedico.especialidades[0].nombre === 'Cardiología' 
          ? 'bg-red-100 text-red-800' 
          : 'bg-blue-100 text-blue-800'}`}
    >
      <span className="font-medium text-lg">
        {dataMedico.nombre.charAt(0)}{dataMedico.apellido.charAt(0)}
      </span>
    </motion.div>
    <div>
      <div className="font-medium text-gray-800">
        {dataMedico.nombre} {dataMedico.apellido}
      </div>
      <div className="text-sm text-gray-500">
        {dataMedico.especialidades[0].nombre}
      </div>
    </div>
  </div>
);

export default Consultas;