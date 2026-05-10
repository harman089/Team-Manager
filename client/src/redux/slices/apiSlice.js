import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

let API_URI = import.meta.env.VITE_API_URL || "/api";

// Auto-fix: Ensure the URL ends with /api if it's an absolute URL
if (API_URI.startsWith("http") && !API_URI.endsWith("/api")) {
  API_URI = API_URI.endsWith("/") ? `${API_URI}api` : `${API_URI}/api`;
}

console.log("API_URI:", API_URI);

const baseQuery = fetchBaseQuery({
  baseUrl: API_URI,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    // Ensure credentials are sent with all requests
    return headers;
  },
});

const baseQueryWithErrorHandling = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const status = result.error?.status;
    const message = result.error?.data?.message || result.error?.error;

    // Log all errors for debugging
    console.error(`[API Error] ${status}:`, message);

    if (status === 401) {
      console.error("[AUTH] Unauthorized - Check if token/cookie is set");
      // Optional: dispatch logout action here
    } else if (status === 403) {
      console.error("[AUTH] Forbidden - User doesn't have permission");
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Task", "User", "Notification", "Project"],
  endpoints: (builder) => ({}),
});
