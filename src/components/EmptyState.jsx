import React from 'react';
import { motion } from 'framer-motion';
import { SearchX } from 'lucide-react';


{/* Predefines messages */}
const EmptyState = ({ type = 'pacientes' }) => {
  const messages = {
    pacientes: 'pacientes registrados',
    servicios: 'servicios disponibles',
    paquetes: 'paquetes de servicios',
    medicos: 'médicos registrados',
    especialidades: 'especialidades disponibles',
    consultas: 'consultas programadas',
    serviciosInConsulta: 'paquetes de servicios disponibles'
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full min-h-[200px]  p-6 flex flex-col items-center justify-center text-center gap-4"
    >
      <motion.header
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center"
      >
          <SearchX className="w-8 h-8 text-gray-500" />
    
      </motion.header>

      <section className="space-y-2">
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-semibold text-gray-800"
        >
          No se encontraron {messages[type]}
        </motion.h3>
        {type!=='serviciosInConsulta' &&
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600"
        >
          
            Puedes añadir nuevos {type} utilizando el botón de agregar
        </motion.p>
          }
      </section>
    </motion.main>
  );
};

export default EmptyState;