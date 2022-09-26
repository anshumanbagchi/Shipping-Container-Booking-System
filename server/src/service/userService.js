const conn = require("../db/dbConn");

// +----------+-------------+------+-----+---------+----------------+
// | Field    | Type        | Null | Key | Default | Extra          |
// +----------+-------------+------+-----+---------+----------------+
// | userID   | int         | NO   | PRI | NULL    | auto_increment |
// | userName | varchar(50) | YES  |     | NULL    |                |
// | email    | varchar(50) | YES  |     | NULL    |                |
// +----------+-------------+------+-----+---------+----------------+

function addUserService(res, userName, email) {
  if (!userName || !email) {
    res.status(400).json("Please fill all details!");
  }

  try {
    conn.query(
      "SELECT * FROM USER_TB WHERE email = ?",
      email,
      (err, result) => {
        if (result.length) {
          res.status(400).json("email ID already exists");
        } else {
          conn.query(
            "INSERT INTO USER_TB SET ?",
            { userName, email },
            (err, result) => {
              if (err) {
                console.log("ERROR - " + err);
              } else {
                res.status(201).json("User added");
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

function remUserService(res, userID) {
  if (!userID) {
    res.status(400).json("Please fill all details!");
  }

  try {
    conn.query(
      "SELECT * FROM USER_TB WHERE userID = ?",
      userID,
      (err, result) => {
        console.log("Deleting userID - " + userID);
        if (result.length < 1) {
          res.status(400).json("User ID " + userID + " does not exist");
        } else {
          conn.query(
            "SELECT bookingID, shipID, no_of_slots FROM BOOKING_TB WHERE userID = ?",
            userID,
            (err, result) => {
              if (result.length > 0) {
                console.log(
                  "Bookings present for userID - " +
                    userID +
                    ". Number of bookings - " +
                    result.length
                );
                console.log(result);
                var bookingID = [],
                  shipID = [],
                  no_of_slots = [];
                var shipUpdateDetails = {
                  shipID: [],
                  totSlotUpdate: [],
                  newAvailableSlots: [],
                };

                for (var cnt = 0; cnt < result.length; cnt++) {
                  bookingID.push(result[cnt].bookingID);
                  shipID.push(result[cnt].shipID);
                  no_of_slots.push(result[cnt].no_of_slots);
                }
                shipUpdateDetails.shipID = [...new Set(shipID)];
                for (cnt = 0; cnt < shipUpdateDetails.shipID.length; cnt++) {
                  shipUpdateDetails.totSlotUpdate.push(0);
                  shipUpdateDetails.newAvailableSlots.push(0);
                }

                for (cnt = 0; cnt < shipUpdateDetails.shipID.length; cnt++) {
                  for (var cnt2 = 0; cnt2 < result.length; cnt2++) {
                    if (shipUpdateDetails.shipID[cnt] === shipID[cnt2]) {
                      shipUpdateDetails.totSlotUpdate[cnt] += no_of_slots[cnt2];
                    }
                  }
                }

                // console.log(shipUpdateDetails);

                conn.query(
                  "SELECT shipID, availableSlots FROM SHIP_TB WHERE shipID IN (?) ORDER BY shipID",
                  [shipUpdateDetails.shipID],
                  (err, result) => {
                    if (err) {
                      throw err;
                    }
                    for (cnt = 0; cnt < result.length; cnt++) {
                      console.log(
                        result[cnt].shipID + " " + shipUpdateDetails.shipID[cnt]
                      );
                      if (
                        result[cnt].shipID === shipUpdateDetails.shipID[cnt]
                      ) {
                        shipUpdateDetails.newAvailableSlots[cnt] =
                          result[cnt].availableSlots;
                        shipUpdateDetails.newAvailableSlots[cnt] +=
                          shipUpdateDetails.totSlotUpdate[cnt];
                      }
                    }
                    // console.log(shipUpdateDetails);
                    var shipUpdateSlots = {
                      availableSlots: 0,
                      shipID: 0,
                    };
                    var shipUpdateData = [];
                    for (
                      cnt = 0;
                      cnt < shipUpdateDetails.shipID.length;
                      cnt++
                    ) {
                      shipUpdateData.push({
                        availableSlots:
                          shipUpdateDetails.newAvailableSlots[cnt],
                        shipID: shipUpdateDetails.shipID[cnt],
                      });
                    }
                    var queries = "";
                    shipUpdateData.forEach(function (item) {
                      let sql = conn.format(
                        "UPDATE SHIP_TB SET availableSlots = ? WHERE shipID = ?;",
                        [item.availableSlots, item.shipID]
                      );
                      queries += sql;
                      console.log(sql);
                    });
                    console.log(queries);
                    // shipUpdateSlots.shipID.forEach()
                    console.log(shipUpdateData);
                    conn.query(queries, (err, result) => {
                      if (err) {
                        throw err;
                      } else {
                        console.log(
                          "Modified rows in SHIP_TB - " + result.affectedRows
                        );
                      }
                      conn.query(
                        "DELETE FROM BOOKING_TB WHERE bookingID IN (?)",
                        [bookingID],
                        (err, result) => {
                          if (err) {
                            throw err;
                          }
                          console.log(
                            "Deleted " + result.affectedRows + " rows."
                          );
                          conn.query(
                            "DELETE FROM USER_TB WHERE userID = ?",
                            userID,
                            (err, result) => {
                              if (err) {
                                console.log(
                                  "ERROR AFTER DELETING BOOKINGS - " + err
                                );
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
                      );
                    });
                  }
                );
              } else {
                conn.query(
                  "DELETE FROM USER_TB WHERE userID = ?",
                  userID,
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

function editUserService(res, userID, userName, email) {
  if (!userID) {
    res.status(400).json("Please fill all details!");
  }

  try {
    conn.query(
      "SELECT * FROM USER_TB WHERE userID = ?",
      userID,
      (err, result) => {
        console.log("Updating userID - " + userID);
        if (result.length < 1) {
          res.status(400).json("User ID " + userID + " does not exist");
        } else {
          conn.query(
            "SELECT * FROM USER_TB WHERE email = ?",
            email,
            (err, result) => {
              if (result.length) {
                res.status(400).json("email ID already exists");
              } else {
                conn.query(
                  "UPDATE USER_TB SET userName = ?, email = ? WHERE userID = ?",
                  [userName, email, userID],
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

function viewAllUserService(res) {
  try {
    conn.query("SELECT * FROM USER_TB", (err, result) => {
      if (err) {
        throw err;
      }
      if (result.length < 1) {
        res.status(400).json("No users currently!");
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

module.exports = {
  addUserService,
  remUserService,
  editUserService,
  viewAllUserService,
};
