import React, { useEffect, useState } from 'react'
import { getDatos } from '../api/crud'

const Consultas = () => {
  const [medicos, setMedicos] = useState([])
  const [servicios, setServicios] = useState([])
  const [paquetes, setPaquetes] = useState([])
  const [mesSeleccionado, setMesSeleccionado] = useState([])
  const [turnosMedico, setTurnosMedico] = useState([])
  const [isEspecializada, setIsEspecializada] = useState();
  const [formData, setFormData] = useState({
    pacienteId: null,
    medicoId: null,
    servicioMedicoCodigo: null,
    fecha: "", //2025-02-19
    hora: "", //10:30:00
    estado: "" //activo
  });

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
        const data = await getDatos('/api/servicios/individuales', 'Error cargando medicos');
        setServicios(data);
      } catch (err) {
        console.log(err.message);
      }
    };

    const fetchPaquetes = async () => {
      try {
        const data = await getDatos('/api/servicios/paquetes', 'Error cargando medicos');
        setPaquetes(data);
      } catch (err) {
        console.log(err.message);
      }
    };

    useEffect(() => {
      fetchMedicos();
      fetchServicios();
      fetchPaquetes();
    }, []);

    useEffect(() => {
      const fetchServicioEspecializado = async () => {
        try {
          const data = await getDatos(`/api/servicios/individuales/${formData.servicioMedicoCodigo}`, 'Error cargando servicio especializado')
          data.nombre === 'Consulta Especializada' ? setIsEspecializada(data) : setIsEspecializada(null)
        } catch (err) {
          console.log(err.message)
        }
      };

      fetchServicioEspecializado();
    },formData.servicioMedicoCodigo);
    
    useEffect(() => {
      const fetchTurnosMedicos = async () => {
        try {
          const data = await getDatos(`api/medicos/turnos-disponibles?medicoId=${formData.servicioMedicoCodigo}&mes=${mesSeleccionado}$`, 'Error obteniendo los turnos')
          
            setTurnosMedico(data);
            console.log(data)
        } catch (err) {
          console.log(err.message)
        }
      };

      fetchTurnosMedicos();
    },formData.medicoId);

  return (
    <main>
    {/*Primera seccion - Eleccion servicio o medico*/}
      <section>
            <select
              value={formData.servicioMedicoCodigo || ""}
              onChange={(e) => {
                const selectedCode = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  servicioMedicoCodigo: selectedCode
                }));
              }}
            >
        <option value="">Seleccione un servicio</option>
        {servicios.map(servicio => (
          <option key={servicio.codigo} value={servicio.codigo}>
            {servicio.nombre}
          </option>
        ))}
      </select>

      <h2>Id{formData.servicioMedicoCodigo}</h2>

      {isEspecializada && 
        <aside>
        <select
              value={formData.medicoId || ""}
              onChange={(e) => {
                const selectedCode = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  medicoId: selectedCode
                }));
              }}
            >
        <option value="">Seleccione un médico</option>
          {medicos.map(medico =>(
            <option key={medico.id} value={medico.id}>{medico.nombre} {medico.especialidad.nombre}</option>
          ))}
        </select>
      <h2>Id medico{formData.medicoId}</h2>
        </aside>
      }
      </section>

      {/*Segunda seccion - Eleccion horario*/}
      <section>
      <h2>Turnos disponibles</h2>
      {turnosMedico && (
        turnosMedico.map(turno => (
          <h2>{turno.hora}</h2>
        )))
      }
      </section>
    </main>
  )
}

export default Consultas
