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

module.exports = router;
