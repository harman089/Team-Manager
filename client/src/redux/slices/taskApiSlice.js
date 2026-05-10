import { apiSlice } from "./apiSlice";

const TASK_URL = "/task";

export const taskApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => ({
        url: `${TASK_URL}/dashboard`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Task"],
    }),
    getAllTasks: builder.query({
      query: ({ strQuery, isTrashed, search }) => ({
        url: `${TASK_URL}?stage=${strQuery || ""}&isTrashed=${isTrashed || ""}&search=${search || ""}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Task"],
    }),
    createTask: builder.mutation({
      query: (data) => ({
        url: `${TASK_URL}/create`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Task"],
    }),
    duplicateTask: builder.mutation({
      query: (id) => ({
        url: `${TASK_URL}/duplicate/${id}`,
        method: "POST",
        body: {},
        credentials: "include",
      }),
      invalidatesTags: ["Task"],
    }),
    updateTask: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${TASK_URL}/update/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Task"],
    }),
    trashTask: builder.mutation({
      query: ({ id }) => ({
        url: `${TASK_URL}/${id}`,
        method: "PUT",
        body: { isTrashed: true },
        credentials: "include",
      }),
      invalidatesTags: ["Task"],
    }),
    getSingleTask: builder.query({
      query: (id) => ({
        url: `${TASK_URL}/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Task"],
    }),
    createSubTask: builder.mutation({
      query: ({ data, id }) => ({
        url: `${TASK_URL}/create-subtask/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Task"],
    }),
    postTaskActivity: builder.mutation({
      query: ({ data, id }) => ({
        url: `${TASK_URL}/activity/${id}`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Task"],
    }),
    deleteRestoreTask: builder.mutation({
      query: ({ id, actionType }) => ({
        url: `${TASK_URL}/delete-restore/${id}?actionType=${actionType}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Task"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetAllTasksQuery,
  useCreateTaskMutation,
  useDuplicateTaskMutation,
  useUpdateTaskMutation,
  useTrashTaskMutation,
  useGetSingleTaskQuery,
  useCreateSubTaskMutation,
  usePostTaskActivityMutation,
  useDeleteRestoreTaskMutation,
} = taskApiSlice;
