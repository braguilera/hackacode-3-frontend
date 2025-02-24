import React from 'react'
import { motion } from 'framer-motion';
import { X, Save, Edit3 } from 'lucide-react';

// Nuevo componente EditableCardServicio
const EditableCardService = ({ servicioData, setServicioData, onCancel, onSubmit }) => {
    const handleChange = (e) => {
      setServicioData({
        ...servicioData,
        [e.target.name]: e.target.value
      });
    };
  
    return (
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className={`w-full flex flex-col h-40 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden relative group select-none`}
      >
        <form onSubmit={onSubmit}>
          {/* Header */}
          <header className="absolute top-0 left-0 w-full flex items-center gap-2 p-4 bg-white">
            <aside className="p-2 bg-blue-100 rounded-lg">
              <Edit3 size={20} className="text-blue-600" />
            </aside>
            <input
              type="text"
              name="nombre"
              value={servicioData.nombre}
              maxLength={50}
              onChange={handleChange}
              className="flex-1 text-lg w-full font-semibold text-gray-800 bg-transparent border-0 focus:ring-0 outline-none"
            />
            <button
              type="button"
              onClick={onCancel}
              className="p-1.5 rounded-full hover:bg-gray-50 text-gray-600"
            >
              <X size={16} />
            </button>
          </header>
  
          {/* Contenido del formulario */}
          <div className="h-full pt-16 px-4 pb-2 flex flex-col justify-between">
            <div className="space-y-2">
              <textarea
                name="descripcion"
                value={servicioData.descripcion}
                onChange={handleChange}
                maxLength={50}
                className="w-full text-base text-gray-600 bg-transparent border-0 focus:ring-0 outline-none resize-none line-clamp-2"
                rows={2}
              />
            </div>
  
            <footer className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Precio:</span>
                <input
                  type="number"
                  name="precio"
                  value={servicioData.precio}
                  onChange={handleChange}
                  maxLength={20}
                  className="w-24 text-xl font-semibold text-slate-600 bg-transparent border-0 focus:ring-0 outline-none"
                />
              </div>
              <button
                type="submit"
                className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-sm"
              >
                <Save size={18} />
              </button>
            </footer>
          </div>
        </form>
      </motion.main>
    );
  };

export default EditableCardService
