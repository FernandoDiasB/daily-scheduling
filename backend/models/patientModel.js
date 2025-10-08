const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    doctor:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
        name:{
        type: String,
        required: [true, 'Você precisa registrar um nome.']
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
        type: mongoose.Schema.Types.ObjectId,
        ref:'Note'
    }],
      createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Patient", patientSchema);