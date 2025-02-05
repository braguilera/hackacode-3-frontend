import React, { useEffect, useState } from 'react'
import CardMedico from '../components/CardMedico'
import { deleteDatos, getDatos, postDatos, putDatos } from '../api/crud';
import FormPersona from '../components/FormPersona';


const Medicos = () => {
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [medicoToEdit, setMedicoToEdit] = useState(null);       

    const fetchMedicos = async () => {
      try {
        const data = await getDatos('/api/medicos', 'Error cargando medicos');
        setMedicos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchMedicos();
    }, []);

  const deleteMedic = async (e) => {
  try {
    await deleteDatos(`/api/medicos/${e.id}`, 'Error eliminando paciente');
    await fetchMedicos();
  } catch (error) {
    console.error(error.message);
    throw error;
  }
  };

    const handleSubmitMedico = async (medicoData) => {
      try {
        if (medicoToEdit) {
          await putDatos(`/api/medicos/${medicoToEdit.id}`, medicoData, 'Error actualizando medico');
          await fetchMedicos();
          } else {
          await postDatos('/api/medicos', medicoData, 'Error creando médico');
          await fetchMedicos();
          setShowForm(false);
        }
      } catch (error) {
        console.error(error.message);
        throw error;
      } finally {
        setMedicoToEdit(null);
        setShowForm(false);
      }
    };

  const handleEditPaciente = (medico) => {
    setMedicoToEdit(medico);
    setShowForm(true);
  };


  return (
    <main className='flex w-full  '>
    <button 
        onClick={() => {
          setMedicoToEdit(null);
          setShowForm(true);
        }}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Agregar Medico
      </button>
    <div className="w-full p-6 grid grid-rows-none sm:grid-rows-5 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" >
      {medicos.map(medico => (
        <CardMedico dataMedico={medico} key={medico.id} onEdit={handleEditPaciente} onDelete={deleteMedic}></CardMedico>
      ))}
    </div>


    {showForm && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
    <FormPersona
            tipo="medico"
            onClose={() => {
              setMedicoToEdit(null);
              setShowForm(false);
            }}
            onSubmit={handleSubmitMedico}
            initialData={medicoToEdit}
            isEditing={!!medicoToEdit}
          />
        </div>
)}

    </main>
  )
}

export default Medicos
