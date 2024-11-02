import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/create", async function (req, res) {
  try {
    await prisma.stockMaterial.create({
      data: req.body,
    });

    res.status(201).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
