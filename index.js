// index.js
const express = require('express');
const app = express();
require('dotenv').config();

const sequelize = require('./src/config/db');
const userRoutes = require('./src/components/routes/user.Routes');

app.use(express.json());
app.use('/api/users', userRoutes);

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