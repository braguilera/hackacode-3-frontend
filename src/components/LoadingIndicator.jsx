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
              90deg,
              transparent 0%,
              rgba(255, 255, 255, 0.6) 50%,
              transparent 100%
            )
          `,
          backgroundSize: '100% 100%',
        }}
        animate={{
          x: ['-100%', '100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          times: [0, 0.5, 1],
          ease: "linear",
          repeat: Infinity,
        }}
      />
    </div>
  );
};

export default LoadingIndicator;