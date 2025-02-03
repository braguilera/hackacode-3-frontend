import React from 'react'
import { Trash2, Edit3, User, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const CardPaquete = ({ dataPaquete, onEdit, onDelete }) => {
    return (
            <motion.main
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-4 relative group cursor-pointer select-none `}
            >
      
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-800">{dataPaquete.nombre}</h3>
            {/* Botones de editar y borrar */}
            <aside className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <motion.button
                whileHover={{ scale: 1.1 }}
                className="p-1.5 rounded-full bg-white hover:bg-gray-50 text-gray-600 shadow-sm border"
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                >
                <Edit3 size={16} />
                </motion.button>
                <motion.button
                whileHover={{ scale: 1.1 }}
                className="p-1.5 rounded-full bg-white hover:bg-red-50 text-gray-600 hover:text-red-500 shadow-sm border"
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                >
                <Trash2 size={16} />
                </motion.button>
            </aside>
        </div>
        
        <div className="space-y-2 mb-4">
          {dataPaquete.servicios.map((servicio, index) => (
            <div key={index} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded-lg">
              <span className="text-gray-600">{servicio.nombre}</span>
              <span className="text-gray-400">${servicio.precio}</span>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="text-sm text-gray-500">Total del paquete:</span>
          <span className="text-lg font-bold text-orange-600">${dataPaquete.precio}</span>
        </div>
        </motion.main>
    );
  };

export default CardPaquete
