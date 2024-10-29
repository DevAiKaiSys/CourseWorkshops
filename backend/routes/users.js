import express from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/* GET users listing. */
router.get("/", async function (req, res, next) {
  const adminUser = {
    name: "Admin User",
    username: "admin",
    password: "admin",
    level: "admin",
    status: "active",
  };

  // Create admin user
  const user = await prisma.user.create({
    data: adminUser,
  });

  res.send("respond with a resource");
});

router.post("/signIn", async function (req, res, next) {
  try {
    const { username, password } = req.body;

    // Trim whitespace
    const trimmedUsername = username?.trim();
    const trimmedPassword = password?.trim();

    // Validate input
    if (!trimmedUsername || !trimmedPassword) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }

    // Find user by username
    const user = await prisma.user.findFirst({
      where: { username: trimmedUsername },
    });

    // Check if user exists and password matches
    if (!user || user.password !== trimmedPassword) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    // Create payload and token
    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(payload, process.env.AUTH_SECRET, {
      expiresIn: "30d",
    });

    // Send response
    res.status(200).json({ token, level: user.level, id: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
