import React from 'react';
import { motion } from 'framer-motion';

const LoadingIndicator = ({ width, height }) => {
  return (
    <div 
      className={`relative overflow-hidden bg-blue-200 rounded-lg ${width || 'w-full'} ${height || 'h-full'}`}
      style={{
        minHeight: '10px'
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              to left,

              rgba(255, 255, 255, 0.4) 40%,
              rgba(255, 255, 255, 0.7) 50%,
              rgba(255, 255, 255, 0.4) 80%,

            )
          `,
          backgroundSize: '200% 100%',
        }}
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          duration: 1.5,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      />
    </div>
  );
};

export default LoadingIndicator;