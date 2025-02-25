import React, { useEffect, useState } from 'react';
import { Phone, Mail, Calendar, MapPin, Clock, Package, FileText, DollarSign, CalendarX, CalendarDays, IdCard } from 'lucide-react';
import SlideOverModal from './SlideOverModal';
import { getDatos } from '../api/crud';

const DetailRow = ({ icon: Icon, label, value }) => (
  <article className="flex items-center gap-3 py-3">
    <Icon className="w-5 h-5 text-gray-400" />
    <footer>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-gray-900">{value}</p>
    </footer>
  </article>
);

const DoctorDetails = ({ isOpen, onClose, doctor }) => {
  const [consultas, setConsultas] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  
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
  
  const filteredConsultas = consultas.filter((consulta) => {
    const fecha = new Date(consulta.fecha);
    return fecha.getMonth() + 1 === Number(selectedMonth) &&
          fecha.getFullYear() === Number(selectedYear);
  });

  if (!doctor) return null;

  return (
    <SlideOverModal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles del Médico"
    >

      {/* Avatar and name */}
      <header className="flex items-center gap-4 mb-6">
        <section className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold`}>
          <span >
            {`${doctor.nombre.charAt(0)}${doctor.apellido.charAt(0)}`.toUpperCase()}
          </span>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            {doctor.nombre} {doctor.apellido}
          </h2>
          <aside className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 `}>
            {doctor.especialidad.nombre}
          </aside>
        </section>
      </header>

      {/* Personal Information */}
      <main className="space-y-1 border-t border-b py-4">
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
          icon={IdCard} 
          label="DNI" 
          value={doctor.dni} 
        />
      </main>

      {/* Disponibility */}
      <section className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Disponibilidad
        </h3>
        {doctor.disponibilidades.map((disp, index) => (
          <article key={index} className="bg-gray-50 rounded-lg p-4 mb-3">
            <header className="flex items-center gap-2 text-gray-700">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{disp.diaSemana}</span>
            </header>
            <p className="text-gray-600 mt-1">
              {disp.cubreTurno} ({disp.horaInicio} - {disp.horaFin})
            </p>
          </article>
        ))}
      </section>

      {/* Consultas */}
      
      <section className="mt-6 border-t">
        <article className="flex items-center justify-between py-4 rounded-lg">
          <main className="flex gap-3 items-center justify-center">
            <h3 className="text-lg font-medium text-gray-900">Consultas</h3>
            <select
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-600"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {Array.from({ length: 12 }).map((_, i) => {
                const monthNumber = i + 1;
                const monthName = new Date(0, i).toLocaleString('default', { month: 'long' });
                return (
                  <option key={i} value={monthNumber}>
                    {monthName}
                  </option>
                );
              })}
            </select>
            <select
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-600"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {Array.from({ length: 5 }).map((_, i) => {
                const year = new Date().getFullYear() - 2 + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </main>
        </article>

        {filteredConsultas.length > 0 ? (
          <article className="space-y-4">
            {filteredConsultas.map((consulta) => (
              <main 
                key={consulta.codigo} 
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
              >
                <header className="flex justify-between items-start mb-3">
                  <p className="font-semibold text-gray-900">
                    Consulta #{consulta.codigo}
                  </p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    consulta.estado === 'finalizado' ? 'bg-green-50 text-green-700' :
                    consulta.estado === 'pendiente' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-gray-50 text-gray-700'
                  }`}>
                    {consulta.estado}
                  </span>
                </header>
                
                <section className="space-y-3">
                  <header className="flex items-center gap-2 text-gray-600">
                    <CalendarDays className="h-4 w-4" />
                    <span>{new Date(consulta.fecha).toLocaleDateString()}</span>
                    <Clock className="h-4 w-4 ml-2" />
                    <span>{consulta.hora.slice(0, 5)}</span>
                  </header>

                  <article className="flex items-center gap-2">
                    {consulta.servicioMedico.tipoServicio === "PAQUETE" ? (
                      <Package className="h-4 w-4 text-blue-500" />
                    ) : (
                      <FileText className="h-4 w-4 text-blue-500" />
                    )}
                    <span className="text-sm font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                      {consulta.servicioMedico.tipoServicio}
                    </span>
                  </article>

                  <p className="text-gray-700">{consulta.servicioMedico.nombre}</p>
                  
                  <footer className="flex items-center gap-2 text-gray-700">
                    <DollarSign className="w-4 h-4" />
                    <span>{consulta.servicioMedico.precio}</span>
                  </footer>
                </section>
              </main>
            ))}
          </article>
        ) : (
          <article className="text-center py-8 bg-white rounded-xl border border-gray-100">
            <CalendarX className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No hay consultas para el mes seleccionado.</p>
          </article>
        )}
      </section>
      
    </SlideOverModal>
  );
};

export default DoctorDetails;