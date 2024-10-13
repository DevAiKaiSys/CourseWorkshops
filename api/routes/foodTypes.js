const { PrismaClient } = require("@prisma/client");
var jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
var express = require("express");
var router = express.Router();

// Get all food types
router.get("/", async function (req, res) {
  try {
    const foodTypes = await prisma.foodType.findMany();
    return res.status(200).json(foodTypes);
  } catch (error) {
    console.error("Error retrieving food types:", error);
    return res.status(500).send({ error: error.message });
  }
});

// Create a new food type
router.post("/", async function (req, res) {
  const { name, remark, status } = req.body;

  // Validate the request body
  if (!name || !status) {
    return res.status(400).send({ message: "Name and status are required." });
  }

  try {
    const foodType = await prisma.foodType.create({
      data: {
        name,
        ...(remark && { remark }), // Only add remark if it exists
        status,
      },
    });
    // Send back the created food type
    return res.status(201).json(foodType);
  } catch (error) {
    console.error("Error creating food type:", error);
    return res.status(500).send({ error: error.message });
  }
});

module.exports = router;
