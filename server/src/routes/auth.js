import express from "express";
import crypto from "node:crypto";
import { usersRepo } from "../db/repositories.js";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "tripwise-super-secret-jwt-key-presentation-2025";

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString();
}

export function generateToken(payload, expiresInSeconds = 7 * 24 * 60 * 60) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };
  const encHeader = base64UrlEncode(JSON.stringify(header));
  const encPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${encHeader}.${encPayload}`)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return `${encHeader}.${encPayload}.${signature}`;
}

export function verifyToken(token) {
  try {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [encHeader, encPayload, signature] = parts;
    const expectedSig = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${encHeader}.${encPayload}`)
      .digest("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
    if (signature !== expectedSig) return null;
    const payload = JSON.parse(base64UrlDecode(encPayload));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash) return false;
  if (storedHash.includes(":")) {
    const [salt, key] = storedHash.split(":");
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  }
  // Backwards compatibility for legacy plain sha256 or plaintext
  const sha = crypto.createHash("sha256").update(password).digest("hex");
  return storedHash === sha || storedHash === password;
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

    const token = generateToken({ id: user.id, email: user.email, name: user.name });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token,
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

    if (!verifyPassword(password, user.password_hash)) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    const token = generateToken({ id: user.id, email: user.email, name: user.name });

    return res.json({
      success: true,
      message: "Logged in successfully.",
      token,
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
 * GET /api/auth/verify
 */
router.get("/verify", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired authorization token.",
      });
    }

    const user = usersRepo.findUserById(payload.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found.",
      });
    }

    return res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
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
