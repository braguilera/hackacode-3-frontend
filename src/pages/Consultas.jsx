import React, { useEffect, useState } from 'react';
import { getDatos, postDatos } from '../api/crud';
import Notification from '../components/Notification';


const Consultas = () => {
  const [medicos, setMedicos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [turnosMedico, setTurnosMedico] = useState([]);
  const [isEspecializada, setIsEspecializada] = useState(null);
  const [paciente, setPaciente] = useState(null);
  const [pacienteNotExist, setPacienteNotExist] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [messageNotification, setMessageNotification] = useState(null);
  const [formData, setFormData] = useState({
    pacienteId: "",              // Documento ingresado
    medicoId: "",
    servicioMedicoCodigo: "",
    fecha: "",
    hora: "",
    estado: "activo"
  });
  // Estado para los datos del nuevo paciente a crear
  const [newPacienteData, setNewPacienteData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    fechaNac: "",
    email: "",
    telefono: "",
    direccion: "",
    tieneObraSocial: false
  });

  // Fetch de médicos, servicios y paquetes
  const fetchMedicos = async () => {
    try {
      const data = await getDatos('/api/medicos', 'Error cargando medicos');
      setMedicos(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchServicios = async () => {
    try {
      const data = await getDatos('/api/servicios/individuales', 'Error cargando servicios');
      setServicios(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchPaquetes = async () => {
    try {
      const data = await getDatos('/api/servicios/paquetes', 'Error cargando paquetes');
      setPaquetes(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const createPaciente = async (pacienteData) => {
    try {
      const data = await postDatos('/api/pacientes', pacienteData, 'Error creando paciente');
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  // Fetch de turnos para el médico seleccionado
  const fetchTurnosMedicos = async () => {
    if (!formData.medicoId) return;
    try {
      // new Date().getMonth() devuelve el mes en base 0 (0 = enero)
      const currentMonth = new Date().getMonth() + 1;
      const data = await getDatos(
        `/api/medicos/turnos-disponibles?medicoId=${formData.medicoId}&mes=${currentMonth}`,
        'Error obteniendo los turnos'
      );
      setTurnosMedico(data);
      console.log(data)
    } catch (err) {
      console.log(err.message);
    }
  };
  

  // Buscar paciente por documento
  const fetchPaciente = async () => {
    if (!formData.pacienteId) return;
    try {
      const data = await getDatos(`/api/pacientes/${formData.pacienteId}`);
      setPaciente(data);
      setPacienteNotExist(false);
    } catch (err) {
      setPaciente(null);
      setPacienteNotExist(true);
    }
  };

  useEffect(() => {
    fetchMedicos();
    fetchServicios();
    fetchPaquetes();
  }, []);

  useEffect(() => {
    // Se ejecuta cuando cambia el código del servicio
    const fetchServicioEspecializado = async () => {
      if (!formData.servicioMedicoCodigo) {
        setIsEspecializada(null);
        return;
      }
      try {
        const data = await getDatos(
          `/api/servicios/individuales/${formData.servicioMedicoCodigo}`,
          'Error cargando servicio especializado'
        );
        // Si el servicio se llama "Consulta Especializada", se considera especializado
        if (data.nombre === 'Consulta Especializada') {
          setIsEspecializada(data);
        } else {
          setIsEspecializada(null);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchServicioEspecializado();
  }, [formData.servicioMedicoCodigo]);

  useEffect(() => {
    fetchTurnosMedicos();
  }, [formData.medicoId]);

  useEffect(() => {
    fetchPaciente();
  }, [formData.pacienteId]);

  // Función para agrupar turnos por fecha
  const groupTurnosByFecha = () => {
    const groups = {};
    turnosMedico.forEach(turno => {
      if (!groups[turno.fecha]) {
        groups[turno.fecha] = [];
      }
      groups[turno.fecha].push(turno);
    });
    return groups;
  };

  const groupedTurnos = groupTurnosByFecha();

  // Función para manejar la creación del paciente cuando no existe
  const handleCreatePaciente = async (e) => {
    e.preventDefault();
    try {
      const createdPaciente = await createPaciente(newPacienteData);
      // Actualizamos el formData con el id (o documento) del paciente creado
      setFormData(prev => ({ ...prev, pacienteId: createdPaciente.id }));
      setPaciente(createdPaciente);
      setPacienteNotExist(false);
    } catch (error) {
      console.error(error);
    }
  };

  const createConsulta = async () => {
    try {
      await postDatos('/api/consultas', formData, 'Error creando paciente');
      setMessageNotification({
        type: 'success',
        text: 'Consulta creada exitosamente'
      });
      setShowNotification(true)
    } catch (error) {
      setMessageNotification({
        type: 'error',
        text: 'Error al crear la consulta'
      });
      setShowNotification(true)
    }
  }

  return (
    <main className="p-6 space-y-8 max-w-4xl mx-auto">
      
      {/* Sección 1: Seleccionar Servicio */}
      <section className="space-y-2">
        <label className="block text-lg font-semibold text-gray-700">Seleccione un servicio:</label>
        <select
          className="w-full p-2 border border-gray-300 rounded"
          value={formData.servicioMedicoCodigo || ""}
          onChange={(e) => setFormData(prev => ({ ...prev, servicioMedicoCodigo: e.target.value }))}
        >
          <option value="">Seleccione un servicio</option>
          {servicios.map(servicio => (
            <option key={servicio.codigo} value={servicio.codigo}>
              {servicio.nombre}
            </option>
          ))}
        </select>
        {isEspecializada && (
          <p className="text-sm text-gray-600">Servicio especializado seleccionado</p>
        )}
      </section>

      {/* Sección 2: Seleccionar Médico (solo si es servicio especializado) */}
      {isEspecializada && (
        <section className="space-y-2">
          <label className="block text-lg font-semibold text-gray-700">Seleccione un médico especializado:</label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.medicoId || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, medicoId: e.target.value }))}
          >
            <option value="">Seleccione un médico</option>
            {medicos.map(medico => (
                <option key={medico.id} value={medico.id}>
                  {medico.nombre} {medico.apellido} - {medico.especialidad.nombre}
                </option>
              ))}
          </select>
        </section>
      )}

      {/* Sección 3: Seleccionar Turno */}
      {formData.medicoId && turnosMedico.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Turnos disponibles</h3>
          {Object.keys(groupedTurnos).map(fecha => (
            <div key={fecha} className="mb-4">
              <h4 className="font-medium text-gray-800">{fecha}</h4>
              <div className="flex flex-wrap gap-2 mt-2">
              {groupedTurnos[fecha].map(turno => (
                <button
                  key={`${fecha}-${turno.hora}`}
                  className={`px-3 py-1 rounded border ${
                    formData.fecha === fecha && formData.hora === turno.hora
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-800'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, fecha: fecha, hora: turno.hora }))}
                >
                  {turno.hora.slice(0, 5)}
                </button>
              ))}

              </div>
            </div>
          ))}
        </section>
      )}

      {/* Sección 4: Seleccionar o Crear Paciente */}
      <section className="space-y-4">
        <label className="block text-lg font-semibold text-gray-700">Ingrese el documento del paciente:</label>
        <input 
          type="text"
          placeholder="Documento"
          className="w-full p-2 border border-gray-300 rounded"
          value={formData.pacienteId || ""}
          onChange={(e) => {
            const doc = e.target.value;
            setFormData(prev => ({ ...prev, pacienteId: doc }));
            // También actualizamos el DNI en el nuevo paciente
            setNewPacienteData(prev => ({ ...prev, dni: doc }));
          }}
        />
        {pacienteNotExist ? (
          <div className="p-4 border border-dashed border-gray-300 rounded bg-gray-50 space-y-2">
            <p className="text-sm text-gray-600">Paciente no existe. Complete los siguientes datos para crearlo:</p>
            <form onSubmit={handleCreatePaciente} className="space-y-2">
              <input
                type="text"
                placeholder="Nombre"
                className="w-full p-2 border border-gray-300 rounded"
                value={newPacienteData.nombre}
                onChange={(e) => setNewPacienteData(prev => ({ ...prev, nombre: e.target.value }))}
                required
              />
              <input
                type="text"
                placeholder="Apellido"
                className="w-full p-2 border border-gray-300 rounded"
                value={newPacienteData.apellido}
                onChange={(e) => setNewPacienteData(prev => ({ ...prev, apellido: e.target.value }))}
                required
              />
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
                value={newPacienteData.fechaNac}
                onChange={(e) => setNewPacienteData(prev => ({ ...prev, fechaNac: e.target.value }))}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded"
                value={newPacienteData.email}
                onChange={(e) => setNewPacienteData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
              <input
                type="text"
                placeholder="Teléfono"
                className="w-full p-2 border border-gray-300 rounded"
                value={newPacienteData.telefono}
                onChange={(e) => setNewPacienteData(prev => ({ ...prev, telefono: e.target.value }))}
                required
              />
              <input
                type="text"
                placeholder="Dirección"
                className="w-full p-2 border border-gray-300 rounded"
                value={newPacienteData.direccion}
                onChange={(e) => setNewPacienteData(prev => ({ ...prev, direccion: e.target.value }))}
                required
              />
              {/* Podrías agregar un checkbox para "tieneObraSocial" si lo necesitas */}
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Crear Paciente
              </button>
            </form>
          </div>
        ) : paciente ? (
          <div className="p-4 border rounded bg-green-50">
            <p className="text-sm text-green-700">
              Paciente encontrado: {paciente.nombre} {paciente.apellido}
            </p>
          </div>
        ) : null}
      </section>

      {/* Sección 5: Previsualización y Confirmación de Consulta */}
      <section className="p-4 border border-gray-200 rounded bg-white shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Previsualización de Consulta</h3>
        <p>
          <strong>Servicio:</strong> {servicios.find(s => s.codigo === Number(formData.servicioMedicoCodigo))?.nombre || "-"}
        </p>
        {isEspecializada && (
          <p>
            <strong>Médico:</strong> {medicos.find(m => m.id === Number(formData.medicoId))?.nombre || "-"}
          </p>
        )}
        <p>
          <strong>Fecha:</strong> {formData.fecha || "-"}
        </p>
        <p>
          <strong>Hora:</strong> {formData.hora || "-"}
        </p>
        <p>
          <strong>Paciente:</strong> {paciente ? `${paciente.nombre} ${paciente.apellido}` : newPacienteData.nombre || "-"}
        </p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => {
            createConsulta()
          }}
        >
          Confirmar Consulta
        </button>
      </section>
      <Notification
        message={messageNotification}
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </main>
  );
};

export default Consultas;
