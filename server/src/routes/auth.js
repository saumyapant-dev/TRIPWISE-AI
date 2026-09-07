import express from "express";
import crypto from "node:crypto";
import { usersRepo } from "../db/repositories.js";

const router = express.Router();

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

/**
 * POST /api/auth/signup
 */
router.post("/signup", (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters.",
      });
    }

    const existing = usersRepo.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: "An account with this email already exists. Please sign in.",
      });
    }

    const user = usersRepo.createUser({
      name: name.trim(),
      email: email.trim(),
      passwordHash: hashPassword(password),
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/login
 */
router.post("/login", (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required.",
      });
    }

    const user = usersRepo.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    const inputHash = hashPassword(password);
    if (user.password_hash !== inputHash && user.password_hash !== password) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    return res.json({
      success: true,
      message: "Logged in successfully.",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/auth/me/:id
 */
router.get("/me/:id", (req, res, next) => {
  try {
    const user = usersRepo.findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found.",
      });
    }

    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
