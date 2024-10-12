const { PrismaClient } = require("@prisma/client");
var jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
var express = require("express");
var router = express.Router();

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// Helper function to generate JWT
const generateToken = (user) => {
  const key = process.env.AUTH_SECRET;
  if (!key) {
    throw new Error("JWT secret not defined");
  }
  return jwt.sign(user, key, {
    expiresIn: "30d",
  });
};

router.post("/signin", async function (req, res, next) {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        username,
        password,
        status: "use",
      },
      select: {
        id: true,
        name: true,
        level: true,
      },
    });

    if (user != null) {
      const token = generateToken(user);
      return res.status(200).send({ token });
    } else {
      return res.status(401).send({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error("Sign-in error:", error);
    return res.status(500).send({ error: error.message });
  }
});

module.exports = router;
