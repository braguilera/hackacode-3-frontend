import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Stethoscope, Calendar, DollarSign, Package, Activity, HeartPulse } from 'lucide-react';
import { getDatos } from '../api/crud';
import { isSameDay, format, parse } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const [medicos, setMedicos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [consultas, setConsultas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState([]);
  const [dailyEarnings, setDailyEarnings] = useState([]);
  const [monthlyYear, setMonthlyYear] = useState(new Date().getFullYear());
  const [monthlyMonth, setMonthlyMonth] = useState(new Date().getMonth() + 1);
  const [dailyDate, setDailyDate] = useState(new Date());

  // Feneral Fetchs
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

  // Total Earnings
  const fetchTotalEarnings = async () => {
    try {
      const data = await getDatos('/api/pagos/ganancias', 'Error obteniendo ganancias totales');
      setTotalEarnings(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  // Monthly Earnings
  const fetchMonthlyEarnings = async () => {
    const allServices = [...servicios, ...paquetes];
    const requests = allServices.map(async (service) => {
      const url = `/api/pagos/ganancias/servicio/${service.codigo}?mes=${monthlyMonth}&anio=${monthlyYear}`;
      try {
        const pagos = await getDatos(url, `Error al cargar pagos para ${service.nombre}`);
        return { name: service.nombre, earnings: pagos };
      } catch (err) {
        return { name: service.nombre, earnings: 0 };
      }
    });
    const results = await Promise.all(requests);
    setMonthlyEarnings(results);
  };

  // Daily Earnings
  const fetchDailyEarnings = async () => {
    const allServices = [...servicios, ...paquetes];
    const formattedDate = format(dailyDate, 'yyyy-MM-dd');
    console.log(dailyDate)
    const requests = allServices.map(async (service) => {
      const url = `/api/pagos/ganancias/servicio/${service.codigo}?fecha=${formattedDate}`;
      try {
        const pagos = await getDatos(url, `Error al cargar pagos para ${service.nombre}`);
        console.log('pagos:',pagos)
        return { name: service.nombre, earnings: pagos };
      } catch (err) {
        return { name: service.nombre, earnings: 0 };
      }
    });
    const results = await Promise.all(requests);
    setDailyEarnings(results);
  };

  useEffect(() => {
    fetchMedicos();
    fetchServicios();
    fetchPaquetes();
    fetchConsultas();
    fetchPacientes();
    fetchTotalEarnings();
  }, []);


  useEffect(() => {
    if (servicios.length || paquetes.length) {
      fetchMonthlyEarnings();
    }
  }, [monthlyYear, monthlyMonth, servicios, paquetes]);


  useEffect(() => {
    if (servicios.length || paquetes.length) {
      fetchDailyEarnings();
    }
  }, [dailyDate, servicios, paquetes]);

  // Stadistics cards
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

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full p-4 h-full space-y-4"
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
          value={`$${totalEarnings}`}
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
          value={consultas.filter(consulta => {
            const d = new Date(consulta.fecha);
            const today = new Date();
            return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
          }).length}
          icon={Calendar}
          color="bg-orange-100 text-orange-600"
        />
      </section>

      {/* Graphs: earnings Monthly and Daily */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <header className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600"/> Ganancias Mensuales
            </h3>
          </header>
          <div className="flex items-center gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-600">Mes:</label>
              <select
                value={monthlyMonth}
                onChange={(e) => setMonthlyMonth(Number(e.target.value))}
                className="ml-2 border border-gray-300 rounded p-1"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Año:</label>
              <input
                type="number"
                value={monthlyYear}
                onChange={(e) => setMonthlyYear(Number(e.target.value))}
                className="ml-2 border border-gray-300 rounded p-1 w-20"
              />
            </div>
          </div>
          <div className="w-full h-56">
            {monthlyEarnings.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyEarnings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="earnings" fill="#8884d8" name="Ganancias" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500">No hay datos para mostrar</p>
            )}
          </div>
        </motion.article>

        {/* Daily */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <header className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600"/> Ganancias Diarias
            </h3>
          </header>
          <div className="flex items-center gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-600">Fecha:</label>
              <input
                type="date"
                value={format(dailyDate, 'yyyy-MM-dd')}
                onChange={(e) => setDailyDate(parse(e.target.value, 'yyyy-MM-dd', new Date()))}
                className="ml-2 border border-gray-300 rounded p-1"
              />
            </div>
          </div>
          <div className="w-full h-64">
            {dailyEarnings.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyEarnings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="earnings" fill="#82ca9d" name="Ganancias" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500">No hay datos para mostrar</p>
            )}
          </div>
        </motion.article>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Packages */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl h-64 overflow-y-scroll scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-50 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-600"/> Paquetes Activos
          </h3>
          <section className="space-y-4">
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
          </section>
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

        {/* Today's Consults */}
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
