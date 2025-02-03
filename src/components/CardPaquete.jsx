import React from 'react'
import { Trash2, Edit3, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const CardPaquete = ({ dataPaquete, onEdit, onDelete }) => {
    return (
        <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.02 }}
            className='relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 border border-gray-100 group cursor-pointer select-none'
        >
            <header className="flex items-center gap-2 mb-2">
                <aside className="p-2 bg-blue-100 rounded-lg">
                    <Package size={20} className="text-blue-600" />
                </aside>
                <h3 className="text-lg font-semibold text-gray-800">{dataPaquete.nombre}</h3>

                {/* Botones de editar y borrar */}
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
            </header>

            <article className="space-y-2 mb-3">
                {dataPaquete.servicios.map((servicio, index) => (
                    <div key={index} className="flex justify-between items-center text-sm p-2 bg-gray-100 rounded-lg">
                        <p className="text-gray-700">{servicio.nombre}</p>
                        <p className="text-gray-700 font-semibold">${servicio.precio}</p>
                    </div>
                ))}
            </article>

            <footer className="pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-500">Total:</p>
                    <p className="text-lg font-bold text-indigo-600 shadow-sm">${dataPaquete.precio}</p>
                </div>
            </footer>
        </motion.main>
    );
};

export default CardPaquete;
