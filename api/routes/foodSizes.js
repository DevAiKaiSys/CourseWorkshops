const { PrismaClient } = require("@prisma/client");
var jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
var express = require("express");
var router = express.Router();

// Get all food sizes
router.get("/list", async (req, res) => {
  try {
    const foodSizes = await prisma.foodSize.findMany({
      where: {
        status: "use",
      },
    });
    return res.status(200).json(foodSizes);
  } catch (error) {
    console.error("Error retrieving food sizes:", error);
    return res.status(500).json({ error: "Failed to retrieve food sizes." });
  }
});

// Create a new food size
router.post("/create", async (req, res) => {
  const { foodTypeId, name, price, remark } = req.body;

  // Validate the request body
  if (!name) {
    return res.status(400).json({ message: "Name is required." });
  }

  try {
    await prisma.foodSize.create({
      data: {
        foodTypeId,
        name,
        ...(price !== undefined && { moneyAdded: price }), // Only add price if it is defined
        ...(remark && { remark }), // Only add remark if it exists
        status: "use",
      },
    });
    return res.status(201).json({ message: "Food size created successfully." });
  } catch (error) {
    console.error("Error creating food size:", error);
    return res.status(500).json({ error: "Failed to create food size." });
  }
});

// Mark a food size as deleted
router.patch("/remove/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.foodSize.update({
      where: {
        id: parseInt(id, 10), // Ensure id is an integer
      },
      data: {
        status: "deleted", // Update status to "deleted"
      },
    });
    return res.status(200).json({ message: "Food size marked as deleted." });
  } catch (error) {
    if (error.code === "P2025") {
      // Prisma error code for not found
      return res.status(404).json({ message: "Food size not found." });
    }
    console.error("Error updating food size status:", error);
    return res.status(500).json({ error: "Failed to update food size." });
  }
});

// Update a food size
router.put("/update", async (req, res) => {
  const { id, name, price, remark } = req.body;

  // Validate the request body
  if (!id || !name) {
    return res.status(400).json({ message: "ID and Name are required." });
  }

  try {
    await prisma.foodSize.update({
      where: { id: Number(id) }, // Ensure id is a number
      data: {
        name,
        ...(price !== undefined && { moneyAdded: price }), // Only add price if it is defined
        ...(remark && { remark }),
      },
    });

    return res.status(200).json({ message: "Food size updated successfully." });
  } catch (error) {
    console.error("Error updating food size:", error);
    return res.status(500).json({ error: "Failed to update food size." });
  }
});

module.exports = router;
