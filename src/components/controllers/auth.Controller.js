exports.loginSuccess = (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            message: 'Login successful ✅',
            user: req.user
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'User not authenticated'
        });
    } 
};

exports.loginFailed = (req, res) => {   
    res.status(401).json({
        success: false,
        message: 'Login failed ❌'
    });
};

exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) return next(err);
        res.json({ success: true, message: 'Logged out successfully ✅' });
    });
};
 