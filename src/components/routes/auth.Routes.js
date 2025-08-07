const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/auth.Controller');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/api/auth/login/failed',
        successRedirect: '/api/auth/login/success'
    })
);

router.get('/login/success', authController.loginSuccess);
router.get('/login/failed', authController.loginFailed);

router.get('/logout', authController.logoutUser);

module.exports = router;
