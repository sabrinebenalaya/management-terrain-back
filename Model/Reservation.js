const mongoose = require("mongoose");

const reservationSchema = mongoose.Schema({
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Partner",
    required: true,
  },
  terrain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Terrain",
    required: true,
  },
  phone: { required: true, type: Number },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  confirmation: { type: Boolean, default: false },
});

reservationSchema.pre('save', async function(next) {
  const Reservation = this.constructor;

  // Vérification du timeSlot unique pour le terrain donné
  const existingReservation = await Reservation.findOne({
    
    terrain: this.terrain,
    start: this.start,
    end: this.end
  });

  if (existingReservation) {
    const error = new Error('This time Slot is reserved for this terrain 😔, choose another one 😉.');
    return next(error);
  }

  next();
});

const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;
