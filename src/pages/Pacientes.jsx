import React, { useState, useEffect } from 'react';
import TablePacientes from '../components/TablePacientes';
import { getDatos, deleteDatos, postDatos } from '../api/crud';

const Pacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pacienteData, setPacienteData] = useState(
    {
      "nombre": "Nahir",
      "apellido":"Abregu",
      "dni": "123",
      "fechaNac": "2025-02-04",
      "email": "string@gmail.com",
      "telefono": "22334455",
      "direccion": "casua 123",
      "tieneObraSocial": true
    }
  );

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

  // Obtener pacientes al montar el componente
  useEffect(() => {
    fetchPacientes();
  }, []);

  const editPaciente = () => alert("editado");


  const deletePaciente = async (e) => {
    try {
      await deleteDatos(`/api/pacientes/${e.id}`, 'Error eliminando paciente');
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };

  const addPaciente = async () =>{
    try {
      const response = await postDatos('/api/pacientes', pacienteData, 'Error creando médico');

      const data = await response.json();
      fetchPacientes();
      setPacienteData(prevPacientes => [...prevPacientes, data]);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  } 

  if (loading) return <div>Cargando pacientes...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='w-full flex flex-col justify-center items-center box-border mx-10'>
    <button onClick={addPaciente}>AGREGAR pacientes</button>

      <TablePacientes 
        pacientes={pacientes} 
        onEdit={editPaciente} 
        onDelete={deletePaciente}
      />

    </div>
  );
};

export default Pacientes;