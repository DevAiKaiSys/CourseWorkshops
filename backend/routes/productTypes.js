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
    const productTypes = await prisma.productType.findMany({
      where: {
        status: "active",
      },
    }); // Fetch all product types
    res.status(200).json(productTypes); // Send the product types as the response
  } catch (error) {
    console.error("Error fetching product types:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

router.put("/update/:id", async function (req, res) {
  const { id } = req.params; // Get the ID from the path
  const { name, remark } = req.body; // Get name and remark from the request body

  // Validate input
  if (!id || !name) {
    return res.status(400).json({ error: "ID and name are required." });
  }

  try {
    const updatedProductType = await prisma.productType.update({
      where: { id },
      data: {
        name,
        remark,
      },
    });

    res.status(200).json({
      message: "Product type updated successfully.",
      updatedProductType,
    });
  } catch (error) {
    console.error("Error updating product type:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Product type not found." });
    }

    res.status(500).json({ error: "Internal server error." });
  }
});

router.delete("/remove/:id", async function (req, res) {
  const { id } = req.params;

  // Input validation (optional, depending on your ID format)
  if (!id) {
    return res.status(400).json({ error: "Invalid ID provided." });
  }

  try {
    const updatedProductType = await prisma.productType.update({
      where: { id },
      data: {
        status: "inactive",
      },
    });

    // Return 204 No Content for successful deletion
    return res.status(204).send(); // No content to return on successful delete
  } catch (error) {
    console.error("Error updating product type:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Product type not found." });
    }

    // Return a generic error message for other unexpected errors
    return res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
