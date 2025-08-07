exports.loginSuccess = (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            message: 'Login successful',                                                                   
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
        message: 'Login failed'
    });
};

exports.logoutUser = (req, res) => {
    req.logout(err => {
        if (err) return res.status(500).json({ success: false, message: 'Logout error' });
        res.redirect('/');
    });
};
