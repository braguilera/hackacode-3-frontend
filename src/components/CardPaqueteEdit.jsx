import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Package, ArrowRight } from 'lucide-react';

const CardPaqueteEdit = ({ paquete, serviciosDisponibles, onCancel, onSave }) => {
  console.log(paquete)
  const [nombre, setNombre] = useState(paquete.nombre);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState(paquete.servicios);
  

  const serviciosDisponiblesActuales = serviciosDisponibles.filter(
    s => !serviciosSeleccionados.some(sel => sel.codigo === s.codigo)
  );

  const handleAgregarServicio = (servicio) => {
    setServiciosSeleccionados([...serviciosSeleccionados, servicio]);
  };

  const handleQuitarServicio = (servicio) => {
    setServiciosSeleccionados(serviciosSeleccionados.filter(s => s.codigo !== servicio.codigo));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...paquete,
      nombre,
      servicios: serviciosSeleccionados,
      precio: serviciosSeleccionados.reduce((sum, s) => sum + s.precio, 0)
    });
  };

  return (
    <motion.article
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
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del Paquete"
          required
          maxLength={50}
          className="flex-1 px-3 py-1.5 text-lg font-semibold text-gray-800 bg-transparent border-0 placeholder:text-gray-400 focus:ring-0 outline-none"
        />
        <button
          onClick={onCancel}
          className="p-1.5 rounded-full hover:bg-gray-50 text-gray-600"
        >
          <X size={16} />
        </button>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col">
        <section className="p-4 grid grid-rows-[auto_1fr] gap-4" style={{ height: '460px' }}>
          
          {/* Servicios Seleccionados */}
          <article className="h-[180px]">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">Servicios Seleccionados</h2>
            <main className="h-[150px] overflow-y-auto pr-2 space-y-1.5">
              <AnimatePresence>
                {serviciosSeleccionados.length === 0 ? (
                  <p className="text-sm text-gray-400 italic p-2">No hay servicios seleccionados</p>
                ) : (
                  serviciosSeleccionados.map((servicio) => (
                    <motion.article
                      key={servicio.codigo}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex justify-between items-center text-sm py-2 px-3 bg-gray-100 rounded-lg group"
                    >
                      <span className="text-gray-700">{servicio.nombre}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 font-semibold">${servicio.precio}</span>
                        <button
                          type="button"
                          onClick={() => handleQuitarServicio(servicio)}
                          className="p-1 rounded-full hover:bg-white text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </motion.article>
                  ))
                )}
              </AnimatePresence>
            </main>
          </article>

          {/* Servicios Disponibles */}
          <article className="h-[180px]">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">Servicios Disponibles</h2>
            <main className="h-[150px] overflow-y-auto pr-2">
              <article className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                <AnimatePresence>
                  {serviciosDisponiblesActuales.map((servicio) => (
                    <motion.button
                      key={servicio.codigo}
                      type="button"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onClick={() => handleAgregarServicio(servicio)}
                      className="flex justify-between items-center py-2 px-3 bg-white border border-gray-200 rounded-lg hover:border-blue-200 hover:bg-blue-50/50 transition-all text-left group"
                    >
                      <span className="text-sm text-gray-700">{servicio.nombre}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-700">${servicio.precio}</span>
                        <Plus size={14} className="text-gray-400 group-hover:text-blue-500" />
                      </div>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </article>
            </main>
          </article>
        </section>

        {/* Footer con botones */}
        <footer className="p-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={serviciosSeleccionados.length === 0}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            Guardar Cambios
            <ArrowRight size={18} />
          </button>
        </footer>
      </form>
    </motion.article>
  );
};

export default CardPaqueteEdit;