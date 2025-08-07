const bcrypt = require('bcryptjs');
const Users = require('../models/user.Model');

exports.register = async (req, res) => {
    const { name, email, contact, password } = req.body;

    try {
        const existingUser = await Users.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await Users.create({
            name,
            email,
            contact,
            password: hashedPassword
        });

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
            return res.status(400).json({ message: "User Note Found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" })
        }
        res.status(200).json({ message: "Login successful" })
    }
    catch {

    }
};
exports.gelAllUsers = async (req, res) => {
    try {
        const users = await Users.findAll();
        res.status(200).json({ users })
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
};
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await Users.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not Found" });
        }

        await user.destroy();

        res.status(200).json({ message: "User delete successfully" });
    }
    catch {
        res.status(500).json({ message: "Server error", error: err.message })
    }
};

