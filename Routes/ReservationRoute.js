const express = require("express");


const router = express.Router();
const reservationController = require('../Controller/ReservationController')


router.post("/add", reservationController.createReservation);
router.get("/getReservations", reservationController.getAllReservations);
router.get("/getReservationWithDate", reservationController.getAllReservationsWithDate);
router.get("/getPartnerReservation/:id", reservationController.getReservationsByPartner);
router.get("/getReservation/:id", reservationController.getReservationById);
router.put("/update/:id", reservationController.updateReservation);
router.delete("/delete/:id", reservationController.deleteReservation);



module.exports = router;


