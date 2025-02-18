import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, RefreshCw } from 'lucide-react';
import TablePacientes from '../components/TablePacientes';
import { getDatos, deleteDatos, postDatos, putDatos } from '../api/crud';
import FormPersona from '../components/FormPersona';
import LoadingIndicator from '../components/LoadingIndicator';
import EmptyState from '../components/EmptyState';

const Pacientes = () => {
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pacienteToEdit, setPacienteToEdit] = useState(null);

  const handleEditPaciente = (paciente) => {
    setPacienteToEdit(paciente);
    setShowForm(true);
  };

  const handleSubmitPaciente = async (pacienteData) => {
    try {
      if (pacienteToEdit) {
        await putDatos(`/api/pacientes/${pacienteToEdit.id}`, pacienteData, 'Error actualizando paciente');
      } else {
        await postDatos('/api/pacientes', pacienteData, 'Error creando médico');
      }
      //await fetchPacientes();
      setShowForm(false);
    } catch (error) {
      console.error(error.message);
      throw error;
    } finally {
      setPacienteToEdit(null);
    }
  };

  if (error) {
    return (
      <div className="mx-auto mt-4 max-w-2xl p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col p-6">
      {/* Header Section */}
      <div className="border-gray-200 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-800">
              Pacientes
            </h2>
          </div>
          <button 
            onClick={() => {
              setPacienteToEdit(null);
              setShowForm(true);
            }}
            className="flex items-center justify-end space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Agregar Paciente</span>
          </button>
        </div>
        {/* Puedes agregar un input global de búsqueda si lo deseas */}
        <div className="flex items-center w-full justify-between space-x-2 mt-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar pacientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

              {/* Table Section */}
        <div className="p-6 h-full overflow-hidden">
            <TablePacientes 
              consultas={[]} 
              onEdit={handleEditPaciente} 
              searchTerm={searchTerm}
            />
            
        </div>


      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <FormPersona
            tipo="paciente"
            onClose={() => {
              setPacienteToEdit(null);
              setShowForm(false);
            }}
            onSubmit={handleSubmitPaciente}
            initialData={pacienteToEdit}
            isEditing={!!pacienteToEdit}
          />
        </div>
      )}
    </div>
  );
};

export default Pacientes;



