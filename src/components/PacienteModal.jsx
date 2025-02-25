import React from 'react';
import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

const PacienteModal = ({ paciente, consultas, onClose }) => {
  return (
    <main className="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-start" onClick={onClose}>
      <motion.article
        className="bg-white rounded-lg shadow-lg w-1/3 h-screen p-6 overflow-y-auto"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Detalles del Paciente</h2>
        <section className="space-y-4">
          <article>
            <p><strong>Nombre:</strong> {paciente.nombre}</p>
            <p><strong>Apellido:</strong> {paciente.apellido}</p>
            <p><strong>DNI:</strong> {paciente.dni}</p>
            <p><strong>Fecha de Nacimiento:</strong> {paciente.fecha_nac}</p>
            <p><strong>Email:</strong> {paciente.email}</p>
            <p><strong>Teléfono:</strong> {paciente.telefono}</p>
            <p><strong>Dirección:</strong> {paciente.direccion}</p>
            <p><strong>Obra Social:</strong> {paciente.tieneObraSocial ? <Check className="text-green-500 inline" /> : <X className="text-red-500 inline" />}</p>
          </article>
          <article>
            <h3 className="text-lg font-bold mb-2">Consultas</h3>
            {consultas.filter(consulta => consulta.paciente === paciente.id).map(consulta => (
              <main key={consulta.codigo} className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p><strong>Fecha:</strong> {consulta.fecha}</p>
                <p><strong>Hora:</strong> {consulta.hora}</p>
                <p><strong>Servicio:</strong> {consulta.servicio.nombre}</p>
                <p><strong>Estado:</strong> {consulta.estado}</p>
              </main>
            ))}
          </article>
        </section>
        <button onClick={onClose} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Cerrar</button>
      </motion.article>
    </main>
  );
};

export default PacienteModal;