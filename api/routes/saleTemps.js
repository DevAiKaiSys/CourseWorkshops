const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
var express = require("express");
const path = require("path");
const fs = require("fs");
var router = express.Router();

// Create a new sale item
router.post("/create", async (req, res) => {
  const { foodId, qty, price, tableNo, userId } = req.body;

  // Validate the request body
  if (!foodId || !qty || !price || !tableNo || !userId) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const sale = await prisma.saleTemp.create({
      data: {
        foodId,
        qty,
        price,
        tableNo,
        userId,
      },
    });
    return res
      .status(201)
      .json({ message: "Sale item created successfully.", sale });
  } catch (error) {
    console.error("Error creating sale item:", error);
    return res.status(500).json({ error: "Failed to create sale item." });
  }
});

module.exports = router;
