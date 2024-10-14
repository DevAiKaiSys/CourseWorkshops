const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
var express = require("express");
const path = require("path");
const fs = require("fs");
var router = express.Router();

// Get all sale items for a specific user
router.get("/list/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const sales = await prisma.saleTemp.findMany({
      where: {
        userId: parseInt(userId, 10),
      },
      orderBy: {
        id: "desc",
      },
      include: {
        Food: true, // Include related food details
      },
    });
    return res.status(200).json(sales);
  } catch (error) {
    console.error("Error retrieving sales:", error);
    return res.status(500).json({ error: "Failed to retrieve sales." });
  }
});

// Create a new sale item
router.post("/create", async (req, res) => {
  const { foodId, qty, price, tableNo, userId } = req.body;

  // Validate the request body
  if (!foodId || !qty || !price || !tableNo || !userId) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if a sale item already exists for the given foodId and userId
    const existingSale = await prisma.saleTemp.findFirst({
      where: {
        foodId,
        userId: parseInt(userId, 10), // Ensure userId is an integer
      },
    });

    if (existingSale) {
      // If it exists, update the quantity and price (if needed)
      const updatedSale = await prisma.saleTemp.update({
        where: { id: existingSale.id },
        data: {
          qty: existingSale.qty + qty, // Increment the quantity
          price, // Update price if needed
          tableNo, // Update table number if needed
        },
      });
      return res.status(200).json({
        message: "Sale item updated successfully.",
        sale: updatedSale,
      });
    } else {
      // If it doesn't exist, create a new sale item
      const newSale = await prisma.saleTemp.create({
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
        .json({ message: "Sale item created successfully.", sale: newSale });
    }
  } catch (error) {
    console.error("Error creating or updating sale item:", error);
    return res
      .status(500)
      .json({ error: "Failed to create or update sale item." });
  }
});

// Delete a sale item for a specific user
router.delete("/clear/:userId", async (req, res) => {
  const { userId } = req.params;

  // Validate the request body
  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const sale = await prisma.saleTemp.deleteMany({
      where: {
        userId: parseInt(userId, 10), // Ensure userId is an integer
      },
    });

    if (sale.count === 0) {
      return res.status(404).json({ message: "Sale item not found." });
    }

    return res.status(200).json({ message: "Sale item deleted successfully." });
  } catch (error) {
    console.error("Error deleting sale item:", error);
    return res.status(500).json({ error: "Failed to delete sale item." });
  }
});

// Delete a sale item for a specific user
router.delete("/remove/:saleTempId", async (req, res) => {
  const { saleTempId } = req.params;

  // Validate the request body
  if (!saleTempId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const sale = await prisma.saleTemp.deleteMany({
      where: {
        id: parseInt(saleTempId, 10), // Ensure userId is an integer
      },
    });

    if (sale.count === 0) {
      return res.status(404).json({ message: "Sale item not found." });
    }

    return res.status(200).json({ message: "Sale item deleted successfully." });
  } catch (error) {
    console.error("Error deleting sale item:", error);
    return res.status(500).json({ error: "Failed to delete sale item." });
  }
});

// Change quantity of a sale item
router.patch("/changeQty", async (req, res) => {
  const { id, operation, qty } = req.body;

  // Validate request body
  if (!id || !operation) {
    return res.status(400).json({
      message: "Invalid request. Ensure 'id' and 'operation' are provided.",
    });
  }

  // Default qty to 1 if not provided
  const quantity = qty ? qty : 1;

  try {
    // Fetch the existing sale item
    const sale = await prisma.saleTemp.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!sale) {
      return res.status(404).json({ message: "Sale item not found." });
    }

    let newQty = sale.qty;

    if (operation === "up") {
      // Increase quantity
      newQty += quantity; // Calculate new quantity
    } else if (operation === "down") {
      // Check if the quantity can be decreased
      if (sale.qty - quantity < 1) {
        return res
          .status(202)
          .json({ message: "Quantity decrease ignored: cannot go below one." });
      }
      newQty -= quantity; // Calculate new quantity
    } else {
      return res
        .status(400)
        .json({ message: "Invalid operation. Use 'up' or 'down'." });
    }

    // Update the quantity in the database
    const updatedSale = await prisma.saleTemp.update({
      where: { id: parseInt(id, 10) },
      data: { qty: newQty },
    });

    return res
      .status(200)
      .json({ message: "Quantity changed successfully.", sale: updatedSale });
  } catch (error) {
    console.error("Error changing quantity:", error);
    return res.status(500).json({ error: "Failed to change quantity." });
  }
});

module.exports = router;
