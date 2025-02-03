import React from 'react'
import { Trash2, Edit3, User, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const CardServicio = ({dataServicio, onEdit, onDelete}) => {
    return (
            <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.2 }}
            className="w-full flex flex-col justify-between h-36 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden relative group cursor-pointer select-none"
        >
            <header className='p-4'>
                <h2 className="text-lg font-semibold text-gray-800">{dataServicio.nombre}</h2>
                <p className='text-sm text-gray-300'>{dataServicio.descripcion}</p>
            </header>

            {/* Botones de editar y borrar */}
            <aside className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full bg-white/90 hover:bg-gray-100 text-gray-600 shadow-sm"
                    onClick={(e) => {e.stopPropagation(); onEdit();}}
                >
                    <Edit3 size={16} />
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full bg-white/90 hover:bg-red-50 text-gray-600 hover:text-red-500 shadow-sm"
                    onClick={(e) => {e.stopPropagation(); onDelete();}}
                >
                    <Trash2 size={16} />
                </motion.button>
            </aside>

            <footer className=" flex items-center gap-2 border-t">
                <article className="p-2 flex items-center gap-2">
                    <DollarSign size={18} className="text-gray-400"></DollarSign>
                    <p className="text-sm text-gray-500">Precio</p>
                    <p className="font-semibold text-gray-800">${dataServicio.precio}</p>
                </article>
            </footer>
        </motion.main>
    )
}

export default CardServicio
