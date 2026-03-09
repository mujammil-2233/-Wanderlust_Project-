const nodemailer = require('nodemailer');

// Configure email service (Gmail example)
// For production, use environment variables
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password'
    }
});

// Send verification email
const sendVerificationEmail = async (email, token) => {
    const verificationLink = `http://localhost:8080/auth/verify/${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: email,
        subject: 'Verify your Wanderlust account',
        html: `
            <h2>Welcome to Wanderlust!</h2>
            <p>Thank you for registering. Please verify your email to complete your signup.</p>
            <a href="${verificationLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Verify Email
            </a>
            <p>Or copy this link: ${verificationLink}</p>
            <p>This link will expire in 24 hours.</p>
            <p>Best regards,<br/>Wanderlust Team</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent to:', email);
    } catch (err) {
        console.error('Email send error:', err);
    }
};

// Send booking confirmation email
const sendBookingConfirmationEmail = async (email, booking) => {
    const mailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: email,
        subject: 'Booking Confirmed - Wanderlust',
        html: `
            <h2>Booking Confirmed!</h2>
            <p>Your booking has been confirmed and payment has been processed.</p>
            <h4>Booking Details:</h4>
            <ul>
                <li><strong>Property:</strong> ${booking.listing.title}</li>
                <li><strong>Check-in:</strong> ${new Date(booking.checkInDate).toLocaleDateString('en-IN')}</li>
                <li><strong>Check-out:</strong> ${new Date(booking.checkOutDate).toLocaleDateString('en-IN')}</li>
                <li><strong>Guests:</strong> ${booking.numberOfGuests}</li>
                <li><strong>Total Amount:</strong> ₹${booking.totalPrice.toLocaleString('en-IN')}</li>
                <li><strong>Booking ID:</strong> ${booking._id.toString().slice(-8).toUpperCase()}</li>
            </ul>
            <p><a href="http://localhost:8080/bookings" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Your Bookings</a></p>
            <p>Best regards,<br/>Wanderlust Team</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Booking confirmation email sent to:', email);
    } catch (err) {
        console.error('Email send error:', err);
    }
};

// Send password reset email
const sendPasswordResetEmail = async (email, token) => {
    const resetLink = `http://localhost:8080/auth/reset-password/${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: email,
        subject: 'Reset Your Wanderlust Password',
        html: `
            <h2>Password Reset Request</h2>
            <p>We received a request to reset your password. Click the link below to reset it.</p>
            <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
            </a>
            <p>Or copy this link: ${resetLink}</p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <p>Best regards,<br/>Wanderlust Team</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent to:', email);
    } catch (err) {
        console.error('Email send error:', err);
    }
};

module.exports = {
    sendVerificationEmail,
    sendBookingConfirmationEmail,
    sendPasswordResetEmail
};
