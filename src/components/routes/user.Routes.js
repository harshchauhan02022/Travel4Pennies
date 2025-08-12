const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.Controller');

router.post('/user/register', userController.register);
router.post('/user/login', userController.loginUser);
router.get('/users', userController.getAllUsers);
router.delete('/user/delete/:id', userController.deleteUser);
router.get('/user/:id', userController.getById)

router.post('/user/forgot-password', userController.forgotPassword);
router.post('/user/reset-password/:token', userController.resetPassword);


module.exports = router;
