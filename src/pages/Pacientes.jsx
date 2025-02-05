import React, { useState, useEffect } from 'react';
import TablePacientes from '../components/TablePacientes';
import { getDatos, deleteDatos, postDatos, putDatos } from '../api/crud';
import FormPersona from '../components/FormPersona'

const Pacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [pacienteToEdit, setPacienteToEdit] = useState(null);

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
        await fetchPacientes();
        } else {
        await postDatos('/api/pacientes', pacienteData, 'Error creando médico');
        await fetchPacientes();
        setShowForm(false);
      }
    } catch (error) {
      console.error(error.message);
      throw error;
    } finally {
      setPacienteToEdit(null);
      setShowForm(false);
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

  if (loading) return <div>Cargando pacientes...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='w-full flex flex-col justify-center items-center box-border mx-10'>
    <button 
        onClick={() => {
          setPacienteToEdit(null);
          setShowForm(true);
        }}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Agregar Paciente
      </button>

      <TablePacientes 
        pacientes={pacientes} 
        onEdit={handleEditPaciente} 
        onDelete={deletePaciente}
      />

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
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