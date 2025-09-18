const rentalService = require('../../services/rentalService');

exports.fetchNow = async (req, res) => {
  try {
    const result = await rentalService.fetchAndSave();
    res.json({ success: true, result });
  } catch (err) {
    console.error('Fetch error:', err?.message || err);
    res.status(500).json({ success: false, error: err?.message || 'Failed' });
  }
};
