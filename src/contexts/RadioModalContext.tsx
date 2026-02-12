import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { RadioModal } from '../components/RadioModal';

interface RadioModalContextValue {
  openRadioModal: () => void;
  closeRadioModal: () => void;
}

const RadioModalContext = createContext<RadioModalContextValue | null>(null);

export function RadioModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const openRadioModal = useCallback(() => setIsOpen(true), []);
  const closeRadioModal = useCallback(() => setIsOpen(false), []);

  return (
    <RadioModalContext.Provider value={{ openRadioModal, closeRadioModal }}>
      {children}
      {isOpen && <RadioModal onClose={closeRadioModal} />}
    </RadioModalContext.Provider>
  );
}

export function useRadioModal() {
  const ctx = useContext(RadioModalContext);
  if (!ctx) throw new Error('useRadioModal must be used within RadioModalProvider');
  return ctx;
}
