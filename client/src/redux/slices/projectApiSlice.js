import { apiSlice } from "./apiSlice";

const PROJECT_URL = "/project";

export const projectApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProject: builder.mutation({
      query: (data) => ({
        url: `${PROJECT_URL}/create`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Project"],
    }),
    getUserProjects: builder.query({
      query: () => ({
        url: `${PROJECT_URL}/`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Project"],
    }),
    getProjectById: builder.query({
      query: (id) => ({
        url: `${PROJECT_URL}/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Project"],
    }),
    updateProject: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${PROJECT_URL}/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Project"],
    }),
    addProjectMember: builder.mutation({
      query: ({ id, memberId }) => ({
        url: `${PROJECT_URL}/${id}/add-member`,
        method: "POST",
        body: { memberId },
        credentials: "include",
      }),
      invalidatesTags: ["Project"],
    }),
    removeProjectMember: builder.mutation({
      query: ({ id, memberId }) => ({
        url: `${PROJECT_URL}/${id}/remove-member`,
        method: "POST",
        body: { memberId },
        credentials: "include",
      }),
      invalidatesTags: ["Project"],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `${PROJECT_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Project"],
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useGetUserProjectsQuery,
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
  useAddProjectMemberMutation,
  useRemoveProjectMemberMutation,
  useDeleteProjectMutation,
} = projectApiSlice;
