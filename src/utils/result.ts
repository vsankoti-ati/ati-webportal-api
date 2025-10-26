export interface ResultWithData<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export class Result {
  static success<T>(data: T, message?: string): ResultWithData<T> {
    return {
      success: true,
      data,
      message: message || 'Operation successful',
    };
  }

  static error(error: string): ResultWithData<null> {
    return {
      success: false,
      error,
    };
  }
}