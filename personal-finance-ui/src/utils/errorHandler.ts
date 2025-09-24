import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

interface ErrorResponse {
  status: number;
  message: string;
  timestamp: string;
}

export const handleApiError = (error: AxiosError): void => {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data as ErrorResponse;

    // Handle specific status codes
    switch (status) {
      case 400:
        toast.error('Invalid request. Please check your input.');
        break;
      case 401:
        toast.error('Session expired. Please login again.');
        break;
      case 403:
        toast.error('Access denied. You do not have permission to perform this action.');
        break;
      case 404:
        toast.error('Resource not found.');
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        toast.error(data.message || 'An unexpected error occurred.');
    }
  } else if (error.request) {
    toast.error('Network error. Please check your connection.');
  } else {
    toast.error('An unexpected error occurred.');
  }
};