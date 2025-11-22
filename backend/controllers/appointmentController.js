const Appointment = require('../models/appointmentModel.js');
const Patient = require('../models/patientModel.js');


exports.createAppointment = async (req, res) => {
  try {
    const { patient, patientName, patientEmail, patientPhone, date, mode, notes } = req.body;

    // validações básicas
    if (!date) {
      return res.status(400).json({ status: "fail", message: "A data é obrigatória." });
    }

    let patientId = patient;

    // se o front enviou patientName (criar paciente novo), criar antes
    if (!patientId && patientName) {
      // opcional: evitar duplicação por email (se email enviado)
      if (patientEmail) {
        const existing = await Patient.findOne({ email: patientEmail });
        if (existing) {
          patientId = existing._id;
        }
      }

      if (!patientId) {
        const createdPatient = await Patient.create({
          doctor: req.user._id, // vincula paciente ao terapeuta/profissional
          patientName: patientName,
          email: patientEmail || undefined,
          phone: patientPhone || undefined,
        });
        patientId = createdPatient._id;
      }
    }

    // se nenhum patientId disponível, erro
    if (!patientId) {
      return res.status(400).json({
        status: "fail",
        message: "Informe um paciente existente (patient) ou o nome de um novo paciente (patientName).",
      });
    }

    // cria o agendamento
    const newAppointment = await Appointment.create({
      doctor: req.user._id,
      patient: patientId,
      date,
      mode: mode || "presencial",
      notes: notes || "",
    });

    // popular patient para retorno mais amigável
    const populated = await Appointment.findById(newAppointment._id).populate("patient", "name email phone");

    res.status(201).json({
      status: "success",
      data: {
        appointment: populated,
      },
    });
  } catch (error) {
    console.error("❌ ERRO DETALHADO AO CRIAR AGENDAMENTO:", error);
    res.status(500).json({
      status: "error",
      message: "Falha ao criar agendamento",
      error: error.message,
      stack: error.stack,
    });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    console.log("Usuário logado recebido pelo backend:", req.user);

    let queryObj = { doctor: req.user.id };

    if(req.query.status){
      queryObj.status = req.query.status;
    }

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 4;
    const skip = (page - 1) * limit;

        const appointments = await Appointment.find(queryObj)
      .populate("patient", "patientName email")
      .sort({ date: 1 })
      .limit(limit)
      .skip(skip); // ✅ ordena por data (mais antigos primeiro)

    if (!appointments) {
      res.status(404).json({
        status: 'fail',
        message: 'Sem consultas agendadas!'
      })
    }

    if (req.query.page) {
      const numAppointments = await Appointment.countDocuments();
      if (skip >= numAppointments) throw new Error('This page does not exist.');
    }
    
    const totalAppointments = await Appointment.countDocuments(queryObj);

    res.status(200).json({
      status: 'succes',
      results: totalAppointments,
      data: {
        appointments
      }
    })
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: ('Falha ao obter consultas!', error.message)
    })
  }
}

exports.getAppointments = async (req, res) => {
  try {
    console.log("Usuário logado recebido pelo backend:", req.user);

    const appointments = await Appointment.findById(req.params.id)
      .populate("patient", "patientName email");

    if (!appointments) {
      return res.status(404).json({
        status: 'fail',
        message: 'Agendamento não encontrado.'
      });
    }

    res.status(200).json({
      status: 'success',
      results: appointments.length,
      data: {
        appointments
      }
    })
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: ('Falha ao buscar consulta.', error.message)
    })
  }
}

exports.updateAppointment = async (req, res) => {
  try {
    const newAppointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        newAppointment
      }
    })

  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: ('Falha ao buscar consulta.', error.message)
    })
  }
}

exports.deleteAppointment = async (req, res) => {
  try {
    const appointments = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointments) {
      res.status(404).json({
        status: 'fail',
        message: 'Consulta não encontrada.'
      })
    }

    res.status(200).json({
      status: 'success',
      message: 'Consulta deletada com sucesso.',
      data: null
    })

  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message
    })
  }
}