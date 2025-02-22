// Pacientes.jsx
import React, { useEffect, useState } from 'react';
import { Users, Plus, Search } from 'lucide-react';
import TablePacientes from '../components/TablePacientes';
import FormPersona from '../components/FormPersona';
import { getDatos, postDatos, putDatos } from '../api/crud';
import Notification from '../components/Notification';

const Pacientes = () => {
  const [showForm, setShowForm] = useState(false);
  const [pacienteToEdit, setPacienteToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [messageNotification, setMessageNotification] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [consultas, setConsultas] = useState([]);

  const fetchPacientes = async () => {
    try {
      const data = await getDatos('/api/pacientes');
      setPacientes(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchConsultas = async () => {
    try {
      const data = await getDatos('/api/consultas');
      setConsultas(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchPacientes();
    fetchConsultas();
  }, []);

  const handleAddPaciente = () => {
    setPacienteToEdit(null);
    setShowForm(true);
  };

  const handleSubmitPaciente = async (pacienteData) => {
    try {
      await postDatos('/api/pacientes', pacienteData, 'Error creando paciente');
      setRefreshKey(prev => prev + 1);

      setMessageNotification({
        type: 'success',
        text: 'Paciente creado exitosamente'
      });
      setShowNotification(true)
    } catch (error) {
      setMessageNotification({
        type: 'error',
        text: 'Error al crear el paciente'
      });
      setShowNotification(true)
    }finally{
      setShowForm(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-6 ">
      {/* Header Section */}
      <div className="border-gray-200 px-6 ">
        <div className="flex items-center justify-between relative">
          <header className='flex flex-col justify-between mb-6'>
            <div className='flex gap-2'>

              <h2 className="text-2xl font-bold text-gray-800">Pacientes
                <span className='text-gray-400 font-normal ml-2 text-lg'>({pacientes.length} registrados)</span>
              </h2>
            </div>
              <p className='text-gray-500 mt-1'>Gestiona la información de tus pacientes</p>
            <button 
              onClick={handleAddPaciente}
              className="flex items-center justify-end space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors absolute right-0 top-0"
            >
              <Plus className="h-4 w-4" />
              <span>Agregar Paciente</span>
            </button>
          </header>
        </div>
      </div>

      {/* Tabla de Pacientes, se le pasa el refreshKey */}
      <div className="p-6 h-full overflow-hidden">
        <TablePacientes 
          refreshKey={refreshKey}
          searchTerm={searchTerm}
          onRefresh={() => setRefreshKey(prev => prev + 1)}
          consultas={consultas}
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

      <Notification
        message={messageNotification}
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
};

export default Pacientes;
