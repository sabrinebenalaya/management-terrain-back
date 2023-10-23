const Reservation = require("../Model/Reservation");
const isEmpty = require("../Validator/IsEmpty");
const reservationController = {};

// Create a reservation
reservationController.createReservation = async (req, res) => {
  try {
    const { partner, terrain, phone, start, end, confirmation } = req.body;

    const reservation = new Reservation({
      partner,
      terrain,
      phone,
      start,
      end,
      confirmation,
    });
    const savedReservation = await reservation.save();
    res.status(200).send(savedReservation);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

//Get all reservation with date
reservationController.getAllReservationsWithDate = async (req, res) => {
  const { start, end } = req.query;

  try {
    const reservations = await Reservation.find({
      $and: [
        { start: { $lte: start } },
        { end: { $gte: end } }
      ]
    });
    
    reservations
      ? res.status(200).json(reservations)
      : res.status(404).json("No Reservation was found 😔");
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
  const id = req.params.id;
  try {
    const reservations = await Reservation.find({ partner: id });

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
  console.log("body", req.body);
  try {
    let { partner, terrain, phone, start, end, confirmation } = req.body;

    const reservationToUpdate = await Reservation.findById(req.params.id);
    console.log("reservationToUpdate", reservationToUpdate);
    if (isEmpty(start) && isEmpty(end)) {
      start = reservationToUpdate.start;
      end = reservationToUpdate.end;
    }

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      {
        partner,
        terrain,
        phone,
        end,
        start,
        confirmation,
      },
      { new: true }
    );

    reservation
      ? res.status(200).json(reservation)
      : res.status(404).json("Reservation not found 😔");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a reservation
reservationController.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    const reservations = await Reservation.find({ partner: reservation.partner });

    reservation
      ? res.status(200).json(reservation._id)
      : res.status(404).json("Reservation not found 😔");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = reservationController;
