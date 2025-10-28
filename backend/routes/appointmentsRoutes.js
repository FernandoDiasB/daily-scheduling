const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const { protect } = require("../controllers/authController");

router.use(protect); // ✅ força autenticação

router
  .route("/")
  .get(appointmentController.getAppointments)
  .post(appointmentController.createAppointment);

router
  .route("/:id")
  .patch(appointmentController.updateAppointment)
  .delete(appointmentController.deleteAppointment);

module.exports = router;
