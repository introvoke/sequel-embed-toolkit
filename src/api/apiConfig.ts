import axios from "axios";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter as SequelAppRouter } from "@introvoke/sequel-trpc";

interface AppSyncConfigType {
  aws_appsync_graphqlEndpoint: string;
  aws_appsync_region: string;
  aws_appsync_authenticationType: string;
}

interface Endpoints<T = string> {
  PRODUCTION: T;
  STAGING: T;
  DEV: T;
  TEST: T;
}

const ApiEndpoints: Endpoints = {
  PRODUCTION: "https://api.introvoke.com",
  STAGING: "https://stg-api.introvoke.com",
  DEV: "https://dev-api.introvoke.com",
  TEST: "https://test-api.introvoke.com",
};

const EmbedEndpoints: Endpoints = {
  PRODUCTION: "https://embed.sequel.io",
  STAGING: "https://stg-embed.sequel.io",
  DEV: "https://dev-embed.sequel.io",
  TEST: "https://test-embed.sequel.io",
};

const AnalyticsEndpoints: Endpoints = {
  PRODUCTION: "https://data.sequel.io",
  STAGING: "https://stg-analytics.introvoke.com",
  DEV: "https://dev-analytics.introvoke.com",
  TEST: "https://test-analytics.introvoke.com",
};

const DemoAppEndpoints: Endpoints = {
  PRODUCTION: "https://app.sequel.io",
  STAGING: "https://stg-app.sequel.io",
  DEV: "https://dev-app.sequel.io",
  TEST: "https://test-app.sequel.io",
};

/** These are the new endpoints hosted in the new Sequel API repo using tRPC */
const SequelApiEndpoints: Endpoints = {
  PRODUCTION: "https://sequel-api.sequelvideo.com",
  // STAGING: "https://stg-sequel-api.sequelvideo.com",
  STAGING: "http://localhost:3345",
  DEV: "https://dev-sequel-api.sequelvideo.com",
  TEST: "https://test-sequel-api.sequelvideo.com",
};

const AppSyncConfig: Endpoints<AppSyncConfigType> = {
  PRODUCTION: {
    aws_appsync_graphqlEndpoint: "https://graphql.sequelvideo.com/graphql",
    aws_appsync_region: "us-east-1",
    aws_appsync_authenticationType: "AWS_LAMBDA",
  },
  STAGING: {
    aws_appsync_graphqlEndpoint: "https://stg-graphql.sequelvideo.com/graphql",
    aws_appsync_region: "us-east-2",
    aws_appsync_authenticationType: "AWS_LAMBDA",
  },
  DEV: {
    aws_appsync_graphqlEndpoint: "https://dev-graphql.sequelvideo.com/graphql",
    aws_appsync_region: "us-west-2",
    aws_appsync_authenticationType: "AWS_LAMBDA",
  },
  TEST: {
    aws_appsync_graphqlEndpoint: "https://test-graphql.sequelvideo.com/graphql",
    aws_appsync_region: "us-west-2",
    aws_appsync_authenticationType: "AWS_LAMBDA",
  },
};

const getCurrentEndpoint = <T>(endpoints: Endpoints<T>) => {
  switch (import.meta.env.VITE_APP_ENV) {
    case "test":
      return endpoints.TEST;
    case "stg":
      return endpoints.STAGING;
    case "prod":
      return endpoints.PRODUCTION;
    default:
      return endpoints.DEV;
  }
};

const GetAnalyticsUrl = (): string => {
  if (import.meta.env.VITE_ANALYTICS_ENDPOINT) {
    return import.meta.env.VITE_ANALYTICS_ENDPOINT;
  }
  return getCurrentEndpoint(AnalyticsEndpoints);
};

const GetApiUrl = (): string => {
  if (import.meta.env.VITE_API_ENDPOINT) {
    return import.meta.env.VITE_API_ENDPOINT;
  }
  return getCurrentEndpoint(ApiEndpoints);
};

const GetDemoSiteUrl = () => {
  if (import.meta.env.VITE_DEMO_ENDPOINT) {
    return import.meta.env.VITE_DEMO_ENDPOINT;
  }
  return getCurrentEndpoint(DemoAppEndpoints);
};

const GetEmbedUrl = () => {
  if (import.meta.env.VITE_EMBED_ENDPOINT) {
    return import.meta.env.VITE_EMBED_ENDPOINT;
  }
  return getCurrentEndpoint(EmbedEndpoints);
};

const GetSequelApiUrl = () => {
  if (import.meta.env.VITE_SEQUEL_API_ENDPOINT) {
    return import.meta.env.VITE_SEQUEL_API_ENDPOINT;
  }
  return getCurrentEndpoint(SequelApiEndpoints);
};

/**
 * Makes an HTTP request to a resource URL to validate whether the endpoint
 * returns a successful response
 * @param url The URL for the resource
 * @param options.method The HTTP method to use, either "GET" or "HEAD", defaults to "HEAD"
 * @returns A promise which is resolved to `true` if the response was successful, `false` if not
 */
const isResourceAvailable = async (
  url: string,
  options?: { method?: "GET" | "HEAD"; params?: Record<string, unknown> }
) => {
  try {
    await axios({
      url,
      method: options?.method || "HEAD",
      params: {
        ...(options?.params || {}),
        // Add a query param to avoid hitting browser cache
        _t: Date.now(),
      },
    });
  } catch (e) {
    // ignore errors as we only care about a success response
    return false;
  }
  return true;
};

/**
 * Validates if the API is available and returns a successful response
 * @returns A promise which resolves to `true` if available, `false` if not
 */
const isApiAvailable = () => isResourceAvailable(`${GetApiUrl()}/api/ping`);

/**
 * Validates if the Analytics API is available and returns a successful response
 * @returns A promise which resolves to `true` if available, `false` if not
 */
const isAnalyticsApiAvailable = () =>
  isResourceAvailable(`${GetAnalyticsUrl()}/ping`);

/**
 * Get the AppSync config for the current stage. These values can be found in the AppSync
 * API settings or in the downloaded aws-exports.js file
 */
const GetAppSyncConfig = (): AppSyncConfigType => {
  if (
    import.meta.env.VITE_AWS_APPSYNC_GRAPHQL &&
    import.meta.env.VITE_AWS_APPSYNC_REGION
  ) {
    return {
      // NOTE: This config comes from the aws-exports.js file
      aws_appsync_graphqlEndpoint: import.meta.env.VITE_AWS_APPSYNC_GRAPHQL,
      aws_appsync_region: import.meta.env.VITE_AWS_APPSYNC_REGION,
      aws_appsync_authenticationType: "AWS_LAMBDA",
    };
  }

  return getCurrentEndpoint(AppSyncConfig);
};

/**
 * tRPC client for the new Sequel API
 */
export const trpcSequelApi = createTRPCProxyClient<SequelAppRouter>({
  links: [
    httpBatchLink({
      url: `${GetSequelApiUrl()}/sequel-api`,
    }),
  ],
});

export const ApiConfig = {
  GetApiUrl,
  GetAnalyticsUrl,
  GetDemoSiteUrl,
  GetEmbedUrl,
  GetSequelApiUrl,
  GetAppSyncConfig,
  isAnalyticsApiAvailable,
  isApiAvailable,
  isResourceAvailable,
};

export const __testable__ = {
  ApiEndpoints,
  AnalyticsEndpoints,
  DemoAppEndpoints,
  SequelApiEndpoints,
  getCurrentEndpoint,
};
