import React from 'react';
import { createContext, useContextSelector } from 'use-context-selector';

const CurrentGroupContext = createContext();
export const CurrentGroupProvider = ({ children, data }) => {
  return (
    <CurrentGroupContext.Provider value={data}>
      {children}
    </CurrentGroupContext.Provider>
  );
};

export const useCurrentGroup = selector =>
  useContextSelector(CurrentGroupContext, selector);
