require('dotenv').config(); // env load karne ke liye
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // TLS ke liye false
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false  // ✅ ye line add karein
    }
});


async function sendPriceDropAlert(users, hotel) {
    if (!users || users.length === 0) return;

    const emails = users.map(u => u.email).join(",");

    const mailOptions = {
        from: `"Hotel Price Alert" <${process.env.SMTP_USER}>`,
        to: emails,
        subject: `Price Drop Alert: ${hotel.name}`,
        html: `<h3>${hotel.name} ki price gir gayi hai!</h3>
               <p>Current Price: ₹${hotel.pricePerNight}</p>
               <a href="${hotel.link}">Booking Link</a>`
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to: ${emails}`);
}

module.exports = { sendPriceDropAlert };
