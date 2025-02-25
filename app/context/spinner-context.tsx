'use client';
import { createContext, useContext, useState, ReactNode } from "react";
import Spinner from "../ui/spinner/spinner";
import '../dashboard/(overview)/style.css';

// Definizione del tipo di contesto
type SpinnerContextType = {
  setIsActiveSpinner: (active: boolean) => void;
  isActiveSpinner: boolean;
};

const SpinnerContext = createContext<SpinnerContextType | undefined>(undefined);

// Hook personalizzato per usare il contesto
export const useSpinnerContext = () => {
  const context = useContext(SpinnerContext);
  if (!context) {
    throw new Error("useSpinnerContext deve essere usato all'interno di SpinnerProvider");
  }
  return context;
};

// Provider del contesto
export const SpinnerContextProvider = ({ children }: { children: ReactNode }) => {
  // Stato per gestire i dati ricevuti
  const [active, setActive] = useState<boolean>(false);

  // Funzione per gestire eventi dal figlio
  const setIsActiveSpinner = (active: boolean) => {
    setActive(active); // Esempio di gestione del dato ricevuto
  };

  return (
    <SpinnerContext.Provider value={{ setIsActiveSpinner, isActiveSpinner: active }}>
      <div className='spinner-container'>
        <Spinner isActive={active} />   
      </div>
      <div className={`spinner-sibling-content ${active ? 'disabled' : ''}`}>
          {children}
        </div>
    </SpinnerContext.Provider>
  );
};