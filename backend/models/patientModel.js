const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    doctor:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    patientName:{
        type: String,
        required: [true, 'Você precisa registrar um nome...']
    },
    email:{
        type: String
    },
    phone:{
        type: String
    },
    birthDate:{
        type: String
    },
    notes:[{
        type: String,
        trim: true
    }],
      createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Patient", patientSchema);