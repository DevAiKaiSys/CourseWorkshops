var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const fileUpload = require("express-fileupload");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var foodTypesRouter = require("./routes/foodTypes");
var foodSizesRouter = require("./routes/foodSizes");
var tastesRouter = require("./routes/tastes");
var foodsRouter = require("./routes/foods");

var app = express();
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());

app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/foodtypes", foodTypesRouter);
app.use("/api/foodsizes", foodSizesRouter);
app.use("/api/tastes", tastesRouter);
app.use("/api/foods", foodsRouter);

module.exports = app;
