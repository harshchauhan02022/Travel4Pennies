const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.Model');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingAdmin = await Admin.findOne({ where: { email } });
        if (existingAdmin) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await Admin.create({ name, email, password: hashedPassword });

        res.status(201).json({ message: "Admin registered successfully", admin: newAdmin });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ where: { email } });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: admin.id, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
