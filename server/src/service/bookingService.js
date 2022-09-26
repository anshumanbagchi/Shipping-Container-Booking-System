const conn = require("../db/dbConn");

// +-------------+-------------+------+-----+---------+----------------+
// | Field       | Type        | Null | Key | Default | Extra          |
// +-------------+-------------+------+-----+---------+----------------+
// | bookingID   | int         | NO   | PRI | NULL    | auto_increment |
// | shipID      | int         | NO   | MUL | NULL    |                |
// | userID      | int         | NO   | MUL | NULL    |                |
// | no_of_slots | int         | NO   |     | NULL    |                |
// | description | varchar(50) | YES  |     | NULL    |                |
// +-------------+-------------+------+-----+---------+----------------+

function addBookingService(res, shipID, userID, no_of_slots, description) {
  if (!shipID || !userID || !no_of_slots) {
    res.status(400).json("Please provide valid userID, shipID, no_of_slots");
  }

  let shipAvailableSlots = 0;
  let shipCapacity = 0;
  var userPresent = Boolean(false);
  var shipPresent = Boolean(false);

  try {
    conn.query(
      "SELECT COUNT(*) AS userCnt FROM USER_TB WHERE userID = ?",
      userID,
      (err, result) => {
        if (err) throw err;
        if (result[0].userCnt < 1) {
          res.status(400).json("User ID " + userID + " does not exist");
        } else {
          userPresent = Boolean(true);
          console.log("user id found " + userID + userPresent);
          conn.query(
            "SELECT shipID, availableSlots, capacity FROM SHIP_TB WHERE shipID = ?",
            shipID,
            (err, result) => {
              console.log(result);
              if (err) throw err;
              if (result.length < 1) {
                res.status(400).json("Ship ID " + shipID + " does not exist");
              } else if (result[0].shipID === shipID) {
                shipPresent = Boolean(true);
                shipAvailableSlots = result[0].availableSlots;
                shipCapacity = result[0].capacity;
                // console.log("ship id found " + shipID + shipPresent);
                // console.log("outside if " + shipPresent + userPresent);
                if (userPresent && shipPresent) {
                  // console.log("inside booking if with user and ship");
                  console.log(
                    "Available slots - " +
                      shipAvailableSlots +
                      "Capacity - " +
                      shipCapacity
                  );
                  if (shipCapacity < no_of_slots) {
                    res
                      .status(400)
                      .json(
                        "Ship does not have enough capacity! Capacity is - " +
                          shipCapacity
                      );
                  } else if (shipAvailableSlots - no_of_slots < 0) {
                    res
                      .status(400)
                      .json(
                        "Ship does not have enough slots! Number of available slots are - " +
                          shipAvailableSlots
                      );
                  } else {
                    shipAvailableSlots -= no_of_slots;
                    conn.query(
                      "UPDATE SHIP_TB SET availableSlots = ? WHERE shipID = ?",
                      [shipAvailableSlots, shipID],
                      (err, result) => {
                        console.log("UPDATED SHIP_TB");
                        if (err) throw err;
                        else {
                          conn.query(
                            "INSERT INTO BOOKING_TB SET ?",
                            { shipID, userID, no_of_slots, description },
                            (err, result) => {
                              if (err) {
                                console.log("ERROR - " + err);
                              } else {
                                console.log("INSERTED BOOKING!!");
                                res.status(201).json("INSERTED BOOKING!!");
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              }
            }
          );
        }
      }
    );
  } catch (err) {
    throw err;
  }
}

// function remBookingService(res, bookingID) {
//   var currShipID = 0;
//   var booking_no_of_slots = 0;
//   var ship_available_slots = 0;

//   if (!bookingID) {
//     res.status(422).json("Please enter valid BookingID!");
//   } else {
//     try {
//       conn.query(
//         "SELECT * FROM BOOKING_TB WHERE bookingID = ?",
//         bookingID,
//         (err, result) => {
//           if (err) {
//             throw err;
//           }
//           if (result.length < 1) {
//             res
//               .status(422)
//               .json(
//                 "Please enter valid BookingID! - is not present in Booking TB"
//               );
//           } else {
//             currShipID = result[0].shipID;
//             booking_no_of_slots = result[0].no_of_slots;
//             conn.query(
//               "SELECT * FROM SHIP_TB WHERE shipID = ?",
//               currShipID,
//               (err, result) => {
//                 if (err) {
//                   throw err;
//                 }
//                 ship_available_slots = result[0].availableSlots;
//                 ship_available_slots += booking_no_of_slots;
//                 conn.query(
//                   "UPDATE SHIP_TB SET availableSlots = ? WHERE shipID = ?",
//                   [ship_available_slots, currShipID],
//                   (err, result) => {
//                     if (err) {
//                       throw err;
//                     }
//                     conn.query(
//                       "DELETE FROM BOOKING_TB WHERE bookingID = ?",
//                       bookingID,
//                       (err, result) => {
//                         if (err) {
//                           throw err;
//                         } else {
//                           res.status(201).json("Deleted booking!");
//                         }
//                       }
//                     );
//                   }
//                 );
//               }
//             );
//           }
//         }
//       );
//     } catch (err) {
//       throw err;
//     }
//   }
// }

function remBookingCallbackService(res, bookingID, _callback) {
  var currShipID = 0;
  var booking_no_of_slots = 0;
  var ship_available_slots = 0;

  if (!bookingID) {
    res.status(400).json("Please enter valid BookingID!");
  } else {
    try {
      conn.query(
        "SELECT * FROM BOOKING_TB WHERE bookingID = ?",
        bookingID,
        (err, result) => {
          if (err) {
            throw err;
          }
          if (result.length < 1) {
            res
              .status(400)
              .json(
                "Please enter valid BookingID! - is not present in Booking TB"
              );
          } else {
            currShipID = result[0].shipID;
            booking_no_of_slots = result[0].no_of_slots;
            conn.query(
              "SELECT * FROM SHIP_TB WHERE shipID = ?",
              currShipID,
              (err, result) => {
                if (err) {
                  throw err;
                }
                ship_available_slots = result[0].availableSlots;
                ship_available_slots += booking_no_of_slots;
                conn.query(
                  "UPDATE SHIP_TB SET availableSlots = ? WHERE shipID = ?",
                  [ship_available_slots, currShipID],
                  (err, result) => {
                    if (err) {
                      throw err;
                    }
                    conn.query(
                      "DELETE FROM BOOKING_TB WHERE bookingID = ?",
                      bookingID,
                      (err, result) => {
                        if (err) {
                          throw err;
                        }
                        // res.status(201).json("Deleted booking!");
                        _callback;
                      }
                    );
                  }
                );
              }
            );
          }
        }
      );
    } catch (err) {
      throw err;
    }
  }
}

function viewAllBookingService(res) {
  try {
    conn.query("SELECT * FROM BOOKING_TB", (err, result) => {
      if (err) {
        throw err;
      }
      if (result.length < 1) {
        res.status(400).json("No bookings currently!");
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

function searchBookByUserID(res, userID) {
  try {
    conn.query(
      "SELECT COUNT(*) AS cnt FROM USER_TB WHERE userID = ?",
      userID,
      (err, result) => {
        if (err) {
          throw err;
        }
        if (result[0].cnt < 1) {
          res.status(400).json("Invalid userID. Not present in User TB");
        } else {
          conn.query(
            "SELECT * FROM BOOKING_TB WHERE userID = ?",
            userID,
            (err, result) => {
              if (err) {
                throw err;
              }
              if (result.length < 1) {
                res
                  .status(400)
                  .json("UserID " + userID + " has no bookings currently!");
              } else {
                res.status(200).json(result);
              }
            }
          );
        }
      }
    );
  } catch (err) {
    throw err;
  }
}

function searchBookByShipID(res, shipID) {
  try {
    conn.query(
      "SELECT COUNT(*) AS cnt FROM SHIP_TB WHERE shipID = ?",
      shipID,
      (err, result) => {
        if (err) {
          throw err;
        }
        if (result[0].cnt < 1) {
          res.status(400).json("Invalid shipID. Not present in Ship TB");
        } else {
          conn.query(
            "SELECT * FROM BOOKING_TB WHERE shipID = ?",
            shipID,
            (err, result) => {
              if (err) {
                throw err;
              }
              if (result.length < 1) {
                res
                  .status(400)
                  .json("ShipID " + shipID + " has no bookings currently!");
              } else {
                res.status(200).json(result);
              }
            }
          );
        }
      }
    );
  } catch (err) {
    throw err;
  }
}

module.exports = {
  addBookingService,
  // remBookingService,
  remBookingCallbackService,
  viewAllBookingService,
  searchBookByUserID,
  searchBookByShipID,
};
