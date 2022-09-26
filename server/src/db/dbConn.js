const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  multipleStatements: true,
});

conn.connect((err) => {
  if (err) throw err;
  console.log("DB Connected");
  createDBandTables();
});

function createDBandTables() {
  conn.query(
    "CREATE DATABASE IF NOT EXISTS GTE_SHIPPING_CONTAINER_DB",
    (err, res) => {
      if (err) throw err;
      console.log("Database Created");
      conn.query("USE GTE_SHIPPING_CONTAINER_DB", (err, res) => {
        if (err) throw err;
        console.log("Using GTE_SHIPPING_CONTAINER_DB");
        conn.query(
          "CREATE TABLE IF NOT EXISTS USER_TB (userID INT NOT NULL AUTO_INCREMENT, userName VARCHAR(50), email VARCHAR(50), PRIMARY KEY (userID))",
          (err, res) => {
            if (err) throw err;
            console.log("Created USER_TB");
          }
        );
        conn.query(
          "CREATE TABLE IF NOT EXISTS SHIP_TB (shipID INT NOT NULL AUTO_INCREMENT, origin VARCHAR(50), dest VARCHAR(50), timeTaken INT, capacity INT DEFAULT 100, availableSlots INT DEFAULT 100, PRIMARY KEY (shipID))",
          (err, res) => {
            if (err) throw err;
            console.log("Created SHIP_TB");
          }
        );
        conn.query(
          "CREATE TABLE IF NOT EXISTS BOOKING_TB (bookingID INT NOT NULL AUTO_INCREMENT, shipID INT NOT NULL, userID INT NOT NULL, no_of_slots INT NOT NULL, description VARCHAR(50), PRIMARY KEY (bookingID), CONSTRAINT FK_BOOKING_SHIP FOREIGN KEY (shipID) REFERENCES SHIP_TB(shipID), CONSTRAINT FK_BOOKING_USER FOREIGN KEY (userID) REFERENCES USER_TB(userID))",
          (err, res) => {
            if (err) throw err;
            console.log("Created BOOKING_TB");
          }
        );
      });
    }
  );
}

module.exports = conn;
