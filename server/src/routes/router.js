const express = require("express");

const router = new express.Router();

const controller = require("../controller/controller");


router.get("/", (req, res) => {
  res.status(200).json("GTE Shipping Container Slot Booking Server up!")
})

// user related routes
router.post("/user/add", (req, res) => {
  controller.addUserController(req, res);
});

router.delete("/user/remove", (req, res) => {
  controller.remUserController(req, res);
});

router.put("/user/edit", (req, res) => {
  controller.editUserController(req, res);
});

router.get("/user/viewAll", (req, res) => {
  controller.viewAllUserController(req, res);
});

// ship related routes
router.post("/ship/add", (req, res) => {
  controller.addShipController(req, res);
});

router.delete("/ship/remove", (req, res) => {
  controller.remShipController(req, res);
});

router.put("/ship/edit", (req, res) => {
  controller.editShipController(req, res);
});

router.get("/ship/viewAll", (req, res) => {
  controller.viewAllShipController(req, res);
});

// booking related routes
router.post("/book/add", (req, res) => {
  controller.addBookingController(req, res);
});

router.delete("/book/remove", (req, res) => {
  controller.remBookingController(req, res);
});

router.get("/book/viewAll", (req, res) => {
  controller.viewAllBookingController(req, res);
});

// search related routes
router.get("/search/ship", (req, res) => {
  controller.searchShipController(req, res);
});

router.get("/search/book", (req, res) => {
  controller.searchBookController(req, res);
});

module.exports = router;
