const Airport = require("../models/airport.model");
const { Op } = require("sequelize");

// Search airports
exports.searchAirports = async (req, res) => {
    try {
        const { q } = req.query; // search query
        if (!q) {
            return res.status(400).json({ message: "Please provide search term ?q=" });
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
            limit: 20, // only 20 results for now
        });

        res.json({ count: airports.length, results: airports });
    } catch (err) {
        console.error("Airport search error:", err);
        res.status(500).json({ error: "Server error" });
    }
};
