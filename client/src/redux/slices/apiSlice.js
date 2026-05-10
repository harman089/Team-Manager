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
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Task", "User", "Notification", "Project"],
  endpoints: (builder) => ({}),
});
