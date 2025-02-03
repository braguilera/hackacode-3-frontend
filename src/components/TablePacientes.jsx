import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CircleCheck, X, Trash2, Edit3 } from 'lucide-react';
import PacienteDetails from './PacienteDetails';

const PacientesTable = ({ pacientes, consultas, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterDNI, setFilterDNI] = useState('');
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredPacientes = pacientes.filter(paciente => paciente.dni.startsWith(filterDNI));
  const currentItems = filteredPacientes.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleRowClick = (paciente) => {
    setSelectedPaciente(paciente);
  };

  const closeModal = () => {
    setSelectedPaciente(null);
  };

  const colors = {
    bgLight: 'bg-blue-100',
    textDark: 'text-blue-800',
    badge: 'bg-blue-200 text-blue-800',
    hoverBg: 'hover:bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-500',
    button: {
      primary: 'bg-blue-500 text-white hover:bg-blue-600',
      secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    },
  };

  return (
    <div className="p-4 w-full h-[90%] bg-white rounded-3xl shadow-sm flex flex-col justify-between">
      <main className="w-full flex flex-col">
        <header className="flex w-full justify-between mb-6">
          <h1 className="font-semibold text-slate-600 text-2xl">
            Tienes <span className="font-extrabold text-blue-600">{filteredPacientes.length}</span> pacientes en total
          </h1>
          <input
            className="bg-slate-100 w-1/3 h-10 border-2 border-slate-200 px-4 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-200"
            placeholder="Filtrar por DNI"
            value={filterDNI}
            onChange={(e) => setFilterDNI(e.target.value)}
          />
        </header>

        <motion.table className="w-full text-left rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-blue-50 text-slate-600">
            <tr>
              <th className="p-4 font-semibold">Nombre Completo</th>
              <th className="p-4 font-semibold">DNI</th>
              <th className="p-4 font-semibold">Fecha de Nacimiento</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Teléfono</th>
              <th className="p-4 font-semibold">Dirección</th>
              <th className="p-4 font-semibold">Obra Social</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((paciente, index) => (
              <motion.tr
                key={paciente.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`${index % 2 !== 0 ? 'bg-gray-50' : 'bg-white'} cursor-pointer hover:bg-blue-50 transition-colors duration-200 group`}
                onClick={() => handleRowClick(paciente)}
              >
                <td className="p-4">{paciente.nombre} {paciente.apellido}</td>
                <td className="p-4">{paciente.dni}</td>
                <td className="p-4">{paciente.fecha_nac}</td>
                <td className="p-4">{paciente.email}</td>
                <td className="p-4">{paciente.telefono}</td>
                <td className="p-4">{paciente.direccion}</td>
                <td className="p-4">
                  {paciente.tieneObraSocial ? (
                    <span className="bg-green-100 flex items-center gap-1 py-1 px-4 rounded-full text-sm font-semibold text-green-700">
                      <CircleCheck size={16} className="text-green-600" /> Sí
                    </span>
                  ) : (
                    <span className="bg-gray-100 flex items-center gap-1 py-1 px-3 rounded-full text-sm font-semibold text-gray-600">
                      <X size={16} className="text-gray-500" /> No
                    </span>
                  )}
                </td>
                {/* Botones de editar y borrar */}
                <td className="p-4">
                  <aside className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 shadow-sm"
                      onClick={(e) => { e.stopPropagation(); onEdit(paciente); }}
                    >
                      <Edit3 size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="p-1.5 rounded-full hover:bg-red-50 text-gray-600 hover:text-red-500 shadow-sm"
                      onClick={(e) => { e.stopPropagation(); onDelete(paciente); }}
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </aside>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </main>

      <div className="flex justify-center mt-6">
        {Array.from({ length: Math.ceil(filteredPacientes.length / itemsPerPage) }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`mx-1 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              currentPage === i + 1
                ? 'text-gray-600 border border-gray-600 cursor-default'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {selectedPaciente && (
        <PacienteDetails
          isOpen={!!selectedPaciente}
          onClose={closeModal}
          paciente={selectedPaciente}
          consultas={consultas}
          colors={colors}
        />
      )}
    </div>
  );
};

export default PacientesTable;