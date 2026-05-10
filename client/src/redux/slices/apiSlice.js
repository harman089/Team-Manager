import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URI = import.meta.env.VITE_API_URL || "/api";

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
