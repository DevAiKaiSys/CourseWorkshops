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
        SaleTempDetails: true,
      },
    });
    return res.status(200).json(sales);
  } catch (error) {
    console.error("Error retrieving sales:", error);
    return res.status(500).json({ error: "Failed to retrieve sales." });
  }
});

router.get("/listsaletempdetail/:saleTempId", async (req, res) => {
  const { saleTempId } = req.params;

  try {
    const sales = await prisma.saleTempDetail.findMany({
      where: {
        saleTempId: parseInt(saleTempId, 10),
      },
      orderBy: {
        id: "desc",
      },
      include: {
        SaleTemp: {
          include: {
            Food: true, // Include the Food model
          },
        },
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
// Create or update sale details for a given saleTempId
router.post("/createdetail", async (req, res) => {
  const { saleTempId, qty, addedMoney, tasteId, foodSizeId } = req.body;

  try {
    // Step 1: Get existing SaleTempDetail entries
    const existingDetails = await prisma.saleTempDetail.findMany({
      where: { saleTempId },
    });

    const existingCount = existingDetails.length;

    // Step 2: Determine how many new entries to create or how many to delete
    if (existingCount < qty) {
      // Create new entries if there are fewer existing entries than required
      const numberOfNewEntries = qty - existingCount;

      const saleDetails = [];
      for (let i = 0; i < numberOfNewEntries; i++) {
        const newSaleDetail = await prisma.saleTempDetail.create({
          data: {
            saleTempId,
            addedMoney,
            tasteId,
            foodSizeId,
          },
        });
        saleDetails.push(newSaleDetail);
      }

      return res.status(201).json({
        message: "Sale details created successfully.",
        saleDetails,
      });
    } else if (existingCount > qty) {
      // Delete excess entries if there are more existing entries than required
      const excessCount = existingCount - qty;
      const idsToDelete = existingDetails
        .slice(0, excessCount)
        .map((detail) => detail.id);

      await prisma.saleTempDetail.deleteMany({
        where: { id: { in: idsToDelete } },
      });

      return res.status(200).json({
        message: "Excess sale details deleted successfully.",
      });
    } else {
      // Update existing entries if the count is equal to qty
      for (const detail of existingDetails) {
        await prisma.saleTempDetail.update({
          where: { id: detail.id },
          data: {
            addedMoney,
            tasteId,
            foodSizeId,
          },
        });
      }

      return res.status(200).json({
        message: "Sale details updated successfully.",
      });
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

router.patch("/updateFoodSize", async (req, res) => {
  const { saleTempDetailId, foodSizeId, addedMoney } = req.body;

  // Validate request body
  if (!saleTempDetailId) {
    return res.status(400).json({
      message: "Invalid request. Ensure 'saleTempDetailId' is provided.",
    });
  }

  try {
    // Initialize moneyToAdd
    let moneyToAdd = null;

    if (foodSizeId) {
      const foodSize = await prisma.foodSize.findUnique({
        where: { id: parseInt(foodSizeId) },
      });

      if (!foodSize) {
        return res.status(404).json({ message: "Food size not found." });
      }

      // Use provided addedMoney or fallback to foodSize's addedMoney
      moneyToAdd = addedMoney !== undefined ? addedMoney : foodSize.moneyAdded;
    }

    if (addedMoney) {
      moneyToAdd = addedMoney;
    }

    // Update the sale temp detail
    const updatedSaleDetail = await prisma.saleTempDetail.update({
      where: { id: parseInt(saleTempDetailId) },
      data: {
        foodSizeId: foodSizeId || null, // Set to null if foodSizeId is not provided
        addedMoney: moneyToAdd,
      },
    });

    return res.json({
      message: "Sale item food size updated successfully.",
    });
  } catch (error) {
    console.error("Error updating food size:", error);
    return res.status(500).json({ error: "Failed to update food size." });
  }
});

module.exports = router;
