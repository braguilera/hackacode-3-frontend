// Pacientes.jsx
import React, { useState } from 'react';
import { Users, Plus, Search } from 'lucide-react';
import TablePacientes from '../components/TablePacientes';
import FormPersona from '../components/FormPersona';
import { postDatos, putDatos } from '../api/crud';

const Pacientes = () => {
  const [showForm, setShowForm] = useState(false);
  const [pacienteToEdit, setPacienteToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0); // Estado para refrescar la tabla

  // Callback para editar desde la tabla
  const handleEditPaciente = (paciente) => {
    setPacienteToEdit(paciente);
    setShowForm(true);
  };

  // Callback para agregar paciente
  const handleAddPaciente = () => {
    setPacienteToEdit(null);
    setShowForm(true);
  };

  // Cierra el formulario
  const closeForm = () => {
    setShowForm(false);
    setPacienteToEdit(null);
  };

  // Solo para creación
  const handleSubmitPaciente = async (pacienteData) => {
    try {
      await postDatos('/api/pacientes', pacienteData, 'Error creando paciente');
      setRefreshKey(prev => prev + 1);
      setShowForm(false);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-6">
      {/* Header Section */}
      <div className="border-gray-200 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-800">Pacientes</h2>
          </div>
          <button 
            onClick={handleAddPaciente}
            className="flex items-center justify-end space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Agregar Paciente</span>
          </button>
        </div>
        {/* Input de búsqueda global */}
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

      {/* Tabla de Pacientes, se le pasa el refreshKey */}
      <div className="p-6 h-full overflow-hidden">
        <TablePacientes 
          refreshKey={refreshKey}
          searchTerm={searchTerm}
          onRefresh={() => setRefreshKey(prev => prev + 1)}
        />
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <FormPersona
            tipo="paciente"
            onClose={() => setShowForm(false)}
            onSubmit={handleSubmitPaciente}
          />
        </div>
      )}
    </div>
  );
};

export default Pacientes;
