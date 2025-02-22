import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Check, X, Edit2 } from 'lucide-react';

const PopUpConfirmation = ({ isOpen, onConfirm, onCancel, itemId, isDelete = true, paquetes }) => {

  const styles = {
    delete: {
      icon: AlertTriangle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      title: 'Confirmar eliminación',
      message: '¿Está seguro que desea eliminar el elemento',
      confirmButton: 'bg-red-600 hover:bg-red-700',
      confirmText: 'Eliminar'
    },
    edit: {
      icon: Edit2,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'Confirmar edición',
      message: '¿Está seguro que desea editar el elemento',
      confirmButton: 'bg-blue-600 hover:bg-blue-700',
      confirmText: 'Editar'
    }
  };

  const currentStyle = isDelete ? styles.delete : styles.edit;
  const Icon = currentStyle.icon;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl border border-gray-100"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex flex-col items-center text-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ delay: 0.2 }}
              className={`w-16 h-16 ${currentStyle.iconBg} rounded-full flex items-center justify-center`}
            >
              <Icon className={`w-8 h-8 ${currentStyle.iconColor}`} />
            </motion.div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-800">{currentStyle.title}</h2>
              <p className="text-gray-600">
                {currentStyle.message} #{itemId}?
              </p>

              {paquetes && 
              <section className='w-full flex flex-col'>
                {paquetes.length!==0 &&
                
                <>
                  <p className="text-gray-700">Se eliminaran los siguientes paquetes</p>
                  <article  className='grid grid-cols-3 gap-4 w-full p-4 items-center'>
                    {paquetes.map(paquete => (
                        <h2 key={paquete.codigo} className='bg-gray-100 rounded-md p-2 h-full w-full  content-center'>
                          {paquete.nombre}
                        </h2>
                    ))}
                  </article>
                </>
                }
              </section>
              }
              <p className="text-gray-600">
                {isDelete && (
                  'Esta acción no se puede deshacer.'
                )}
              </p>
            </div>


            <footer className="flex gap-3 w-full mt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium ${currentStyle.confirmButton} transition-colors`}
                onClick={onConfirm}
              >
                <Check size={18} />
                {currentStyle.confirmText}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                onClick={onCancel}
              >
                <X size={18} />
                Cancelar
              </motion.button>
            </footer>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PopUpConfirmation;