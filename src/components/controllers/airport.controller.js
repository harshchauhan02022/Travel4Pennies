const Airport = require("../models/airport.model");
const { Op } = require("sequelize");

exports.searchAirports = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({
                success: false,
                message: "Please provide search term ?q="
            });
        }

        const airports = await Airport.findAll({
            where: {
                [Op.or]: [
                    { iata_code: { [Op.like]: `%${q}%` } },
                    { municipality: { [Op.like]: `%${q}%` } },
                    { iso_country: { [Op.like]: `%${q}%` } },
                    { name: { [Op.like]: `%${q}%` } },
                ],
            },
            limit: 20,
        });

        res.json({
            success: true,
            count: airports.length,
            data: airports
        });

    } catch (err) {
        console.error("Airport search error:", err);
        res.status(500).json({
            success: false,
            error: "Server error",
            details: err.message
        });
    }
};
