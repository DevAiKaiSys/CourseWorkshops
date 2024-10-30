import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/create", async function (req, res, next) {
  try {
    const { name, remark } = req.body;

    const user = await prisma.productType.create({
      data: {
        name,
        remark,
      },
    });

    res.status(201).json({ message: "success" });
  } catch (error) {
    console.error("Error creating product type:", error);

    // Handle specific errors
    if (error.code === "P2002") {
      // Unique constraint violation
      return res
        .status(409)
        .json({ error: "Product type with this name already exists." });
    }

    // General error response
    res.status(500).json({ error: "Internal server error." });
  }
});

router.get("/list", async function (req, res) {
  try {
    const productTypes = await prisma.productType.findMany(); // Fetch all product types
    res.status(200).json(productTypes); // Send the product types as the response
  } catch (error) {
    console.error("Error fetching product types:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
