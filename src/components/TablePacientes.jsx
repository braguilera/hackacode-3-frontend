import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CircleCheck, X, Trash2, Edit3, ChevronRight, Search } from 'lucide-react';
import PacienteDetails from './PacienteDetails';


const PacientesTable = ({ pacientes, consultas, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterDNI, setFilterDNI] = useState('');
  const [selectedPaciente, setSelectedPaciente] = useState(null);

  const itemsPerPage = 10;

  // Asegurar que pacientes es un array válido
  const safePacientes = Array.isArray(pacientes) ? pacientes : [];
  const filteredPacientes = safePacientes.filter(paciente => paciente.dni?.startsWith(filterDNI));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPacientes.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleRowClick = (paciente) => setSelectedPaciente(paciente);
  const closeModal = () => setSelectedPaciente(null);

  const handleDelete = async (paciente) => {
    await onDelete(paciente);
  
    const updatedPacientes = safePacientes.filter(p => p.id !== paciente.id);
    const updatedFilteredPacientes = updatedPacientes.filter(p => p.dni?.startsWith(filterDNI));
  
    const totalPages = Math.ceil(updatedFilteredPacientes.length / itemsPerPage);
  
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(totalPages, 1));
    }
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
    <div className="p-4 w-full h-full bg-white rounded-3xl shadow-sm flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col h-full"
      >
        {/* Header */}
        <header className="flex w-full justify-between items-center mb-6">
          <h1 className="font-semibold text-gray-800 text-2xl">
            Tienes <span className="font-extrabold text-blue-600">{filteredPacientes.length}</span> pacientes
          </h1>
          <div className="relative w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl 
                       focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                       transition-all duration-200"
              placeholder="Buscar por DNI..."
              value={filterDNI}
              onChange={(e) => setFilterDNI(e.target.value)}
            />
          </div>
        </header>

        {/* Table Container with Flex-grow */}
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="rounded-xl overflow-hidden border border-gray-100 flex-1">
            {filteredPacientes.length > 0 ? (
              <div className="overflow-auto h-full">
                <table className="w-full">
                  <thead className="sticky top-0 bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-left">Nombre Completo</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-left">DNI</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-left">Fecha de Nacimiento</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-left">Email</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-left">Teléfono</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-left">Dirección</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-left">Obra Social</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentItems.map((paciente, index) => (
                      <motion.tr
                        key={paciente.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="group hover:bg-blue-50/50 cursor-pointer"
                        onClick={() => handleRowClick(paciente)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {paciente.nombre[0]}{paciente.apellido[0]}
                              </span>
                            </div>
                            <span className="font-medium text-gray-800">
                              {paciente.nombre} {paciente.apellido}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{paciente.dni}</td>
                        <td className="px-6 py-4 text-gray-600">{paciente.fechaNac}</td>
                        <td className="px-6 py-4 text-gray-600">{paciente.email}</td>
                        <td className="px-6 py-4 text-gray-600">{paciente.telefono}</td>
                        <td className="px-6 py-4 text-gray-600">{paciente.direccion}</td>
                        <td className="px-6 py-4">
                          {paciente.tieneObraSocial ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-sm font-medium text-green-700">
                              <CircleCheck size={14} /> Sí
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-sm font-medium text-gray-600">
                              <X size={14} /> No
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 rounded-full hover:bg-white text-gray-600 hover:shadow-sm transition-all"
                              onClick={(e) => { e.stopPropagation(); onEdit(paciente); }}
                            >
                              <Edit3 size={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 rounded-full hover:bg-white text-gray-600 hover:text-red-500 hover:shadow-sm transition-all"
                              onClick={(e) => { e.stopPropagation(); handleDelete(paciente); }}
                            >
                              <Trash2 size={16} />
                            </motion.button>
                            <ChevronRight size={16} className="text-gray-400 ml-2" />
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-500 text-lg">No hay pacientes registrados.</p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination - Now properly contained */}
        {filteredPacientes.length > itemsPerPage && (
          <div className="pt-6 pb-2">
            <div className="flex justify-center gap-2">
              {Array.from({ length: Math.ceil(filteredPacientes.length / itemsPerPage) }, (_, i) => (
                <motion.button
                  key={i + 1}

                  onClick={() => paginate(i + 1)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    currentPage === i + 1
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 '
                  }`}
                >
                  {i + 1}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    
      {/* Modal */}
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