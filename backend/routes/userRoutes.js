const express = require("express");
const userController = require("../controllers/userController.js");
const router = express.Router();

router.route('/')
.get(userController.getAllUsers);

router.route('/:id')
.get(userController.getUserById)
.delete(userController.deleteById)
.patch(userController.updateById);


module.exports = router;
// router.post("/register", register);
// router.post("/login", login);
