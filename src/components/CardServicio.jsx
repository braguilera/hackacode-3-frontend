import React from 'react';
import { Trash2, Edit3, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

// Paleta de colores por categoría
const categoryColors = {
  'consulta general': { bg: 'bg-blue-100', text: 'text-blue-800' },
  'consulta especializada': { bg: 'bg-green-100', text: 'text-green-800' },
  'examen médico': { bg: 'bg-purple-100', text: 'text-purple-800' },
  'cirugía': { bg: 'bg-red-100', text: 'text-red-800' },
  'terapia': { bg: 'bg-orange-100', text: 'text-orange-800' },
  // Función para detectar categoría automáticamente
  getCategory: (serviceName) => {
    const lowerName = serviceName.toLowerCase();
    if(lowerName.includes('consulta general')) return 'consulta general';
    if(lowerName.includes('consulta')) return 'consulta especializada';
    if(lowerName.includes('análisis') || lowerName.includes('radiografía') || lowerName.includes('ecografía')) return 'examen médico';
    if(lowerName.includes('cirugía')) return 'cirugía';
    return 'terapia';
  }
};

const CardServicio = ({ dataServicio, onEdit, onDelete }) => {
  const category = categoryColors.getCategory(dataServicio.nombre);
  const colors = categoryColors[category];

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={`w-full flex flex-col h-40 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden relative group cursor-pointer select-none `}
    >
      {/* Badge de categoría */}
      <div className={`absolute top-2 left-2 ${colors.bg} ${colors.text} px-3 py-1 rounded-full text-xs font-medium`}>
        {category.toUpperCase()}
      </div>

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

      {/* Contenido principal */}
      <div className="pt-8 px-4 pb-2 flex flex-col justify-between h-full">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">{dataServicio.nombre}</h2>
          <p className="text-sm text-gray-600 line-clamp-2">{dataServicio.descripcion}</p>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <DollarSign size={18} className="text-gray-400" />
            <span className="text-sm text-gray-500">Precio:</span>
            <span className={`font-semibold ${colors.text}`}>${dataServicio.precio}</span>
          </div>
        </div>
      </div>
    </motion.main>
  );
};

export default CardServicio;