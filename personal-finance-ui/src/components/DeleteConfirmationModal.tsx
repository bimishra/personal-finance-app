import React from 'react';
import Modal from '@/components/Modal';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onExport?: () => void;
  title: string;
  message: string;
  hasTransactions?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onExport,
  title,
  message,
  hasTransactions = false,
}) => {
  return (
    <Modal open={isOpen} onClose={onClose} title={title}>
      <div className="p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-red-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <div className="ml-3 w-full">
            <div className="mt-2 text-sm text-gray-500">
              <p>{message}</p>
              {hasTransactions && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <p className="text-sm text-yellow-700">
                    This account has associated transactions that will also be deleted.
                    Consider exporting them first.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              {hasTransactions && onExport && (
                <button
                  type="button"
                  onClick={onExport}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Export Transactions
                </button>
              )}
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={onConfirm}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};