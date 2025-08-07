const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.Controller');

router.post('/user/register', userController.register);
router.post('/user/login', userController.loginUser);
router.get('/users', userController.gelAllUsers);
router.delete('/user/delete/:id', userController.deleteUser);


module.exports = router;