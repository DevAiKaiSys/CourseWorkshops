const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
var express = require("express");
const path = require("path");
const fs = require("fs");
var router = express.Router();

// Get all foods
router.get("/list", async (req, res) => {
  try {
    const foods = await prisma.food.findMany({
      where: {
        status: "use",
      },
      orderBy: {
        id: "desc",
      },
      include: {
        FoodType: true,
      },
    });
    return res.status(200).json(foods);
  } catch (error) {
    console.error("Error retrieving foods:", error);
    return res.status(500).json({ error: "Failed to retrieve foods." });
  }
});

// Create a new food item
router.post("/create", async (req, res) => {
  const { foodTypeId, foodType, name, fileName, price, remark } = req.body;

  console.log(req.body);

  // Validate the request body
  if (!name) {
    return res.status(400).json({ message: "Name is required." });
  }

  if (typeof price !== "number" || price < 0) {
    return res
      .status(400)
      .json({ message: "Price must be a non-negative number." });
  }

  try {
    const food = await prisma.food.create({
      data: {
        foodTypeId,
        foodType,
        name,
        ...(fileName !== undefined && { img: fileName }), // Use old format
        ...(price !== undefined && { price }), // Only add price if it is defined
        ...(remark && { remark }), // Only add remark if it exists
        status: "use",
      },
    });
    return res
      .status(201)
      .json({ message: "Food item created successfully.", food });
  } catch (error) {
    console.error("Error creating food item:", error);
    return res.status(500).json({ error: "Failed to create food item." });
  }
});

// Mark a food item as deleted
router.patch("/remove/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const food = await prisma.food.update({
      where: {
        id: parseInt(id, 10), // Ensure id is an integer
      },
      data: {
        status: "deleted", // Update status to "deleted"
      },
    });
    return res
      .status(200)
      .json({ message: "Food item marked as deleted.", food });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Food item not found." });
    }
    console.error("Error updating food item status:", error);
    return res
      .status(500)
      .json({ error: "Failed to update food item status." });
  }
});

// Update a food item
router.put("/update", async (req, res) => {
  const { foodTypeId, id, foodType, name, fileName, price, remark } = req.body;

  // Validate the request body
  if (!id || !name) {
    return res.status(400).json({ message: "ID and Name are required." });
  }

  if (price !== undefined && (typeof price !== "number" || price < 0)) {
    return res
      .status(400)
      .json({ message: "Price must be a non-negative number." });
  }

  try {
    const food = await prisma.food.update({
      where: { id: Number(id) }, // Ensure id is a number
      data: {
        foodTypeId,
        ...(foodType !== undefined && { foodType }),
        name,
        ...(fileName !== undefined && { img: fileName }), // Use old format
        ...(price !== undefined && { price }), // Only add price if it is defined
        ...(remark && { remark }),
      },
    });

    return res
      .status(200)
      .json({ message: "Food item updated successfully.", food });
  } catch (error) {
    console.error("Error updating food item:", error);
    return res.status(500).json({ error: "Failed to update food item." });
  }
});

router.post("/upload", (req, res) => {
  // Check if a file is uploaded
  if (!req.files || !req.files.img) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const img = req.files.img;
  const fileName = img.name;

  // Ensure the upload directory exists in the root of the project
  const UPLOAD_DIR = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  img.mv(`uploads/${fileName}`, (err) => {
    if (err) {
      res.send({ error: err });
    }
  });

  // Return the filename
  return res.status(200).json({ fileName: fileName });
});

module.exports = router;
