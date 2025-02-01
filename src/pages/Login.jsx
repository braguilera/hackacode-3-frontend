import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Contexto from '../contexto/Contexto';
import { useNavigate } from 'react-router-dom';
import { User, Lock, LogIn, Stethoscope, Users, ClipboardList, Activity } from 'lucide-react'; // Iconos de Lucide

const Login = () => {
  const { setLogeado } = useContext(Contexto);
  const navegacion = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [isExiting, setIsExiting] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: <Stethoscope className="w-16 h-16 text-blue-100" />,
      title: "Gestión de Consultas",
      description: "Consulta y gestiona todas las consultas médicas de tus pacientes de manera eficiente.",
    },
    {
      icon: <Users className="w-16 h-16 text-blue-100" />,
      title: "Administración de Pacientes",
      description: "Mantén un registro detallado de tus pacientes y su historial médico.",
    },
    {
      icon: <ClipboardList className="w-16 h-16 text-blue-100" />,
      title: "Servicios Médicos",
      description: "Gestiona los servicios médicos ofrecidos por tu institución.",
    },
    {
      icon: <Activity className="w-16 h-16 text-blue-100" />,
      title: "Dashboard de Datos",
      description: "Visualiza métricas clave en tiempo real para una toma de decisiones informada.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Cambia de slide cada 5 segundos
    return () => clearInterval(interval);
  }, [slides.length]);

  const manejarLogeo = () => {
    setIsExiting(true);
    setTimeout(() => {
      setLogeado(true);
      navegacion('/dashboard');
    }, 500); // Duración de la animación de salida
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.main
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className='flex justify-center items-center bg-gradient-to-r from-blue-50 to-blue-100 w-full h-screen'
        >
          {/* Contenedor principal */}
          <div className='flex bg-white rounded-xl shadow-lg w-4/5 max-w-6xl overflow-hidden'>
            {/* Sección izquierda: Carrusel */}
            <div className='w-1/2 p-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white flex flex-col justify-center items-center'>
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className='text-center'
              >
                <div className='mb-6'>{slides[currentSlide].icon}</div>
                <h2 className='text-2xl font-bold mb-4'>{slides[currentSlide].title}</h2>
                <p className='text-gray-100'>{slides[currentSlide].description}</p>
              </motion.div>

              {/* Puntos de navegación */}
              <div className='flex space-x-2 mt-6'>
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full ${
                      currentSlide === index ? 'bg-white' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Sección derecha: Formulario de inicio de sesión */}
            <div className='w-1/2 p-8 flex flex-col justify-center'>
              <h1 className='text-3xl font-bold text-blue-500 mb-4'>Bienvenido al Sistema Hospitalario</h1>
              <p className='text-gray-600 mb-8'>
                Accede a tu cuenta para gestionar consultas, pacientes, servicios y más.
              </p>
              <div className='space-y-4'>
                <div className='flex items-center border border-gray-200 rounded-lg p-3'>
                  <User className='text-gray-400 mr-2' />
                  <input
                    type='text'
                    placeholder='Usuario'
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    className='w-full focus:outline-none'
                  />
                </div>
                <div className='flex items-center border border-gray-200 rounded-lg p-3'>
                  <Lock className='text-gray-400 mr-2' />
                  <input
                    type='password'
                    placeholder='Contraseña'
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                    className='w-full focus:outline-none'
                  />
                </div>
                <button
                  onClick={manejarLogeo}
                  className='w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center'
                >
                  <LogIn className='mr-2' />
                  Iniciar Sesión
                </button>
              </div>
            </div>
          </div>
        </motion.main>
      )}
    </AnimatePresence>
  );
};

export default Login;