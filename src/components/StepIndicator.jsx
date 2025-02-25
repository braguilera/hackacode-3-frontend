import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const StepIndicator = ({ currentStep, totalSteps }) => {
  const prevStepRef = useRef(currentStep);
  const direction =
    currentStep > prevStepRef.current
      ? 'forward'
      : currentStep < prevStepRef.current
      ? 'backward'
      : 'none';

  useEffect(() => {
    prevStepRef.current = currentStep;
  }, [currentStep]);

  return (
    <main className="flex justify-center mb-8">
      {[...Array(totalSteps)].map((_, index) => (
        <article key={index} className="flex items-center">
          <motion.header
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              index === currentStep
                ? 'bg-white text-black border-2 border-blue-500'
                : index < currentStep
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            {index + 1}
          </motion.header>
          {index < totalSteps - 1 && (
            <body className="w-16 h-0.5 bg-gray-200 relative">
              <motion.article
                initial={
                  direction === 'forward' && index === currentStep - 1
                    ? { width: '0%' }
                    : direction === 'backward' && index === currentStep
                    ? { width: '100%' }
                    : { width: index < currentStep ? '100%' : '0%' }
                }
                animate={
                  direction === 'forward' && index === currentStep - 1
                    ? { width: '100%' }
                    : direction === 'backward' && index === currentStep
                    ? { width: '0%' }
                    : { width: index < currentStep ? '100%' : '0%' }
                }
                transition={{ duration: 0.3 }}
                className="h-full bg-blue-500 absolute top-0 left-0"
              />
            </body>
          )}
        </article>
      ))}
    </main>
  );
};

export default StepIndicator;
