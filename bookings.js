const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Listing = require('../models/listing');
const { isLoggedIn } = require('../middleware/auth');

// GET - Booking page for a listing
router.get('/:listingId', isLoggedIn, async (req, res) => {
    try {
        const { listingId } = req.params;
        const listing = await Listing.findById(listingId);
        if (!listing) return res.status(404).send('Listing not found');
        res.render('bookings/new.ejs', { listing });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading booking page');
    }
});

// POST - Create booking
router.post('/:listingId', isLoggedIn, async (req, res) => {
    try {
        const { listingId } = req.params;
        const { checkInDate, checkOutDate, numberOfGuests } = req.body;

        const listing = await Listing.findById(listingId);
        if (!listing) return res.status(404).send('Listing not found');

        // Calculate days and total price
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const totalPrice = days * listing.price;

        if (days <= 0) return res.status(400).send('Invalid dates');

        // Create booking
        const booking = new Booking({
            listing: listingId,
            guest: req.session.userId,
            checkInDate,
            checkOutDate,
            numberOfGuests: parseInt(numberOfGuests),
            totalPrice
        });

        await booking.save();
        listing.bookings.push(booking._id);
        await listing.save();

        res.redirect(`/bookings/${booking._id}/confirm`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating booking');
    }
});

// GET - Booking confirmation page
router.get('/:bookingId/confirm', isLoggedIn, async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId)
            .populate('listing')
            .populate('guest', 'username email');

        if (!booking) return res.status(404).send('Booking not found');
        res.redirect(`/bookings/${bookingId}/payment`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading confirmation');
    }
});

// GET - Payment page for booking
router.get('/:bookingId/payment', isLoggedIn, async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId)
            .populate('listing')
            .populate('guest', 'username email');

        if (!booking) return res.status(404).send('Booking not found');
        res.render('bookings/payment.ejs', { booking });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading payment page');
    }
});

// GET - Payment success page
router.get('/:bookingId/success', isLoggedIn, async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId)
            .populate('listing')
            .populate('guest', 'username email');

        if (!booking) return res.status(404).send('Booking not found');
        res.render('bookings/payment-success.ejs', { booking });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading success page');
    }
});// GET - My bookings
router.get('/', isLoggedIn, async (req, res) => {
    try {
        const bookings = await Booking.find({ guest: req.session.userId })
            .populate('listing')
            .sort({ createdAt: -1 });
        res.render('bookings/my-bookings.ejs', { bookings });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading bookings');
    }
});

// DELETE - Cancel booking
router.delete('/:bookingId', isLoggedIn, async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId);

        if (!booking) return res.status(404).send('Booking not found');
        if (booking.guest.toString() !== req.session.userId.toString()) {
            return res.status(403).send('Unauthorized');
        }

        booking.status = 'cancelled';
        await booking.save();
        res.redirect('/bookings');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error cancelling booking');
    }
});

module.exports = router;
