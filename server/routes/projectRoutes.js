import express from "express";
import { protectRoute } from "../middlewares/authMiddlewave.js";
import {
  createProject,
  getUserProjects,
  getProjectById,
  updateProject,
  addProjectMember,
  removeProjectMember,
  deleteProject,
} from "../controllers/projectController.js";

const router = express.Router();

// Project routes
router.post("/create", protectRoute, createProject);
router.get("/", protectRoute, getUserProjects);
router.get("/:id", protectRoute, getProjectById);
router.put("/:id", protectRoute, updateProject);
router.delete("/:id", protectRoute, deleteProject);

// Member management routes
router.post("/:id/add-member", protectRoute, addProjectMember);
router.post("/:id/remove-member", protectRoute, removeProjectMember);

export default router;
