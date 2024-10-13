const { PrismaClient } = require("@prisma/client");
var jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
var express = require("express");
var router = express.Router();

// Get all food types
router.get("/list", async function (req, res) {
  try {
    const foodTypes = await prisma.foodType.findMany({
      where: {
        status: "use",
      },
    });
    // example
    // Add a delay of 2 seconds (2000 milliseconds)
    /* setTimeout(() => {
      return res.status(200).json(foodTypes);
    }, 2000); */ // Adjust the delay time as needed
    return res.status(200).json(foodTypes);
  } catch (error) {
    console.error("Error retrieving food types:", error);
    return res.status(500).send({ error: error.message });
  }
});

// Create a new food type
router.post("/create", async function (req, res) {
  const { name, remark } = req.body;

  // Validate the request body
  if (!name) {
    return res.status(400).send({ message: "Name are required." });
  }

  try {
    const foodType = await prisma.foodType.create({
      data: {
        name,
        ...(remark && { remark }), // Only add remark if it exists
        status: "use",
      },
    });
    // Send back the created food type
    return res.status(201).json({ message: "success" });
  } catch (error) {
    console.error("Error creating food type:", error);
    return res.status(500).send({ error: error.message });
  }
});

// Delete a food type by ID
router.patch("/remove/:id", async function (req, res) {
  const { id } = req.params;

  try {
    const foodType = await prisma.foodType.update({
      where: {
        id: parseInt(id), // Ensure id is an integer
      },
      data: {
        status: "delete", // Update status to "deleted"
      },
    });
    return res.status(200).json({ message: "success" });
  } catch (error) {
    if (error.code === "P2025") {
      // Prisma error code for not found
      return res.status(404).send({ message: "Food type not found." });
    }
    console.error("Error updating food type status:", error);
    return res.status(500).send({ error: error.message });
  }
});

// Update food type
router.put("/update", async function (req, res) {
  const { id, name, remark } = req.body;

  // Validate the request body
  if (!id || !name) {
    return res.status(400).send({ message: "ID and Name are required." });
  }

  try {
    const foodType = await prisma.foodType.update({
      where: { id: Number(id) }, // Ensure id is a number
      data: {
        name,
        ...(remark && { remark }),
      },
    });

    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error("Error updating food type:", error);
    return res.status(500).send({ error: error.message });
  }
});

module.exports = router;
