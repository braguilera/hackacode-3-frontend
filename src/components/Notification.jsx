import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, X } from 'lucide-react';

const Notification = ({ message, isVisible = false, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && message && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className={`
            flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg
            ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}
          `}>
            {message.type === 'error' ? (
              <XCircle className="w-5 h-5" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
            
            <p className="text-sm font-medium pr-2">{message.text}</p>
            
            <button
              onClick={onClose}
              className={`p-1 rounded-full hover:${message.type === 'error' ? 'bg-red-100' : 'bg-green-100'}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;