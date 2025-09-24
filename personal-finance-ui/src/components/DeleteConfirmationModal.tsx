import React from 'react';
import Modal from '@/components/Modal';

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onExport?: () => void;
  title: string;
  message: string;
  hasTransactions?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  onExport,
  title,
  message,
  hasTransactions = false,
}) => {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="p-6 max-w-lg mx-auto">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 bg-red-50 rounded-full p-2">
            <svg
              className="h-6 w-6 text-red-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-gray-700 whitespace-pre-wrap">
              {message}
            </div>
            {hasTransactions && (
              <div className="mt-4 bg-yellow-50 border border-yellow-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-yellow-400 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-yellow-800 font-medium">
                    This item cannot be deleted because it has associated transactions.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center justify-end space-x-3">
              {hasTransactions && onExport && (
                <button
                  type="button"
                  onClick={onExport}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Export Transactions
                </button>
              )}
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={onConfirm}
                disabled={hasTransactions}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};