import Project from "../models/project.js";
import User from "../models/user.js";
import Task from "../models/task.js";

// Create a new project
export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const { userId } = req.user;

    if (!name || !name.trim()) {
      return res.status(400).json({
        status: false,
        message: "Project name is required",
      });
    }

    const project = await Project.create({
      name: name.trim(),
      description: description?.trim() || "",
      admin: userId,
      members: [userId],
    });

    const populatedProject = await project.populate(
      "admin members",
      "name email title role"
    );

    res.status(201).json({
      status: true,
      message: "Project created successfully",
      project: populatedProject,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      message: error.message || "Failed to create project",
    });
  }
};

// Get all projects for a user
export const getUserProjects = async (req, res) => {
  try {
    const { userId } = req.user;

    const projects = await Project.find({
      $or: [{ admin: userId }, { members: userId }],
    })
      .populate("admin", "name email title")
      .populate("members", "name email title role")
      .populate("tasks")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      projects,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      message: error.message || "Failed to fetch projects",
    });
  }
};

// Get project by ID
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    // Validate ID format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: false,
        message: "Invalid project ID format",
      });
    }

    const project = await Project.findById(id)
      .populate("admin", "name email title")
      .populate("members", "name email title role")
      .populate({
        path: "tasks",
        populate: {
          path: "team",
          select: "name email title",
        },
      });

    if (!project) {
      return res.status(404).json({
        status: false,
        message: "Project not found",
      });
    }

    // Check if user is project admin or member
    const isAdminOrMember =
      project.admin._id.toString() === userId ||
      project.members.some((m) => m._id.toString() === userId);

    if (!isAdminOrMember) {
      return res.status(403).json({
        status: false,
        message: "Not authorized to access this project",
      });
    }

    res.status(200).json({
      status: true,
      project,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      message: error.message || "Failed to fetch project",
    });
  }
};

// Update project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const { userId } = req.user;

    // Validate ID format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: false,
        message: "Invalid project ID format",
      });
    }

    if (name && !name.trim()) {
      return res.status(400).json({
        status: false,
        message: "Project name cannot be empty",
      });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        status: false,
        message: "Project not found",
      });
    }

    // Only admin can update
    if (project.admin.toString() !== userId) {
      return res.status(403).json({
        status: false,
        message: "Not authorized to update this project",
      });
    }

    if (name) project.name = name.trim();
    if (description !== undefined) project.description = description.trim();

    const updatedProject = await project.save();
    await updatedProject.populate("admin members", "name email title");

    res.status(200).json({
      status: true,
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      message: error.message || "Failed to update project",
    });
  }
};

// Add member to project
export const addProjectMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { memberId } = req.body;
    const { userId } = req.user;

    // Validate IDs format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/) || !memberId || !memberId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: false,
        message: "Invalid project or member ID format",
      });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        status: false,
        message: "Project not found",
      });
    }

    // Only admin can add members
    if (project.admin.toString() !== userId) {
      return res.status(403).json({
        status: false,
        message: "Not authorized to add members to this project",
      });
    }

    // Check if member exists
    const member = await User.findById(memberId);
    if (!member) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    // Check if already a member
    if (project.members.includes(memberId)) {
      return res.status(400).json({
        status: false,
        message: "User is already a member of this project",
      });
    }

    project.members.push(memberId);
    const updatedProject = await project.save();
    await updatedProject.populate("admin members", "name email title role");

    res.status(200).json({
      status: true,
      message: "Member added successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      message: error.message || "Failed to add member",
    });
  }
};

// Remove member from project
export const removeProjectMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { memberId } = req.body;
    const { userId } = req.user;

    // Validate IDs format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/) || !memberId || !memberId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: false,
        message: "Invalid project or member ID format",
      });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        status: false,
        message: "Project not found",
      });
    }

    // Only admin can remove members
    if (project.admin.toString() !== userId) {
      return res.status(403).json({
        status: false,
        message: "Not authorized to remove members from this project",
      });
    }

    // Cannot remove admin
    if (project.admin.toString() === memberId) {
      return res.status(400).json({
        status: false,
        message: "Cannot remove project admin",
      });
    }

    project.members = project.members.filter(
      (m) => m.toString() !== memberId
    );
    const updatedProject = await project.save();
    await updatedProject.populate("admin members", "name email title role");

    res.status(200).json({
      status: true,
      message: "Member removed successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      message: error.message || "Failed to remove member",
    });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    // Validate ID format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: false,
        message: "Invalid project ID format",
      });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        status: false,
        message: "Project not found",
      });
    }

    // Only admin can delete
    if (project.admin.toString() !== userId) {
      return res.status(403).json({
        status: false,
        message: "Not authorized to delete this project",
      });
    }

    // Delete associated tasks
    await Task.deleteMany({ _id: { $in: project.tasks } });

    await Project.findByIdAndDelete(id);

    res.status(200).json({
      status: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      message: error.message || "Failed to delete project",
    });
  }
};
