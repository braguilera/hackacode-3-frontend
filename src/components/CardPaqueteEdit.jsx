// CardPaqueteEdit.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Package, X, ArrowRight } from 'lucide-react';

const CardPaqueteEdit = ({ paqueteDataEdit, onChange, onSubmit, onCancel }) => {
  return (
    <motion.article
      key="edit-form"
      className="w-full bg-white rounded-xl relative border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ y: 50, opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      layout
    >
      <header className="flex items-center gap-2 p-4 border-b border-gray-100">
        <aside className="p-2 bg-blue-100 rounded-lg">
          <Package size={20} className="text-blue-600" />
        </aside>
        <input
          type="text"
          name="nombre"
          value={paqueteDataEdit.nombre}
          onChange={onChange}
          placeholder="Nombre del Paquete"
          required
          maxLength={50}
          className="flex-1 px-3 py-1.5 text-lg font-semibold text-gray-800 bg-transparent border-0 placeholder:text-gray-400 focus:ring-0 outline-none"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCancel();
          }}
          className="p-1.5 rounded-full hover:bg-gray-50 text-gray-600"
        >
          <X size={16} />
        </button>
      </header>
      
      <form onSubmit={onSubmit} className="flex flex-col">
        <div className="p-4 grid grid-rows-[auto_1fr] gap-4" style={{ height: '460px' }}>
          {/* Sección para mostrar los servicios seleccionados */}
          <article className="h-[180px]">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">Servicios Seleccionados</h2>
            <div className="h-[150px] overflow-y-auto pr-2 space-y-1.5">
              {paqueteDataEdit.servicios && paqueteDataEdit.servicios.length > 0 ? (
                paqueteDataEdit.servicios.map((servicio) => (
                  <div
                    key={servicio.codigo}
                    className="flex justify-between items-center text-sm py-2 px-3 bg-gray-100 rounded-lg"
                  >
                    <span className="text-gray-700">{servicio.nombre}</span>
                    <span className="text-gray-700 font-semibold">${servicio.precio}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic p-2">No hay servicios seleccionados</p>
              )}
            </div>
          </article>
  
          {/* Sección para los servicios disponibles (similar a la creación) */}
          <article className="h-[180px]">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">Servicios Disponibles</h2>
            <div className="h-[150px] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                {/* Aquí puedes renderizar los servicios disponibles para agregar,
                    o dejar un placeholder si la funcionalidad aún no está implementada */}
                <p className="text-sm text-gray-400 italic p-2">Funcionalidad pendiente</p>
              </div>
            </div>
          </article>
        </div>
  
        <footer className="p-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            className="w-full justify-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <span>Guardar Cambios</span>
            <ArrowRight size={18} />
          </button>
        </footer>
      </form>
    </motion.article>
  );
};

export default CardPaqueteEdit;
