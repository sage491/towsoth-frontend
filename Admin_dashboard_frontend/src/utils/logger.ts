const isDevelopment = import.meta.env.DEV;

export const logger = {
  info: (message: string, payload?: unknown): void => {
    if (isDevelopment) {
      console.info(message, payload);
    }
  },
  warn: (message: string, payload?: unknown): void => {
    console.warn(message, payload);
  },
  error: (message: string, payload?: unknown): void => {
    console.error(message, payload);
  },
};
