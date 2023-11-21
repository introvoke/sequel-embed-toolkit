// The NEXT_PUBLIC_ENVIRONMENT can be `dev` `test` `stg` `prod`
export type Environment = "dev" | "test" | "stg" | "prod";

/**
 * Returns the current environment
 * @returns The current environment related to our applications
 */
export const getEnvironment = () =>
  process.env.NODE_ENV === "test"
    ? "test"
    : (process.env.NEXT_PUBLIC_ENVIRONMENT as Environment);
