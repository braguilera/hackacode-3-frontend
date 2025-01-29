import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PacientesTable = ({ pacientes }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = pacientes.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4">
      <motion.table className="w-full text-left rounded-lg overflow-hidden shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Nombre</th>
            <th className="p-3">Apellido</th>
            <th className="p-3">DNI</th>
            <th className="p-3">Fecha de Nacimiento</th>
            <th className="p-3">Email</th>
            <th className="p-3">Teléfono</th>
            <th className="p-3">Dirección</th>
            <th className="p-3">Obra Social</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((paciente, index) => (
            <motion.tr
              key={paciente.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="hover:bg-gray-50"
            >
              <td className="p-3">{paciente.nombre}</td>
              <td className="p-3">{paciente.apellido}</td>
              <td className="p-3">{paciente.dni}</td>
              <td className="p-3">{paciente.fecha_nac}</td>
              <td className="p-3">{paciente.email}</td>
              <td className="p-3">{paciente.telefono}</td>
              <td className="p-3">{paciente.direccion}</td>
              <td className="p-3">{paciente.tieneObraSocial ? 'Sí' : 'No'}</td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>

      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(pacientes.length / itemsPerPage) }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`mx-1 px-3 py-1 rounded-full ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PacientesTable;