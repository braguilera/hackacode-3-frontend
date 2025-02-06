import React from 'react';
import { Trash2, Edit3, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const categoryColors = {
    'general': { bg: 'bg-blue-100', text: 'text-blue-800' },
    'especialidad': { bg: 'bg-green-100', text: 'text-green-800' },
    'examen': { bg: 'bg-purple-100', text: 'text-purple-800' },
    'cirugía': { bg: 'bg-red-100', text: 'text-red-800' },
    'terapia': { bg: 'bg-orange-100', text: 'text-orange-800' },
    getCategory: (serviceName) => {
        const lowerName = serviceName.toLowerCase();
        if(lowerName.includes('general')) return 'general';
        if(lowerName.includes('consulta')) return 'especialidad';
        if(lowerName.includes('análisis') || lowerName.includes('radiografía') || lowerName.includes('ecografía')) return 'examen';
        if(lowerName.includes('cirugía')) return 'cirugía';
        return 'terapia';
    }
};

const CardServicio = ({ dataServicio, onEdit, onDelete }) => {
    const category = categoryColors.getCategory(dataServicio.nombre);
    const colors = categoryColors[category];
    
    const cleanTitle = dataServicio.nombre
        .replace('Consulta ', '')
        .replace('Especializada ', '');

    return (
        <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className={`w-full flex flex-col h-40 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden relative group cursor-pointer select-none`}
        >
            {/* Edit and Delete */}
            <aside className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="p-1.5 rounded-full bg-white hover:bg-gray-50 text-gray-600 shadow-sm"
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                >
                    <Edit3 size={16} />
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="p-1.5 rounded-full bg-white hover:bg-red-50 text-gray-600 hover:text-red-500 shadow-sm"
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                >
                    <Trash2 size={16} />
                </motion.button>
            </aside>

            {/* Principal Container */}
            <article className="pt-4 px-4 pb-2 flex flex-col justify-between h-full">
                <header>
                    <h2 className={`text-lg w-auto font-semibold text-gray-800 mb-1 ${colors.bg} ${colors.text} px-3 py-1 rounded-full`}>
                        {dataServicio.nombre}
                    </h2>
                    <p className="text-sm text-gray-600 line-clamp-2">{dataServicio.descripcion}</p>
                </header>
                
                <footer className="flex items-center justify-between mt-2">
                    <article className="flex items-center gap-2 pt-2 border-t border-gray-100 w-full">
                        <span className='text-xl font-semibold text-slate-600'>${dataServicio.precio}</span>
                    </article>
                </footer>
            </article>
        </motion.main>
    );
};

export default CardServicio;