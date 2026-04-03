/// <reference types="vite/client" />

const env = import.meta.env;

export const API_BASE_URL = env.VITE_API_BASE_URL ?? "";

export const APP_NAME = env.VITE_APP_NAME ?? "Student Command Dashboard";

export const FEATURE_FLAGS = {
  experimentalRoutes: env.VITE_FF_EXPERIMENTAL_ROUTES === "true",
  analyticsV2: env.VITE_FF_ANALYTICS_V2 === "true",
  subjectsAsyncData: env.VITE_FF_SUBJECTS_ASYNC_DATA === "true",
} as const;
