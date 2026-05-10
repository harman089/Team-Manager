import { apiSlice } from "./apiSlice";

const AUTH_URL = "/user";


export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: "POST",
        credentials: "include",
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/register`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/profile`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),
    getTeamList: builder.query({
      query: () => ({
        url: `${AUTH_URL}/get-team`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${AUTH_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),
    activateUser: builder.mutation({
      query: ({ id, isActive }) => ({
        url: `${AUTH_URL}/${id}`,
        method: "PUT",
        body: { isActive },
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),
    getNotifications: builder.query({
      query: () => ({
        url: `${AUTH_URL}/notifications`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Notification"],
    }),
    markNotificationRead: builder.mutation({
      query: ({ isReadType, id }) => ({
        url: `${AUTH_URL}/read-noti?isReadType=${isReadType}&id=${id || ""}`,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: ["Notification"],
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/change-password`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useGetTeamListQuery,
  useDeleteUserMutation,
  useActivateUserMutation,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useChangePasswordMutation,
} = userApiSlice;
