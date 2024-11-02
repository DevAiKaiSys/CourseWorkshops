// var express = require("express");
// var path = require("path");
// var cookieParser = require("cookie-parser");
// var logger = require("morgan");
// var cors = require("cors");

// var indexRouter = require("./routes/index");
// var usersRouter = require("./routes/users");
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import productTypesRouter from "./routes/productTypes.js";
import materialsRouter from "./routes/materials.js";
import stockMaterialsRouter from "./routes/stockMaterials.js";

const app = express();
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/productTypes", productTypesRouter);
app.use("/api/materials", materialsRouter);
app.use("/api/stockMaterials", stockMaterialsRouter);

// module.exports = app;
export default app;
