import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/list", async function (req, res) {
  try {
    const materials = await prisma.material.findMany({
      where: { status: "active" },
    });
    res.json(materials);
  } catch (error) {
    console.error("Error fetching materials:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/create", async function (req, res) {
  try {
    const { name, remark, balance, unit, price } = req.body;

    const material = await prisma.material.create({
      data: {
        name,
        remark,
        balance,
        unit,
        price,
      },
    });

    res.status(201).json(material);
  } catch (error) {
    console.error("Error creating material:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/update/:id", async function (req, res) {
  try {
    const { id } = req.params;
    const { name, remark, balance, unit, price } = req.body;

    const material = await prisma.material.update({
      where: { id },
      data: {
        name,
        remark,
        balance,
        unit,
        price,
      },
    });

    res.status(200).json(material);
  } catch (error) {
    console.error("Error updating material:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/remove/:id", async function (req, res) {
  try {
    const { id } = req.params;
    const material = await prisma.material.update({
      where: { id },
      data: {
        status: "inactive",
      },
    });

    res.status(200).json(material);
  } catch (error) {
    console.error("Error updating material:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
