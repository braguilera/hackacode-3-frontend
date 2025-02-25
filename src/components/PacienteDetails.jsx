import React from 'react';
import { Mail, Phone, Calendar, MapPin, Check, X, Package, FileText, CalendarDays, Clock, CalendarX, IdCard } from 'lucide-react';
import SlideOverModal from './SlideOverModal';

const DetailRow = ({ icon: Icon, label, value }) => (
    <article className="flex items-center gap-3 py-3">
        <Icon className="w-5 h-5 text-gray-400" />
        <body>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-gray-900">{value}</p>
        </body>
    </article>
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
        <header className="flex items-center gap-4 mb-6">
            <section className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold}`}>
                <span className='text-black'>
                    {`${paciente.nombre.charAt(0)}${paciente.apellido.charAt(0)}`.toUpperCase()}
                </span>
            </section>
            <section>
                <h2 className="text-xl font-semibold text-gray-900">
                    {paciente.nombre} {paciente.apellido}
                </h2>
                <aside className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${paciente.tieneObraSocial ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'}`}>
                    {paciente.tieneObraSocial ? 'Con Obra Social' : 'Sin Obra Social'}
                </aside>
            </section>
        </header>

        {/* Personal Information */}
        <section className="space-y-1 border-t border-b py-4">
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
            icon={IdCard} 
            label="DNI" 
            value={paciente.dni} 
            />
            <DetailRow 
            icon={paciente.tieneObraSocial ? Check : X} 
            label="Obra Social" 
            value={paciente.tieneObraSocial ? 'Sí' : 'No'} 
            />
        </section>

        {/* Pacient's Medical Consultations */}
        <section>
            <header className="flex items-center justify-between py-4 rounded-lg">
                <aside className="flex gap-3 items-center justify-center">
                    <h3 className="text-lg font-medium text-gray-900">Consultas</h3>
                </aside>
            </header>

            {consultas.filter(consulta => consulta.pacienteId === paciente.id).length > 0 ? (
                <main className="space-y-4">
                {consultas.filter(consulta => consulta.pacienteId === paciente.id).map((consulta, index) => (
                    <section 
                    key={index} 
                    className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
                    >
                    <article className="flex justify-between items-start mb-3">
                        <header className="flex items-center gap-2 text-gray-600">
                            <CalendarDays className="h-4 w-4" />
                            <span>{new Date(consulta.fecha).toLocaleDateString()}</span>
                            <Clock className="h-4 w-4 ml-2" />
                            <span>{consulta.hora.slice(0, 5)}</span>
                        </header>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        consulta.estado === 'finalizado' ? 'bg-green-50 text-green-700' :
                        consulta.estado === 'pendiente' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-gray-50 text-gray-700'
                        }`}>
                            {consulta.estado}
                        </span>
                    </article>

                    <article className="space-y-3">
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
                    </article>
                    </section>
                ))}
                </main>
            ) : (
                <div className="text-center py-8 bg-white rounded-xl border border-gray-100">
                <CalendarX className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">El paciente no tiene consultas registradas.</p>
                </div>
            )}
        </section>
    </SlideOverModal>
);
};

export default PacienteDetails;