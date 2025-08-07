import React from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  maxWidth?: string;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, maxWidth = 'max-w-md' }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay - Only this has opacity */}
      <div onClick={handleOverlayClick} className="absolute inset-0 bg-gray-400 opacity-50"></div>
      
      {/* Modal Content - No opacity, appears above overlay */}
      {/* <div className="relative z-10 bg-white rounded shadow-lg p-6 min-w-[400px]"> */}
      <div className={`relative z-10 bg-white rounded-xl shadow-xl ${maxWidth} w-full`}>
        {title && <h2 className="text-xl font-bold text-center my-5">{title}</h2>}
        <svg onClick={onClose} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x-icon lucide-x absolute top-2 right-2 hover:cursor-pointer"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        {/* <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ×
        </button> */}
        {children}
      </div>

    </div>
  );
};

export default Modal; 