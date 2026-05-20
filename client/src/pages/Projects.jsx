import React, { useState } from "react";
import { useGetUserProjectsQuery } from "../redux/slices/projectApiSlice";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loader";
import CreateProjectModal from "../components/CreateProjectModal";
import Button from "../components/Button";
import { toast } from "sonner";

const Projects = () => {
  const navigate = useNavigate();
  const [openCreateProject, setOpenCreateProject] = useState(false);
  const {
    data: projectsData,
    isLoading,
    refetch,
  } = useGetUserProjectsQuery();

  const projects = projectsData?.projects || [];

  if (isLoading) return <Loading />;

  return (
    <div className='w-full'>
      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Projects</h1>
          <p className='text-gray-600 mt-1'>
            Manage and organize your team projects
          </p>
        </div>
        <Button
          onClick={() => setOpenCreateProject(true)}
          label='+ New Project'
          className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg'
        />
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {projects.map((project) => (
            <div
              key={project._id}
              onClick={() => navigate(`/project/${project._id}`)}
              className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer'
            >
              <div className='mb-4'>
                <h2 className='text-xl font-bold text-gray-900'>
                  {project.name}
                </h2>
                <p className='text-gray-600 text-sm mt-2 line-clamp-2'>
                  {project.description}
                </p>
              </div>

              <div className='space-y-2 mb-4 text-sm text-gray-600'>
                <p>
                  <span className='font-semibold'>Admin:</span>{" "}
                  {project.admin?.name}
                </p>
                <p>
                  <span className='font-semibold'>Members:</span>{" "}
                  {project.members?.length || 0}
                </p>
                <p>
                  <span className='font-semibold'>Tasks:</span>{" "}
                  {project.tasks?.length || 0}
                </p>
              </div>

              <div className='flex gap-2 flex-wrap'>
                {project.members?.slice(0, 3).map((member) => (
                  <div
                    key={member._id}
                    className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold'
                    title={member.name}
                  >
                    {member.name
                      ? member.name
                          .split(" ")
                          .filter((n) => n && n.length > 0)
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)
                      : ""}
                  </div>
                ))}
                {project.members?.length > 3 && (
                  <div className='w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs font-semibold'>
                    +{project.members.length - 3}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='bg-white p-12 rounded-lg shadow-md text-center'>
          <p className='text-gray-600 mb-4'>No projects yet</p>
          <Button
            onClick={() => setOpenCreateProject(true)}
            label='Create First Project'
            className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-block'
          />
        </div>
      )}

      <CreateProjectModal
        open={openCreateProject}
        setOpen={setOpenCreateProject}
        refetch={refetch}
      />
    </div>
  );
};

export default Projects;
