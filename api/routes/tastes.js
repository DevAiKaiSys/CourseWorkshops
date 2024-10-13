const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
var express = require("express");
var router = express.Router();

// Get all tastes
router.get("/list", async (req, res) => {
  try {
    const tastes = await prisma.taste.findMany({
      where: {
        status: "use",
      },
      include: {
        FoodType: true, // Include related FoodType
      },
    });
    return res.status(200).json(tastes);
  } catch (error) {
    console.error("Error retrieving tastes:", error);
    return res.status(500).json({ error: "Failed to retrieve tastes." });
  }
});

// Create a new taste
router.post("/create", async (req, res) => {
  const { foodTypeId, name, remark } = req.body; // Changed 'price' to 'moneyAdded'

  // Validate the request body
  if (!name) {
    return res.status(400).json({ message: "Name is required." });
  }

  try {
    const taste = await prisma.taste.create({
      data: {
        foodTypeId,
        name,
        ...(remark && { remark }), // Only add remark if it exists
        status: "use",
      },
    });
    return res
      .status(201)
      .json({ message: "Taste created successfully.", taste });
  } catch (error) {
    console.error("Error creating taste:", error);
    return res.status(500).json({ error: "Failed to create taste." });
  }
});

// Mark a taste as deleted
router.patch("/remove/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedTaste = await prisma.taste.update({
      where: {
        id: parseInt(id, 10), // Ensure id is an integer
      },
      data: {
        status: "deleted", // Update status to "deleted"
      },
    });
    return res
      .status(200)
      .json({ message: "Taste marked as deleted.", updatedTaste });
  } catch (error) {
    if (error.code === "P2025") {
      // Prisma error code for not found
      return res.status(404).json({ message: "Taste not found." });
    }
    console.error("Error updating taste status:", error);
    return res.status(500).json({ error: "Failed to update taste." });
  }
});

// Update a taste
router.put("/update", async (req, res) => {
  const { foodTypeId, id, name, remark } = req.body; // Changed 'price' to 'moneyAdded'

  // Validate the request body
  if (!id || !name) {
    return res.status(400).json({ message: "ID and Name are required." });
  }

  try {
    const updatedTaste = await prisma.taste.update({
      where: { id: Number(id) }, // Ensure id is a number
      data: {
        foodTypeId,
        name,
        ...(remark && { remark }),
      },
    });

    return res
      .status(200)
      .json({ message: "Taste updated successfully.", updatedTaste });
  } catch (error) {
    console.error("Error updating taste:", error);
    return res.status(500).json({ error: "Failed to update taste." });
  }
});

module.exports = router;
