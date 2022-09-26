const userService = require("../service/userService");
const shipService = require("../service/shipService");
const bookingService = require("../service/bookingService");

//user - basic functions
function addUserController(req, res) {
  const { userName, email } = req.body;
  userService.addUserService(res, userName, email);
}

function remUserController(req, res) {
  const { userID } = req.body;
  userService.remUserService(res, userID);
}

function editUserController(req, res) {
  const { userID, userName, email } = req.body;
  userService.editUserService(res, userID, userName, email);
}

function viewAllUserController(req, res) {
  userService.viewAllUserService(res);
}

// ship - basic functions
function addShipController(req, res) {
  const { origin, dest, timeTaken, capacity } = req.body;
  shipService.addShipService(res, origin, dest, timeTaken, capacity);
}

function remShipController(req, res) {
  const { shipID } = req.body;
  shipService.remShipService(
    res,
    shipID,
    bookingService.remBookingCallbackService
  );
}

function editShipController(req, res) {
  const { shipID, origin, dest, timeTaken, capacity } = req.body;
  shipService.editShipService(res, shipID, origin, dest, timeTaken, capacity);
}

function viewAllShipController(req, res) {
  shipService.viewAllShipService(res);
}

// booking functions
function addBookingController(req, res) {
  const { shipID, userID, no_of_slots, description } = req.body;
  bookingService.addBookingService(
    res,
    shipID,
    userID,
    no_of_slots,
    description
  );
}

function remBookingController(req, res) {
  const { bookingID } = req.body;
  bookingService.remBookingCallbackService(
    res,
    bookingID,
    res.status(201).json("Deleted booking!")
  );
}

function viewAllBookingController(req, res) {
  bookingService.viewAllBookingService(res);
}

//search functions
function searchShipController(req, res) {
  const key = Object.keys(req.body);
  if (key.length === 1) {
    if (key[0] === "shipID") {
      const { id } = req.body;
      console.log(id);
      shipService.searchShipByIdService(res, id);
    } else if (key[0] === "origin") {
      const { origin } = req.body;
      shipService.searchShipByOriginService(res, origin);
    } else if (key[0] === "dest") {
      const { dest } = req.body;
      shipService.searchShipByDestService(res, dest);
    } else {
      res
        .status(400)
        .json("Please enter a correct search field! - shipID, origin, dest");
    }
  } else {
    res.status(400).json("Please enter only one field - shipID, origin, dest");
  }
}

function searchBookController(req, res) {
  const key = Object.keys(req.body);
  if (key.length === 1) {
    if (key[0] === "userID") {
      const { userID } = req.body;
      bookingService.searchBookByUserID(res, userID);
    } else if (key[0] === "shipID") {
      const { shipID } = req.body;
      bookingService.searchBookByShipID(res, shipID);
    } else {
      res
        .status(400)
        .json("Please enter a correct search field! - userID, shipID");
    }
  } else {
    res.status(400).json("Please enter only one field - userID, shipID");
  }
}

module.exports = {
  addUserController,
  remUserController,
  editUserController,
  viewAllUserController,
  addShipController,
  remShipController,
  editShipController,
  viewAllShipController,
  addBookingController,
  remBookingController,
  viewAllBookingController,
  searchShipController,
  searchBookController,
};
