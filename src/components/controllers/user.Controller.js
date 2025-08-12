const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Users = require('../models/user.Model');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

exports.register = async (req, res) => {                                                                    
    const { name, email, contact, password } = req.body;
    try {
        const existingUser = await Users.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await Users.create({ name, email, contact, password: hashedPassword });

        res.status(201).json({ message: "User registered successfully", user });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Users.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        let { page, limit } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;

        const offset = (page - 1) * limit;

        const { rows: users, count: totalUsers } = await Users.findAndCountAll({
            limit,
            offset,
            order: [['id', 'ASC']],
        });

        res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers,
            usersPerPage: limit,
            data: users
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await Users.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.destroy();
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await Users.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const token = crypto.randomBytes(32).toString('hex');
        const expiry = new Date(Date.now() + 15 * 60 * 1000);

        await user.update({
            reset_password_token: token,
            reset_password_expiry: expiry
        });

        const resetLink = `http://localhost:7000/api/user/reset-password/${token}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <p>You requested a password reset</p>
                <p>Click here to reset: <a href="${resetLink}">${resetLink}</a></p>
                <p>This link will expire in 15 minutes.</p>
            `
        });

        res.json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({ message: 'New password is required' });
        }

        const user = await Users.findOne({ where: { reset_password_token: token } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        if (user.reset_password_expiry < new Date()) {
            return res.status(400).json({ message: 'Token expired' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await user.update({
            password: hashedPassword,
            reset_password_token: null,
            reset_password_expiry: null
        });

        return res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await Users.findByPk(id, {
            attributes: ['id', 'name', 'email', 'reset_password_token', 'reset_password_expiry']
        });

        if (!user) {
            return res.status(404).json({ message: 'User not Found' })
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};