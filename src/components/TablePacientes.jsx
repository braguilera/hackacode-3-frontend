// TablePacientes.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CircleCheck, X, Trash2, Edit3, ChevronRight, Search } from 'lucide-react';
import PacienteDetails from './PacienteDetails';
import LoadingIndicator from './LoadingIndicator';
import { getDatos, deleteDatos, putDatos } from '../api/crud';
import EmptyState from './EmptyState';
import PopUpConfirmation from './PopUpConfirmation';
import FormPersona from './FormPersona';
import Notification from './Notification';

const TablePacientes = ({ consultas, onEdit, searchTerm, refreshKey }) => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterDNI, setFilterDNI] = useState('');
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [showEditForm, setShowEditForm] = useState(false);
  const [pacienteToEdit, setPacienteToEdit] = useState(null);
  const [selectedToDelete, setSelectedToDelete] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [messageNotification, setMessageNotification] = useState(null);

  const fetchPacientes = async () => {
    try {
      const data = await getDatos('/api/pacientes');
      setPacientes(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, [refreshKey]);

  const handleEditConfirm = async () => {
    try {
      await putDatos(
        `/api/pacientes/${pacienteToEdit.id}`, 
        pacienteToEdit.formData,
        'Error actualizando paciente'
      );
      fetchPacientes();
      setMessageNotification({
        type: 'success',
        text: 'Paciente actualizado exitosamente'
      });
      setShowNotification(true)
    } catch (error) {
      setMessageNotification({
        type: 'error',
        text: 'Error al editar el paciente'
      });
      setShowNotification(true)
    }finally{
      setPacienteToEdit(null);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteDatos(`/api/pacientes/${selectedToDelete.id}`);
      fetchPacientes();
      setMessageNotification({
        type: 'success',
        text: 'Paciente eliminado exitosamente'
      });
      setShowNotification(true)
    } catch (error) {
      setMessageNotification({
        type: 'error',
        text: 'Error al eliminar el paciente'
      });
      setShowNotification(true)
    }finally{
      setSelectedToDelete(null);
    }
  };


  // Filtrar pacientes: por DNI y búsqueda global
  const safePacientes = Array.isArray(pacientes) ? pacientes : [];
  const filteredPacientes = safePacientes.filter(paciente => {
    const matchDNI = paciente.dni?.startsWith(filterDNI);
    const matchGlobal = Object.values(paciente)
      .some(value => value?.toString().toLowerCase().includes(searchTerm.toLowerCase()));
    return matchDNI && matchGlobal;
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPacientes.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleRowClick = (paciente) => setSelectedPaciente(paciente);
  const closeModal = () => setSelectedPaciente(null);

  return (
    <div className="p-4 w-full h-full bg-white rounded-3xl shadow-sm flex flex-col">

{pacienteToEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <PopUpConfirmation 
            isOpen={true}
            onConfirm={handleEditConfirm}
            onCancel={() => setPacienteToEdit(null)}
            itemId={pacienteToEdit.id}
            isDelete={false}
          />
        </div>
      )}

      {selectedToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <PopUpConfirmation 
            isOpen={true}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setSelectedToDelete(null)}
            itemId={selectedToDelete.id}
            isDelete={true}
          />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col h-full"
      >
        {/* Header interno de la tabla (buscador por DNI) */}
        <header className="flex w-full justify-between items-center mb-6">
          <div className="relative w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Buscar por DNI..."
              value={filterDNI}
              onChange={(e) => setFilterDNI(e.target.value)}
            />
          </div>
        </header>

        {/* Contenedor de la tabla */}
        <div className="flex-1 flex flex-col">
          <div className="rounded-xl border border-gray-100 flex-1 h-full">
            <div className="h-auto">
              <table className="w-full h-full table-fixed">
                <thead className="sticky top-0 bg-gray-50">
                  <tr>
                    <th className="w-64 px-6 py-4 text-sm font-semibold text-gray-600 text-left">Nombre Completo</th>
                    <th className="w-32 px-6 py-4 text-sm font-semibold text-gray-600 text-right">DNI</th>
                    <th className="w-40 px-6 py-4 text-sm font-semibold text-gray-600 text-left">Fecha de Nac.</th>
                    <th className="w-64 px-6 py-4 text-sm font-semibold text-gray-600 text-left">Email</th>
                    <th className="w-40 px-6 py-4 text-sm font-semibold text-gray-600 text-left">Teléfono</th>
                    <th className="w-64 px-6 py-4 text-sm font-semibold text-gray-600 text-left">Dirección</th>
                    <th className="w-32 px-6 py-4 text-sm font-semibold text-gray-600 text-left">Obra Social</th>
                    <th className="w-24 px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="relative w-full h-full">
                  {loading ? (
                    Array.from({ length: 8 }).map((_, index) => (
                      <motion.tr key={index}>
                        <td className="w-64 px-6 py-4"><LoadingIndicator width={"w-64"} /></td>
                        <td className="w-32 px-6 py-4 text-gray-600 text-right"><LoadingIndicator width={"w-32"} /></td>
                        <td className="w-40 px-6 py-4 text-gray-600"><LoadingIndicator width={"w-40"} /></td>
                        <td className="w-64 px-6 py-4 text-gray-600 truncate"><LoadingIndicator width={"w-64"} /></td>
                        <td className="w-40 px-6 py-4 text-gray-600"><LoadingIndicator width={"w-40"} /></td>
                        <td className="w-64 px-6 py-4 text-gray-600 truncate"><LoadingIndicator width={"w-64"} /></td>
                        <td className="w-32 px-6 py-4"><LoadingIndicator width={"w-32"} /></td>
                        <td className="w-24 px-6 py-4">
                          <div className="flex items-center justify-end gap-2 opacity-0">
                            <motion.button className="p-2 rounded-full hover:bg-white text-gray-600">
                              <Edit3 size={16} />
                            </motion.button>
                            <motion.button className="p-2 rounded-full hover:bg-white text-gray-600">
                              <Trash2 size={16} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : filteredPacientes.length === 0 ? (
                    <tr className="absolute top-40 left-1/2 -translate-x-1/2">
                      <EmptyState type="pacientes" />
                    </tr>
                  ) : (
                    currentItems.map((paciente, index) => (
                      <motion.tr
                        key={paciente.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="group hover:bg-blue-50/50 cursor-pointer"
                        onClick={() => handleRowClick(paciente)}
                      >
                        <td className="w-64 px-6 py-4">
                          <div className="flex items-center gap-3 truncate">
                            <span className="font-medium text-gray-800">
                              {paciente.nombre} {paciente.apellido}
                            </span>
                          </div>
                        </td>
                        <td className="w-32 px-6 py-4 text-gray-600 text-right">
                          {paciente.dni}
                        </td>
                        <td className="w-40 px-6 py-4 text-gray-600">
                          {paciente.fechaNac}
                        </td>
                        <td className="w-64 px-6 py-4 text-gray-600 truncate">
                          {paciente.email}
                        </td>
                        <td className="w-40 px-6 py-4 text-gray-600">
                          {paciente.telefono}
                        </td>
                        <td className="w-64 px-6 py-4 text-gray-600 truncate">
                          {paciente.direccion}
                        </td>
                        <td className="w-32 px-6 py-4">
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
                        <td className="w-24 px-6 py-4">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button
          onClick={(e) => {
            e.stopPropagation();
            setPacienteToEdit(paciente);
            setShowEditForm(true);
          }}
        >
          <Edit3 size={16} />
        </motion.button>

        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedToDelete(paciente);
          }}
        >
          <Trash2 size={16} />
        </motion.button>
                            <ChevronRight size={16} className="text-gray-400 ml-2" />
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {(filteredPacientes.length > itemsPerPage && !loading) && (
          <div className="pt-6 pb-2">
            <div className="flex justify-center gap-2">
              {Array.from({ length: Math.ceil(filteredPacientes.length / itemsPerPage) }, (_, i) => (
                <motion.button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    currentPage === i + 1
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {showEditForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <FormPersona
            tipo="paciente"
            onClose={() => setShowEditForm(false)}
            onSubmit={(formData) => {
              setPacienteToEdit(prev => ({ ...prev, formData }));
              setShowEditForm(false);
            }}
            initialData={pacienteToEdit}
            isEditing={true}
          />
        </div>
      )}

      {/* Modal de detalles (opcional) */}
      {selectedPaciente && (
        <PacienteDetails
          isOpen={!!selectedPaciente}
          onClose={closeModal}
          paciente={selectedPaciente}
          consultas={consultas}
        />
      )}

      <Notification
        message={messageNotification}
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
};

export default TablePacientes;
