import React, { Profiler, StrictMode, cloneElement } from 'react';

export function ProfilingPlugin({ moduleName, onRender }) {
  return (children) => (
    <Profiler id={moduleName} onRender={onRender}>
      {children}
    </Profiler>
  );
}

export function StrictModePlugin({ moduleName }) {
  return (children) => (
    <StrictMode key={moduleName}>
      {children}
    </StrictMode>
  );
}

export function localStoragePlugin({ children }) {
  return cloneElement(children, {
    localStorage: {
      getItem: () => null,
    },
  });
}
