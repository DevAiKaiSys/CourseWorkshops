import express from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/* GET users listing. */
// router.get("/", async function (req, res, next) {
//   const adminUser = {
//     name: "Admin User",
//     username: "admin",
//     password: "admin",
//     level: "admin",
//     status: "active",
//   };

//   // Create admin user
//   const user = await prisma.user.create({
//     data: adminUser,
//   });

//   res.send("respond with a resource");
// });

router.get("/info", async function (req, res, next) {
  try {
    // Get the authorization header
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res
        .status(401)
        .json({ error: "No authorization token provided." });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ error: "Invalid authorization token format." });
    }

    // Verify the token
    const payload = jwt.verify(token, process.env.AUTH_SECRET);

    // Fetch the user from the database
    const user = await prisma.user.findUnique({
      select: {
        name: true,
        username: true,
        level: true,
      },
      where: {
        id: payload.id,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Send user data as response
    res.status(200).json(user);
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ error: "Internal server error." });
  }
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

router.put("/update", async function (req, res) {
  try {
    const { authorization } = req.headers;
    const [type, token] = authorization?.split(" ") || [];
    if (type !== "Bearer" || !token) {
      return res.status(401).json({ error: "Invalid authorization token." });
    }

    const payload = jwt.verify(token, process.env.AUTH_SECRET);
    const { id } = payload;

    const { name, username, password, level } = req.body;

    if (!name || !username || !level) {
      return res
        .status(400)
        .json({ error: "Name, username, and level are required." });
    }

    let oldPassword = password;
    if (!oldPassword) {
      const oldUser = await prisma.user.findFirst({ where: { id } });
      oldPassword = oldUser.password;
    }

    const user = await prisma.user.findFirst({ where: { id } });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, username, password: oldPassword, level },
    });

    res.status(200).json({ message: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
