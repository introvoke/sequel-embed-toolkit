// The NEXT_PUBLIC_ENVIRONMENT can be `dev` `test` `stg` `prod`
export type Environment = "dev" | "test" | "stg" | "prod";

/**
 * Returns the current environment
 * @returns The current environment related to our applications
 */
export const getEnvironment = () =>
  import.meta.env.NODE_ENV === "test"
    ? "test"
    : (import.meta.env.VITE_APP_ENV as Environment);
