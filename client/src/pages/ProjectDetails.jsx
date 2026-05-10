import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProjectByIdQuery, useDeleteProjectMutation, useRemoveProjectMemberMutation } from "../redux/slices/projectApiSlice";
import { useSelector } from "react-redux";
import Loading from "../components/Loader";
import AddMemberModal from "../components/AddMemberModal";
import { toast } from "sonner";
import { MdOutlineClose } from "react-icons/md";
import Button from "../components/Button";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [openAddMember, setOpenAddMember] = useState(false);
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();
  const [removeMember, { isLoading: isRemoving }] = useRemoveProjectMemberMutation();

  const {
    data: projectData,
    isLoading,
    refetch,
  } = useGetProjectByIdQuery(id);

  const project = projectData?.project;
  const isAdmin = project?.admin?._id === user?._id;

  const handleRemoveMember = async (memberId) => {
    try {
      if (window.confirm("Are you sure you want to remove this member?")) {
        await removeMember({
          id,
          memberId,
        }).unwrap();
        toast.success("Member removed successfully");
        refetch();
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to remove member");
    }
  };

  const handleDeleteProject = async () => {
    try {
      if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
        await deleteProject(id).unwrap();
        toast.success("Project deleted successfully");
        navigate("/projects");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete project");
    }
  };

  if (isLoading) return <Loading />;

  if (!project) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p className='text-gray-600'>Project not found</p>
      </div>
    );
  }

  return (
    <div className='w-full'>
      {/* Project Header */}
      <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
        <div className='flex justify-between items-start mb-4'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>{project.name}</h1>
            <p className='text-gray-600 mt-2'>{project.description}</p>
          </div>
          {isAdmin && (
            <button
              onClick={handleDeleteProject}
              disabled={isDeleting}
              className='bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg'
            >
              {isDeleting ? "Deleting..." : "Delete Project"}
            </button>
          )}
        </div>

        <div className='text-sm text-gray-600'>
          <p>
            <span className='font-semibold'>Admin:</span> {project.admin?.name}
          </p>
          <p>
            <span className='font-semibold'>Created:</span>{" "}
            {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Team Members Section */}
      <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold text-gray-900'>Team Members</h2>
          {isAdmin && (
            <button
              onClick={() => setOpenAddMember(true)}
              className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm'
            >
              + Add Member
            </button>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {project.members?.map((member) => (
            <div
              key={member._id}
              className='flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition'
            >
              <div>
                <p className='font-semibold text-gray-900'>{member.name}</p>
                <p className='text-sm text-gray-600'>{member.email}</p>
                <p className='text-xs text-blue-600'>{member.role}</p>
              </div>
              {isAdmin && member._id !== project.admin?._id && (
                <button
                  onClick={() => handleRemoveMember(member._id)}
                  disabled={isRemoving}
                  className='text-red-600 hover:text-red-700 disabled:opacity-50'
                >
                  <MdOutlineClose size={20} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tasks Section */}
      <div className='bg-white p-6 rounded-lg shadow-md'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>Project Tasks</h2>
        {project.tasks?.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {project.tasks.map((task) => (
              <div
                key={task._id}
                className='p-4 border border-gray-200 rounded-lg hover:shadow-md transition cursor-pointer'
              >
                <h3 className='font-semibold text-gray-900'>{task.title}</h3>
                <div className='flex justify-between items-center mt-2'>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      task.priority === "high"
                        ? "bg-red-100 text-red-700"
                        : task.priority === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {task.priority}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      task.stage === "completed"
                        ? "bg-green-100 text-green-700"
                        : task.stage === "in progress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {task.stage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-gray-600'>No tasks in this project yet</p>
        )}
      </div>

      <AddMemberModal
        open={openAddMember}
        setOpen={setOpenAddMember}
        projectId={id}
        refetch={refetch}
        projectMembers={project.members}
      />
    </div>
  );
};

export default ProjectDetails;
