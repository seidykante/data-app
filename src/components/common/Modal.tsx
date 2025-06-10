import React, { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  modalTitle?: string;
  titleIcon?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "fit"; // fit will try to match content size
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  modalTitle,
  titleIcon,
  size = "md",
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-2xl",
    xl: "max-w-3xl",
    fit: "max-w-fit",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black opacity-60"
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div
        className={`bg-white rounded-lg shadow-xl flex flex-col w-full ${sizeClasses[size]} overflow-hidden transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modalFadeIn`}
      >
        {modalTitle && (
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              {titleIcon}
              <h3 className="text-lg font-semibold text-gray-800">
                {modalTitle}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto custom-scrollbar w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
