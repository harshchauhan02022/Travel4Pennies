const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/auth.Controller');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    (req, res, next) => {
        passport.authenticate('google', (err, user, info) => {
            if (err) return res.status(500).send("OAuth Error: " + err.message);
            if (!user) return res.status(400).send("Login failed. " + (info?.message || ""));
            req.logIn(user, (err) => {
                if (err) return res.status(500).send("Login Error");
                return res.send("Login Success ✅");
            });
        })(req, res, next);
    }
);


router.get('/login/success', authController.loginSuccess);
router.get('/login/failed', authController.loginFailed);

router.get('/logout', authController.logoutUser);

module.exports = router;
