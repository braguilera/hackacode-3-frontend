import React from 'react';
import { Mail, Phone, Calendar, MapPin, Award, Check, X, Package, FileText, ClipboardList, CalendarDays, Clock, CalendarX } from 'lucide-react';
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

    console.log(consultas)

    return (
    <SlideOverModal
        isOpen={isOpen}
        onClose={onClose}
        title="Detalles del Paciente"
    >
      {/* Avatar and name */}
        <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold}`}>
                <span className='text-black'>
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

        {/* Pacient's Medical Consultations */}
        <div className="mt-6">
            <div className="flex items-center gap-3 mb-6 bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg">
                <ClipboardList className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">Consultas</h3>
            </div>

            {consultas.filter(consulta => consulta.pacienteId === paciente.id).length > 0 ? (
                <div className="space-y-4">
                {consultas.filter(consulta => consulta.pacienteId === paciente.id).map((consulta, index) => (
                    <div 
                    key={index} 
                    className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2 text-gray-600">
                        <CalendarDays className="h-4 w-4" />
                        <span>{new Date(consulta.fecha).toLocaleDateString()}</span>
                        <Clock className="h-4 w-4 ml-2" />
                        <span>{consulta.hora}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        consulta.estado === 'COMPLETADA' ? 'bg-green-50 text-green-700' :
                        consulta.estado === 'PENDIENTE' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-gray-50 text-gray-700'
                        }`}>
                        {consulta.estado}
                        </span>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                        {consulta.servicioMedico.tipoServicio === "PAQUETE" ? (
                            <>
                            <Package className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                                Paquete
                            </span>
                            </>
                        ) : (
                            <>
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                                Servicio
                            </span>
                            </>
                        )}
                        </div>

                        <p className="text-gray-700">{consulta.servicioMedico.nombre}</p>
                    </div>
                    </div>
                ))}
                </div>
            ) : (
                <div className="text-center py-8 bg-white rounded-xl border border-gray-100">
                <CalendarX className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">El paciente no tiene consultas registradas.</p>
                </div>
            )}
            </div>
    </SlideOverModal>
);
};

export default PacienteDetails;