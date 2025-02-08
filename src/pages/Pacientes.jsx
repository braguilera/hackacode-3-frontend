import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, RefreshCw } from 'lucide-react';
import TablePacientes from '../components/TablePacientes';
import { getDatos, deleteDatos, postDatos, putDatos } from '../api/crud';
import FormPersona from '../components/FormPersona';

const Pacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [pacienteToEdit, setPacienteToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPacientes = async () => {
    try {
      const data = await getDatos('/api/pacientes', 'Error cargando pacientes');
      setPacientes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

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
      await fetchPacientes();
      setShowForm(false);
    } catch (error) {
      console.error(error.message);
      throw error;
    } finally {
      setPacienteToEdit(null);
    }
  };

  const deletePaciente = async (e) => {
    try {
      await deleteDatos(`/api/pacientes/${e.id}`, 'Error eliminando paciente');
      await fetchPacientes();
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };

  const filteredPacientes = pacientes.filter(paciente =>
    Object.values(paciente).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto mt-4 max-w-2xl p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-blue-500" />
              <h1 className="text-2xl font-semibold text-gray-800">Gestión de Pacientes</h1>
            </div>
            <button 
              onClick={() => {
                setPacienteToEdit(null);
                setShowForm(true);
              }}
              className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Agregar Paciente</span>
            </button>
          </div>
          
          {/* Search and Refresh Section */}
          <div className="flex items-center space-x-2 mt-4">
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
            <button
              onClick={fetchPacientes}
              className="p-2 text-gray-500 hover:text-blue-500 rounded-lg hover:bg-gray-100 transition-colors"
              title="Actualizar lista"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="p-6">
          <TablePacientes 
            pacientes={filteredPacientes} 
            onEdit={handleEditPaciente} 
            onDelete={deletePaciente}
          />
        </div>
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