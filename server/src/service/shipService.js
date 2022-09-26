const conn = require("../db/dbConn");

// +----------------+-------------+------+-----+---------+----------------+
// | Field          | Type        | Null | Key | Default | Extra          |
// +----------------+-------------+------+-----+---------+----------------+
// | shipID         | int         | NO   | PRI | NULL    | auto_increment |
// | origin         | varchar(50) | YES  |     | NULL    |                |
// | dest           | varchar(50) | YES  |     | NULL    |                |
// | timeTaken      | int         | YES  |     | NULL    |                |
// | capacity       | int         | YES  |     | 100     |                |
// | availableSlots | int         | YES  |     | 100     |                |
// +----------------+-------------+------+-----+---------+----------------+

function addShipService(res, origin, dest, timeTaken, capacity) {
  if (!origin || !dest || !timeTaken) {
    res
      .status(400)
      .json("Please fill all origin/destination/time taken details!");
  }
  if (!capacity) {
    capacity = 100;
  }

  const availableSlots = capacity;

  try {
    // console.log(origin);
    conn.query(
      "INSERT INTO SHIP_TB SET ?",
      { origin, dest, timeTaken, capacity, availableSlots },
      (err, result) => {
        if (err) {
          res.status(400).json("Not able to insert entry");
        } else {
          res.status(201).json("Ship added");
        }
      }
    );
  } catch (err) {
    if (err) throw err;
  }
}

