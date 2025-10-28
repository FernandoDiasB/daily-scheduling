const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Você precisa registrar um nome.'],

  },
  email: {
    type: String,
    required: [true, "O e-mail é obrigatório"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "A senha é obrigatória"],
    minlength: 6,
    select: false,
  },
  crm: {
    type: String,
    trim: true,
  },
  specialty: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash da senha antes de salvar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Método para comparar senhas
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model("User", userSchema);
