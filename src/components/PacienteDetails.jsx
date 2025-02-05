import React from 'react';
import { Mail, Phone, Calendar, MapPin, Award, Check, X } from 'lucide-react';
import SlideOverModal from './SlideOverModal';

const DetailRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3 py-3">
        <Icon className="w-5 h-5 text-gray-400" />
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-gray-900">{value}</p>
        </div>
    </div>
);

const PacienteDetails = ({ isOpen, onClose, paciente, consultas, colors }) => {
    if (!paciente) return null;

    return (
    <SlideOverModal
        isOpen={isOpen}
        onClose={onClose}
        title="Detalles del Paciente"
    >
      {/* Avatar and name */}
        <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold ${colors.bgLight}`}>
                <span className={colors.textDark}>
                    {`${paciente.nombre.charAt(0)}${paciente.apellido.charAt(0)}`.toUpperCase()}
                </span>
            </div>
            <div>
                <h2 className="text-xl font-semibold text-gray-900">
                    {paciente.nombre} {paciente.apellido}
                </h2>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${paciente.tieneObraSocial ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'}`}>
                    {paciente.tieneObraSocial ? 'Con Obra Social' : 'Sin Obra Social'}
                </div>
            </div>
        </div>

        {/* Personal Information */}
        <div className="space-y-1 border-t border-b py-4">
            <DetailRow 
            icon={Mail} 
            label="Email" 
            value={paciente.email} 
            />
            <DetailRow 
            icon={Phone} 
            label="Teléfono" 
            value={paciente.telefono} 
            />
            <DetailRow 
            icon={MapPin} 
            label="Dirección" 
            value={paciente.direccion} 
            />
            <DetailRow 
            icon={Calendar} 
            label="Fecha de nacimiento" 
            value={new Date(paciente.fechaNac).toLocaleDateString()} 
            />
            <DetailRow 
            icon={Award} 
            label="DNI" 
            value={paciente.dni} 
            />
            <DetailRow 
            icon={paciente.tieneObraSocial ? Check : X} 
            label="Obra Social" 
            value={paciente.tieneObraSocial ? 'Sí' : 'No'} 
            />
        </div>

        {/* Medical Consultations */}
        {/*<div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
                Consultas
            </h3>
            {consultas.filter(consulta => consulta.paciente === paciente.id).map((consulta, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 mb-3">
                    <p className="font-medium text-gray-900">
                        {new Date(consulta.fecha).toLocaleDateString()} - {consulta.hora}
                    </p>
                    <p className="text-gray-600">{consulta.servicio.nombre}</p>
                    <p className="text-gray-600">{consulta.estado}</p>
                </div>
            ))}
        </div>*/}
    </SlideOverModal>
);
};

export default PacienteDetails;