function remShipService(res, shipID, deleteBookingService) {
  if (!shipID) {
    res.status(400).json("Please provide shipID!");
  }

  try {
    conn.query(
      "SELECT COUNT(*) AS cnt FROM SHIP_TB WHERE shipID = ?",
      shipID,
      (err, result) => {
        console.log("Deleting shipID - " + shipID);
        if (result[0].cnt < 1) {
          res.status(400).json("Ship ID " + shipID + " does not exist");
        } else {
          conn.query(
            "SELECT bookingID FROM BOOKING_TB WHERE shipID = ?",
            shipID,
            (err, result) => {
              console.log(result);
              if (result.length > 0) {
                //delete bookings
                console.log(
                  "Deleting " + result.length + " bookings!" + result.bookingID
                );
                // console.log(cnt);
                var bookingID = [];
                for (var key = 0; key < result.length; key++) {
                  bookingID.push(result[key].bookingID);
                }
                console.log(bookingID);
                conn.query(
                  "DELETE FROM BOOKING_TB WHERE bookingID IN (?)",
                  [bookingID],
                  (err, result) => {
                    if (err) {
                      throw err;
                    } else {
                      console.log(result.affectedRows);
                    }
                    conn.query(
                      "DELETE FROM SHIP_TB WHERE shipID = ?",
                      shipID,
                      (err, result) => {
                        if (err) {
                          throw err;
                        } else {
                          res
                            .status(201)
                            .json("Modified " + result.affectedRows + " rows");
                        }
                      }
                    );
                  }
                );
              } else {
                conn.query(
                  "DELETE FROM SHIP_TB WHERE shipID = ?",
                  shipID,
                  (err, result) => {
                    if (err) {
                      console.log("ERROR - " + err);
                    } else {
                      res
                        .status(201)
                        .json("Modified " + result.affectedRows + " rows");
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  } catch (err) {
    if (err) throw err;
  }
}

function editShipService(res, shipID, origin, dest, timeTaken, capacity) {
  const prevCapacity = 0;
  const availableSlots = 0;
  const prevOrigin = "";
  const prevDest = "";

  if (!shipID) {
    res.status(400).json("Please provide a shipID to modify!");
  }

  try {
    conn.query(
      "SELECT COUNT(*) AS cnt FROM SHIP_TB WHERE shipID = ?",
      shipID,
      (err, result) => {
        console.log("Updating shipID - " + shipID);
        if (result[0].cnt < 1) {
          res.status(400).json("Ship ID " + shipID + " does not exist");
        } else {
          conn.query(
            "SELECT origin, dest, capacity, availableSlots FROM SHIP_TB WHERE shipID = ?",
            shipID,
            (err, result) => {
              prevOrigin = result[0].origin;
              prevDest = result[0].dest;
              prevCapacity = result[0].capacity;
              availableSlots = result[0].availableSlots;
              const noOfBookings = prevCapacity - availableSlots;
              if (prevOrigin !== origin || prevDest !== dest)
                conn.query(
                  "SELECT COUNT(*) AS bookingCt FROM BOOKING_TB WHERE shipID = ?",
                  shipID,
                  (err, result) => {
                    if (result[0].bookingCt > 0) {
                      res
                        .status(400)
                        .json(
                          "Please remove active bookings before modying origin/destination."
                        );
                    } else {
                      conn.query(
                        "UPDATE SHIP_TB SET origin = ?, dest = ?, timeTaken = ?, capacity = ?, availableSlots = ? WHERE shipID = ?",
                        [
                          origin,
                          dest,
                          timeTaken,
                          capacity,
                          availableSlots,
                          shipID,
                        ],
                        (err, result) => {
                          if (err) {
                            console.log("ERROR - " + err);
                          } else {
                            res
                              .status(201)
                              .json(
                                "Modified " + result.affectedRows + " rows"
                              );
                          }
                        }
                      );
                    }
                  }
                );
              else {
                if (capacity < noOfBookings) {
                  res
                    .status(400)
                    .json(
                      "Capacity cannot be lower than number of already booked slots! Number of booked slots is " +
                        noOfBookings
                    );
                } else {
                  conn.query(
                    "UPDATE SHIP_TB SET origin = ?, dest = ?, timeTaken = ?, capacity = ?, availableSlots = ? WHERE shipID = ?",
                    [origin, dest, timeTaken, capacity, availableSlots, shipID],
                    (err, result) => {
                      if (err) {
                        console.log("ERROR - " + err);
                      } else {
                        res
                          .status(201)
                          .json("Modified " + result.affectedRows + " rows");
                      }
                    }
                  );
                }
              }
            }
          );
        }
      }
    );
  } catch (err) {
    if (err) throw err;
  }
}

function viewAllShipService(res) {
  try {
    conn.query("SELECT * FROM SHIP_TB", (err, result) => {
      if (err) {
        throw err;
      }
      if (result.length < 1) {
        res.status(400).json("No ships currently!");
      } else {
        res.status(200).json(result);
      }
    });
  } catch (err) {
    if (err) {
      throw err;
    }
  }
}

function searchShipByIdService(res, shipID) {
  try {
    conn.query(
      "SELECT * FROM SHIP_TB WHERE shipID = ?",
      shipID,
      (err, result) => {
        if (err) {
          throw err;
        }
        if (result.length < 1) {
          res.status(400).json("Could not find " + shipID + " in ship table!");
        } else {
          res.status(200).json(result);
        }
      }
    );
  } catch (err) {
    throw err;
  }
}

function searchShipByOriginService(res, origin) {
  try {
    conn.query(
      "SELECT * FROM SHIP_TB WHERE origin = ?",
      origin,
      (err, result) => {
        if (err) {
          throw err;
        }
        if (result.length < 1) {
          res
            .status(400)
            .json("No ships leaving from " + origin + " currently!");
        } else {
          res.status(200).json(result);
        }
      }
    );
  } catch (err) {
    throw err;
  }
}

function searchShipByDestService(res, dest) {
  try {
    conn.query("SELECT * FROM SHIP_TB WHERE dest = ?", dest, (err, result) => {
      if (err) {
        throw err;
      }
      if (result.length < 1) {
        res.status(400).json("No ships arriving at " + dest + " currently!");
      } else {
        res.status(200).json(result);
      }
    });
  } catch (err) {
    throw err;
  }
}

module.exports = {
  addShipService,
  remShipService,
  editShipService,
  viewAllShipService,
  searchShipByIdService,
  searchShipByOriginService,
  searchShipByDestService,
};
