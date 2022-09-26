const express = require("express");
const app = express();

const cors = require("cors");
const dotenv = require("dotenv");

const mysql = require("mysql2");

const router = require("./src/routes/router");
require("./src/db/dbConn");

// middleware
app.use(cors());
app.use(express.json());
dotenv.config();

const port = process.env.NODE_PORT;

app.use(router);

app.listen(port, () => {
  console.log("Server started on port " + port);
});
