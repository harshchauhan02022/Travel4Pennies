const axios = require('axios');
const { sequelize, SearchResult, Supplier } = require('../models');
require('dotenv').config();

const RENTAL_API_URL = process.env.RENTAL_API_URL;

async function fetchAndSave() {
    if (!RENTAL_API_URL) throw new Error('RENTAL_API_URL not set in env');

    const t = await sequelize.transaction();
    try {
        const resp = await axios.get(RENTAL_API_URL, { timeout: 60000 });
        const data = resp.data;

        // key extracts (safe guards)
        const customerSearchId = data?.searchContext?.customerSearchId || null;
        const pickUpDateTime = data?.searchContext?.searchCriteria?.pickUpDateTime ? new Date(data.searchContext.searchCriteria.pickUpDateTime) : null;
        const dropOffDateTime = data?.searchContext?.searchCriteria?.dropOffDateTime ? new Date(data.searchContext.searchCriteria.dropOffDateTime) : null;
        const rentalDurationInDays = data?.searchContext?.searchCriteria?.rentalDurationInDays || null;

        // count of cars available (if present via viewModel.pageHeading like "321 cars available")
        let totalCarsAvailable = null;
        try {
            const heading = data?.viewModel?.pageHeadings?.pageHeading || '';
            const match = heading.match(/(\d+)\s*cars/);
            if (match) totalCarsAvailable = parseInt(match[1], 10);
        } catch (e) { /* ignore */ }

        // Delete previous data (you asked "purana data hat jaye")
        await sequelize.models.SearchResult.destroy({ where: {}, transaction: t });
        await sequelize.models.Supplier.destroy({ where: {}, transaction: t });

        // Insert SearchResult with raw JSON
        await SearchResult.create({
            customerSearchId,
            pickUpDateTime,
            dropOffDateTime,
            rentalDurationInDays,
            totalCarsAvailable,
            rawResponse: JSON.stringify(data)
        }, { transaction: t });

        // Insert suppliers
        const suppliers = data?.suppliers || {};
        const supplierEntries = [];
        for (const key of Object.keys(suppliers)) {
            const item = suppliers[key];
            supplierEntries.push({ id: key, name: item?.name || null });
        }
        if (supplierEntries.length) {
            await Supplier.bulkCreate(supplierEntries, { transaction: t, ignoreDuplicates: true });
        }

        await t.commit();
        return { success: true, message: 'Data saved', totalCarsAvailable, customerSearchId };
    } catch (err) {
        await t.rollback();
        throw err;
    }
}

module.exports = { fetchAndSave };
