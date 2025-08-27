const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.Controller');
const { verifyToken } = require('../middlewares/authMiddleware');

// Public Routes
router.post('/user/register', userController.register);
router.post('/user/login', userController.loginUser);
router.post('/user/forgot-password', userController.forgotPassword);
router.post('/user/reset-password/:token', userController.resetPassword);

// Protected Routes (require token)
router.get('/users', verifyToken, userController.getAllUsers);
router.delete('/user/delete/:id', verifyToken, userController.deleteUser);
router.get('/user', verifyToken, userController.getProfile);

module.exports = router;
