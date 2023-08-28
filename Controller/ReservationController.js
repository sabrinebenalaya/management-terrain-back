const Reservation = require("../Model/Reservation");
const isEmpty = require("../Validator/IsEmpty");
const reservationController = {};

// Create a reservation
reservationController.createReservation = async (req, res) => {
  try {
    const { partner, terrain, phone, date, timeSlot } = req.body;

    const reservation = new Reservation({
      partner,
      terrain,
      phone,
      date,
      timeSlot,
    });

    const savedReservation = await reservation.save();
    res.status(200).send("Reservation done Successfully 😊");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all reservations
reservationController.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    reservations
      ? res.status(200).json(reservations)
      : res.status(404).json("No Reservation was found 😔");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Get all the reservation By partner 
reservationController.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    reservation
      ? res.status(200).json(reservation)
      : res.status(404).json("Reservation not found😔");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a specific reservation by ID
reservationController.getReservationsByPartner = async (req, res) => {
  console.log("id", req.params.id)
  try {
    const reservations = await Reservation.find().filter;

    console.log("reservations", reservations)
    if (reservations.length > 0) {
      res.status(200).json(reservations);
    } else {
      res.status(404).json("Reservations not found 😔");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Update a reservation
reservationController.updateReservation = async (req, res) => {
  try {
    let { partner, terrain, phone, date, timeSlot, confirmation } = req.body;

    const reservationToUpdate = await Reservation.findById(req.params.id);

    if (isEmpty(date)) {
      date = reservationToUpdate.date;
    }
    if (isEmpty(timeSlot)) {
      timeSlot = reservationToUpdate.timeSlot;
    }

    const existingReservation = await Reservation.findOne({
      date: date,
      timeSlot: timeSlot,
      terrain: terrain,
      confirmation: true,
    });

    if (existingReservation) {
      res
        .status(400)
        .json("A reservation for this terrain in this timeSlot waw found 😔");
    } else {
      const reservation = await Reservation.findByIdAndUpdate(
        req.params.id,
        {
          partner,
          terrain,
          phone,
          date,
          timeSlot,
          confirmation,
        },
        { new: true }
      );

      reservation
        ? res.status(200).json("Reservation updated Successfully 😊")
        : res.status(404).json("Reservation not found 😔");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a reservation
reservationController.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    reservation
      ? res.status(200).json("Reservation deleted Successfully 😊")
      : res.status(404).json("Reservation not found 😔");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = reservationController;
