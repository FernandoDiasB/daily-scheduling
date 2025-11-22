const Patient = require('../models/patientModel');

// 📋 Criar novo paciente
exports.createPatient = async (req, res) => {
  try {
    const { patientName, email, phone, birthDate, notes } = req.body;

    if (!patientName) {
      return res.status(400).json({
        status: "fail",
        message: "O nome do paciente é obrigatório.",
      });
    }
    if (email) {
      const existingPatient = await Patient.findOne({ email });
      if (existingPatient) {
        return res.status(400).json({
          status: "fail",
          message: "Esse email já está cadastrado.",
        });
      }

    }

    const newPatient = await Patient.create({
      doctor: req.user.id,
      patientName,
      email,
      phone,
      birthDate,
      notes
    });

    res.status(201).json({
      status: "success",
      data: {
        patient: newPatient,
      },
    });
  } catch (err) {
    console.error("❌ Erro ao criar paciente:", err);
    res.status(500).json({
      status: "fail",
      message: "Erro ao criar paciente.",
      error: err.message,
    });
  }
};

// 📄 Listar todos os pacientes do médico logado
exports.getAllPatients = async (req, res) => {
  try {
    let queryObj = { doctor: req.user.id };

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 8;
    const skip = (page - 1) * limit;

    const patients = await Patient.find(queryObj)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

    if(req.query.page){
      const numPatients = await Patient.countDocuments();
      if(skip >= numPatients) throw new Error ('This page not does exists!')
    }

    const totalPatients = await Patient.countDocuments(queryObj);


    res.status(200).json({
      status: "success",
      results: totalPatients,
      data: {
        patients
      },
    });
  } catch (err) {
    console.error("❌ Erro ao buscar pacientes:", err);
    res.status(500).json({
      status: "fail",
      message: "Erro ao buscar pacientes.",
    });
  }
};

// 🔍 Buscar paciente por ID
exports.getPatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.id,
      doctor: req.user.id,
    });

    if (!patient) {
      return res.status(404).json({
        status: "fail",
        message: "Paciente não encontrado.",
      });
    }

    res.status(200).json({
      status: "success",
      data: { patient },
    });
  } catch (err) {
    console.error("❌ Erro ao buscar paciente:", err);
    res.status(500).json({
      status: "fail",
      message: "Erro ao buscar paciente.",
    });
  }
};

// ✏️ Atualizar paciente
exports.updatePatient = async (req, res) => {
  try {
    const updatedPatient = await Patient.findOneAndUpdate(
      { _id: req.params.id, doctor: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({
        status: "fail",
        message: "Paciente não encontrado.",
      });
    }

    res.status(200).json({
      status: "success",
      data: { updatedPatient },
    });
  } catch (err) {
    console.error("❌ Erro ao atualizar paciente:", err);
    res.status(500).json({
      status: "fail",
      message: "Erro ao atualizar paciente.",
    });
  }
};

// 🗑️ Excluir paciente
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findOneAndDelete({
      _id: req.params.id,
      doctor: req.user.id,
    });

    if (!patient) {
      return res.status(404).json({
        status: "fail",
        message: "Paciente não encontrado.",
      });
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    console.error("❌ Erro ao excluir paciente:", err);
    res.status(500).json({
      status: "fail",
      message: "Erro ao excluir paciente.",
    });
  }
};
