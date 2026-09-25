import { ErrorDetail } from './common';

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    requestId?: string;
    details?: ErrorDetail[];
  };
}
