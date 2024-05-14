/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import React, { useReducer, useEffect, createContext, useContext } from 'react';
const messageReducer = (state, action) => {
    switch (action.type) {
      case 'SHOW':
        return action.message
      case 'HIDE':
        return null
      default:
        return state
    }
  }
// Create a context for the notifications
const NotificationContext = createContext();

// Create a provider component for the notifications
export const NotificationProvider = ({ children }) => {
  const [message, dispatchMessage] = useReducer(messageReducer, null);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatchMessage({ type: 'HIDE' });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const showMessage = (newMessage) => {
    dispatchMessage({ type: 'SHOW', message: newMessage });
  };

  return (
    <NotificationContext.Provider value={{ message, showMessage }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Create a custom hook to use the notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};