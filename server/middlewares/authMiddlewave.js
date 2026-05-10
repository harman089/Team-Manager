import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protectRoute = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    // Debug logging
    if (process.env.NODE_ENV !== "production") {
      console.log("[AUTH] Token present:", !!token);
      console.log("[AUTH] Cookies:", req.cookies);
      console.log("[AUTH] Headers:", req.headers.origin);
    }

    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      const resp = await User.findById(decodedToken.userId).select(
        "isAdmin email"
      );

      if (!resp) {
        return res.status(401).json({
          status: false,
          message: "User not found. Please login again.",
        });
      }

      req.user = {
        email: resp.email,
        isAdmin: resp.isAdmin,
        userId: decodedToken.userId,
      };

      next();
    } else {
      console.log(
        "[AUTH] No token found. Origin:",
        req.headers.origin,
        "Cookies:",
        Object.keys(req.cookies)
      );
      return res.status(401).json({
        status: false,
        message: "Not authorized. Try login again.",
      });
    }
  } catch (error) {
    console.error("[AUTH_ERROR]", error.message);
    return res.status(401).json({
      status: false,
      message: "Not authorized. Try login again.",
    });
  }
};

const isAdminRoute = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(401).json({
      status: false,
      message: "Not authorized as admin. Try login as admin.",
    });
  }
};

export { isAdminRoute, protectRoute };
