import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit3, User, DollarSign } from 'lucide-react';
import DoctorDetails from '../components/DoctorDetails'

const CardMedico = ({ dataMedico, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const getInitials = (nombre, apellido) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  };

  return (
    <>
      <motion.article
        onClick={() => setIsOpen(true)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.2 }}
        className="w-full bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden relative group cursor-pointer select-none"
      >
      {/* Edit and Delete */}
      <aside className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full bg-white/90 hover:bg-gray-100 text-gray-600 shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(dataMedico);
          }}
        >
          <Edit3 size={16} />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full bg-white/90 hover:bg-red-50 text-gray-600 hover:text-red-500 shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(dataMedico);
          }}
        >
          <Trash2 size={16} />
        </motion.button>
      </aside>

      <header className="p-4 flex items-start gap-4">
        <motion.div
        className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold border`}
        >
          <span>{getInitials(dataMedico.nombre, dataMedico.apellido)}</span>
        </motion.div>

        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-gray-800 truncate max-w-[160px]">
            {dataMedico.nombre} {dataMedico.apellido}
          </h2>
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 bg-slate-100 text-slate-600 truncate max-w-[160px]`}>
            {dataMedico.especialidad.nombre}
          </div>
        </div>
      </header>

      <footer className="grid grid-cols-2 divide-x border-t h-20">
        <section className="p-4 flex items-center gap-2 h-full">
            <User size={18} className="text-gray-400" />
            <article>
                <p className="text-sm text-gray-500">Pacientes</p>
                <p className="font-semibold text-gray-800 w-20 truncate">12</p>
            </article>
        </section>
              
        <section className="p-4 flex items-center gap-2 h-full ">
            <DollarSign size={18} className="text-gray-400" />
            <article>
                <p className="text-sm text-gray-500">Sueldo</p>
                <p className="font-semibold text-gray-800 w-20 truncate">
                ${dataMedico.sueldo.toLocaleString()}
                </p>
            </article>
        </section>
      </footer>
    </motion.article>

    {/* Doctor Modal */}
    {
    <DoctorDetails
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        doctor={dataMedico}
    />    
    }    
    </>
);    
};

export default CardMedico;