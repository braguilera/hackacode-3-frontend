import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CircleCheck , X } from 'lucide-react';
import PacienteDetails from './PacienteDetails';

const PacientesTable = ({ pacientes, consultas }) => {
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
    <div className="p-4 w-full h-[87%] bg-white py-10 rounded-3xl flex flex-col justify-between">
      <main className='w-full flex flex-col'>

      <header className='flex w-full justify-between mb-4'>
        <h1 className='font-semibold text-slate-500 text-2xl '>Tienes <span className='font-extrabold text-slate-600'>{filteredPacientes.length}</span> pacientes en total</h1>
        <input
          className='bg-slate-100 w-1/3 h-auto border-2 border-slate-300 px-2 rounded-xl self-center'
          placeholder="Filtrar por DNI"
          value={filterDNI}
          onChange={(e) => setFilterDNI(e.target.value)}
        />
      </header>
      <motion.table className="text-left rounded-lg overflow-hidden">
        <thead className="bg-blue-50 text-slate-500">
          <tr>
            <th className="p-3">Nombre Completo</th>
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
              className={`${(index % 2 !== 0) ? 'bg-gray-50' : 'bg-white'} select-none cursor-pointer hover:bg-slate-200 transition-all duration-200`}
              onClick={() => handleRowClick(paciente)}
            >
              <td className="p-3">{paciente.nombre} {paciente.apellido}</td>
              <td className="p-3">{paciente.dni}</td>
              <td className="p-3">{paciente.fecha_nac}</td>
              <td className="p-3">{paciente.email}</td>
              <td className="p-3">{paciente.telefono}</td>
              <td className="p-3">{paciente.direccion}</td>
              <td className="p-3 flex justify-left">
                {paciente.tieneObraSocial ? (
                  <span className='bg-green-200 flex py-1 gap-1 px-2 rounded-sm font-semibold text-green-600'><CircleCheck  className="text-green-600" />Sí</span>
                  
                ) : (
                  <span className='bg-gray-200 py-1 px-2 rounded-sm font-semibold text-gray-600'>No</span>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
      </main>

      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(filteredPacientes.length / itemsPerPage) }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`mx-1 px-3 py-1 rounded-full ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
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