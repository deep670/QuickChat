import User from "../models/User.js";
import jwt from "jsonwebtoken";

// MIDDLEWARE TO PROTECT ROUTES
export const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // CHECK IF HEADER EXISTS
    if (!authHeader) {
      return res.json({
        success: false,
        message: "jwt must be provided",
      });
    }

    // CHECK FORMAT
    if (!authHeader.startsWith("Bearer ")) {
      return res.json({
        success: false,
        message: "Invalid token format",
      });
    }

    // EXTRACT TOKEN
    const token = authHeader.split(" ")[1];

    // VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // FIND USER
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // ATTACH USER TO REQUEST
    req.user = user;

    next();
  } catch (error) {
    console.log("Auth Middleware Error:", error.message);

    res.json({
      success: false,
      message: error.message,
    });
  }
};