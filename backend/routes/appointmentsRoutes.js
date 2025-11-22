const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const { protect } = require("../controllers/authController");

router.use(protect); // ✅ força autenticação

router
  .route("/")
  .get(appointmentController.getAllAppointments)
  .post(appointmentController.createAppointment);

router
  .route("/:id")
  .get(appointmentController.getAppointments)
  .patch(appointmentController.updateAppointment)
  .delete(appointmentController.deleteAppointment);

module.exports = router;
