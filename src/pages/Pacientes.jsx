import React, { useState, useEffect } from 'react';
import TablePacientes from '../components/TablePacientes';
import { getDatos, deleteDatos, postDatos } from '../api/crud';
import FormPersona from '../components/FormPersona'

const Pacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchPacientes = async () => {
    try {
      const data = await getDatos('/api/pacientes', 'Error cargando pacientes');
      setPacientes(data);
      console.log(pacientes)
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  const editPaciente = () => alert("editado");


  const deletePaciente = async (e) => {
    try {
      await deleteDatos(`/api/pacientes/${e.id}`, 'Error eliminando paciente');
      await fetchPacientes();
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };

  const addPaciente = async (pacienteData) =>{
    try {
      await postDatos('/api/pacientes', pacienteData, 'Error creando médico');
      await fetchPacientes();
      setShowForm(false);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  

  if (loading) return <div>Cargando pacientes...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='w-full flex flex-col justify-center items-center box-border mx-10'>
    <button onClick={() => setShowForm(true)}>AGREGAR pacientes</button>

      <TablePacientes 
        pacientes={pacientes} 
        onEdit={editPaciente} 
        onDelete={deletePaciente}
      />

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <FormPersona
            tipo="paciente"
            onClose={() => setShowForm(false)}
            onSubmit={addPaciente}
          />
        </div>
      )}
    </div>
  );
};

export default Pacientes;