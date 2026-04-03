interface AppEnv {
  apiBaseUrl: string;
  appEnv: 'development' | 'staging' | 'production' | string;
  sentryDsn: string;
}

export function getAppEnv(): AppEnv {
  return {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
    appEnv: import.meta.env.VITE_APP_ENV ?? 'development',
    sentryDsn: import.meta.env.VITE_SENTRY_DSN ?? '',
  };
}
