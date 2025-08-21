const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/auth.Controller');

// Google login start
router.get('/google',
    passport.authenticate('google', { scope: ['openid', 'profile', 'email'] })
);

// Google callback
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/login/failed' }),
    (req, res) => {
        res.redirect('/auth/login/success');
    }
);

// Auth status
router.get('/login/success', authController.loginSuccess);
router.get('/login/failed', authController.loginFailed);

// Logout
router.get('/logout', authController.logoutUser);

module.exports = router;
