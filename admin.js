const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Listing = require('../models/listing');
const Booking = require('../models/booking');
const { isAdmin } = require('../middleware/auth');

// GET - Admin Dashboard
router.get('/dashboard', isAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalListings = await Listing.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const totalRevenue = await Booking.aggregate([
            { $match: { status: 'confirmed' } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);

        const recentBookings = await Booking.find()
            .populate('listing', 'title')
            .populate('guest', 'username email')
            .sort({ createdAt: -1 })
            .limit(10);

        const recentListings = await Listing.find()
            .populate('author', 'username')
            .sort({ createdAt: -1 })
            .limit(10);

        res.render('admin/dashboard.ejs', {
            stats: {
                totalUsers,
                totalListings,
                totalBookings,
                totalRevenue: totalRevenue[0]?.total || 0
            },
            recentBookings,
            recentListings
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading dashboard');
    }
});

// GET - All Users
router.get('/users', isAdmin, async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.render('admin/users.ejs', { users });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading users');
    }
});

// DELETE - Remove User
router.delete('/users/:userId', isAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        await User.findByIdAndDelete(userId);

        // Also delete user's listings
        await Listing.deleteMany({ author: userId });

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET - All Listings
router.get('/listings', isAdmin, async (req, res) => {
    try {
        const listings = await Listing.find()
            .populate('author', 'username email')
            .sort({ createdAt: -1 });
        res.render('admin/listings.ejs', { listings });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading listings');
    }
});

// DELETE - Remove Listing
router.delete('/listings/:listingId', isAdmin, async (req, res) => {
    try {
        const { listingId } = req.params;
        await Listing.findByIdAndDelete(listingId);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET - All Bookings
router.get('/bookings', isAdmin, async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('listing', 'title')
            .populate('guest', 'username email')
            .sort({ createdAt: -1 });
        res.render('admin/bookings.ejs', { bookings });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading bookings');
    }
});

// PATCH - Update Booking Status
router.patch('/bookings/:bookingId/status', isAdmin, async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;

        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { status },
            { new: true }
        );

        res.json({ success: true, booking });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
