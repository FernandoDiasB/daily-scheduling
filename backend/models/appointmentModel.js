const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",

  },
  patient: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Patient",
    required: true,
  },
  date: {
    type: Date,
    required: [true, "A data do agendamento é obrigatória"],
  },
  mode: {
    type: String,
    enum: ["presencial", "online"],
    default: "presencial",
  },
  status: {
    type: String,
    enum: ["pendente", "confirmado", "finalizado","cancelado"],
    default: "pendente",
  },
  notes: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  
});

appointmentSchema.index({ doctor: 1, date: 1 }); // performance

module.exports = mongoose.model("Appointment", appointmentSchema);
