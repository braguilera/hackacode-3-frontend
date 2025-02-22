import React, { useEffect, useState } from 'react';
import { Phone, Mail, Calendar, MapPin, Clock, Award } from 'lucide-react';
import SlideOverModal from './SlideOverModal';
import { getDatos } from '../api/crud';

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 py-3">
    <Icon className="w-5 h-5 text-gray-400" />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-gray-900">{value}</p>
    </div>
  </div>
);

const DoctorDetails = ({ isOpen, onClose, doctor }) => {


  const [consultas, setConsultas] = useState([]);

  const fetchConsultas = async () => {
    try {
      const data = await getDatos(`/api/consultas?medicoId=${doctor.id}`);
      setConsultas(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  
  useEffect(() => {
    fetchConsultas();
  }, []);

  if (!doctor) return null;

  return (
    <SlideOverModal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles del Médico"
    >

      {/* Avatar and name */}
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold`}>
          <span className={{/*colors.textDark*/}}>
            {`${doctor.nombre.charAt(0)}${doctor.apellido.charAt(0)}`.toUpperCase()}
          </span>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {doctor.nombre} {doctor.apellido}
          </h2>
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 `}>
            {/*doctor.especialidades[0].nombre*/}
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="space-y-1 border-t border-b py-4">
        <DetailRow 
          icon={Mail} 
          label="Email" 
          value={doctor.email} 
        />
        <DetailRow 
          icon={Phone} 
          label="Teléfono" 
          value={doctor.telefono} 
        />
        <DetailRow 
          icon={MapPin} 
          label="Dirección" 
          value={doctor.direccion} 
        />
        <DetailRow 
          icon={Calendar} 
          label="Fecha de nacimiento" 
          value={new Date(doctor.fechaNac).toLocaleDateString()} 
        />
        <DetailRow 
          icon={Award} 
          label="DNI" 
          value={doctor.dni} 
        />
      </div>

      {/* Disponibility */}
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Disponibilidad
        </h3>
        {doctor.disponibilidades.map((disp, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4 mb-3">
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{disp.diaSemana}</span>
            </div>
            <p className="text-gray-600 mt-1">
              {disp.cubreTurno} ({disp.horaInicio} - {disp.horaFin})
            </p>
          </div>
        ))}
      </div>

      {/* Next turns */}
      
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Consultas del mes
        </h3>
        {consultas.map((consulta) => (
          <div key={consulta.codigo} className="bg-gray-50 rounded-lg p-4 mb-3">
            <p className="font-medium text-gray-900">
              {new Date(consulta.fecha).toLocaleDateString()} - {consulta.hora}
            </p>
          </div>
        ))}
      </div>
      
    </SlideOverModal>
  );
};

export default DoctorDetails;