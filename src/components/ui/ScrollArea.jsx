import React from 'react';

export const ScrollArea = ({ children, className, ...props }) => {
  return (
    <div
      className={`overflow-auto max-h-[400px] p-2 rounded-md ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
