const express = require('express');
const session = require('express-session');
const passport = require('passport');
const app = express();
require('dotenv').config();

// DB
const sequelize = require('./src/config/db');

// Routes
const userRoutes = require('./src/components/routes/user.Routes');
const authRoutes = require('./src/components/routes/auth.Routes');
const adminRoutes = require('./src/components/routes/admin.Routes')

// Passport Config
require('./src/config/passsport'); // ✅ CORRECTED FILE NAME

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret_key',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', adminRoutes);
app.use('/api', userRoutes);
app.use('/auth', authRoutes);

app.get("/", (req, res) => {
    res.json([{ id: 1, name: "Harsh" }]);
});

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log("✅ Database connected successfully!");
    });
}).catch((err) => {
    console.error("❌ Failed to sync database:", err.message);
});
