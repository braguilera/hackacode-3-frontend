import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User,Stethoscope,Calendar,DollarSign,Package,Activity,BriefcaseMedical,HeartPulse} from 'lucide-react';
import { getDatos } from '../api/crud';
import { isSameDay } from 'date-fns';

const Dashboard = () => {
  const [medicos, setMedicos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [consultas, setConsultas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);

  // Fetchs
  const fetchMedicos = async () => {
    try {
      const data = await getDatos('/api/medicos', 'Error cargando medicos');
      setMedicos(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchServicios = async () => {
    try {
      const data = await getDatos('/api/servicios/individuales', 'Error cargando servicios');
      setServicios(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchPaquetes = async () => {
    try {
      const data = await getDatos('/api/servicios/paquetes', 'Error cargando paquetes');
      setPaquetes(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchConsultas = async () => {
    try {
      const data = await getDatos('/api/consultas', 'Error cargando consultas');
      setConsultas(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchPacientes = async () => {
    try {
      const data = await getDatos('/api/pacientes');
      setPacientes(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchEspecialidades = async () => {
    try {
      const data = await getDatos('/api/especialidades', 'Error cargando especialidades');
      setEspecialidades(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  
  useEffect(() => {
    fetchMedicos();
    fetchServicios();
    fetchPaquetes();
    fetchConsultas();
    fetchPacientes();
    fetchEspecialidades();
  }, []);

  /* Component for stat's cards */

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
    >
      <article className="flex items-center justify-between">
        <header>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </header>
        <div className={`p-3 ${color} rounded-lg`}>
          <Icon className="w-6 h-6" />
        </div>
      </article>
    </motion.main>
  );

  const gananciasTotales = consultas.reduce((acc, consulta) => {
    return acc + (consulta.servicioMedico?.precio || 0);
  }, 0);

  const today = new Date();
  const consultasMes = consultas.filter(consulta => {
    const d = new Date(consulta.fecha);
    return d.getMonth() + 1 === today.getMonth() + 1 && d.getFullYear() === today.getFullYear();
  });

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full p-6 bg-gray-50 h-full space-y-8"
    >
      <motion.header 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Información clave para controlar la aplicación</p>
      </motion.header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Ganancias Totales"
          value={`$${gananciasTotales.toFixed(2)}`}
          icon={DollarSign}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Médicos Activos"
          value={medicos.filter(m => m.activo).length}
          icon={Stethoscope}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          title="Pacientes Registrados"
          value={pacientes.length}
          icon={User}
          color="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="Consultas este Mes"
          value={consultasMes.length}
          icon={Calendar}
          color="bg-orange-100 text-orange-600"
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600"/> Ganancias Mensuales
          </h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Gráfico pendiente
          </div>
        </motion.header>

        <motion.body
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BriefcaseMedical className="w-5 h-5 text-green-600"/> Especialidades
          </h3>
          <motion.article layout className="space-y-4">
            {especialidades.map(especialidad => (
              <motion.section
                key={especialidad.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span>{especialidad.nombre}</span>
                <span className="text-sm text-gray-500">
                  {medicos.filter(m => m.especialidad?.id === especialidad.id).length} médicos
                </span>
              </motion.section>
            ))}
          </motion.article>
        </motion.body>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Actives Packages */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl h-64 overflow-y-scroll scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-50 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-600"/> Paquetes Activos
          </h3>
          <body className="space-y-4">
            {paquetes.filter(p => p.activo).length > 0 ? (
              <section className="grid grid-cols-1 gap-4">
                <AnimatePresence>
                  {paquetes.filter(p => p.activo).map(paquete => (
                    <motion.div
                      key={paquete.codigo}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-white shadow-sm rounded-lg p-4 border border-gray-100"
                    >
                      <h4 className="text-lg font-bold text-gray-800 mb-2 w-80 truncate">{paquete.nombre}</h4>
                      <p className="text-gray-600 text-sm">Tipo: {paquete.tipoServicio}</p>
                      <p className="text-gray-600 text-sm mt-2">
                        Precio: <span className="font-bold text-blue-600">${paquete.precio}</span>
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        Incluye {paquete.servicios.length} servicio{paquete.servicios.length > 1 ? 's' : ''}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </section>
            ) : (
              <div className="text-gray-500 text-center p-6">
                No hay paquetes disponibles
              </div>
            )}
          </body>
        </motion.article>

        {/* Popular Services */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white h-64 overflow-y-scroll scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-50 p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-red-600"/> Servicios Populares
          </h3>
          <motion.section layout className="space-y-4">
            <AnimatePresence>
              {servicios.filter(s => s.activo).map(servicio => (
                <motion.div
                  key={servicio.codigo}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg w-full"
                >
                  <span className="text-gray-700 w-80 truncate">{servicio.nombre}</span>
                  <span className="text-sm font-semibold text-gray-700">${servicio.precio}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.section>
        </motion.article>

        {/* Today Consults */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white h-64 overflow-y-scroll scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-50 p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600"/> Consultas de Hoy
          </h3>
          <section className="space-y-4">
            <AnimatePresence>
              {consultas.filter(consulta => isSameDay(new Date(consulta.fecha), new Date())).length > 0 ? (
                consultas
                  .filter(consulta => isSameDay(new Date(consulta.fecha), new Date()))
                  .sort((a, b) => a.hora.localeCompare(b.hora))
                  .map(consulta => (
                    <motion.div
                      key={consulta.codigo}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-gray-900 font-medium">
                          {new Date(consulta.fecha).toLocaleDateString()} - {consulta.hora.slice(0, 5)}
                        </p>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          consulta.estado === 'CONFIRMADO' ? 'bg-green-100 text-green-700' :
                          consulta.estado === 'CANCELADO' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {consulta.estado}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-2">
                        {consulta.servicioMedico.nombre}
                      </p>
                    </motion.div>
                  ))
              ) : (
                <p className="text-gray-500 text-center p-6">No hay consultas para hoy</p>
              )}
            </AnimatePresence>
          </section>
        </motion.article>
      </section>
    </motion.main>
  );
};

export default Dashboard;