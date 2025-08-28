// utils/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: { rejectUnauthorized: false }
});

async function sendPriceDropEmail(to, { hotelName, hotelId, oldPrice, newPrice, checkIn, checkOut, currency }) {
    const subject = `Price Drop Alert: ${hotelName} (${currency} ${oldPrice} → ${currency} ${newPrice})`;
    const body = `
        <p>Good news! The price for <strong>${hotelName}</strong> dropped by ${(100 * (oldPrice - newPrice) / oldPrice).toFixed(1)}%.</p>
        <p>Old Price: <strong>${currency} ${oldPrice}</strong><br/>
           New Price: <strong>${currency} ${newPrice}</strong></p>
        <p>Dates: ${checkIn || 'N/A'} → ${checkOut || 'N/A'}</p>
        <p>Hotel ID: ${hotelId}</p>
        <p><small>This notification was sent by your Hotel Alerts service.</small></p>
    `;

    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        html: body
    });
}

module.exports = { transporter, sendPriceDropEmail };
