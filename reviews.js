const express = require('express');
const router = express.Router({ mergeParams: true });
const Review = require('../models/review');
const Listing = require('../models/listing');
const { isLoggedIn } = require('../middleware/auth');

// POST - Add a review
router.post('/', isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const listing = await Listing.findById(id);
        if (!listing) return res.status(404).send('Listing not found');

        const review = new Review({
            listing: id,
            author: req.session.userId,
            rating: parseInt(rating),
            comment
        });
        await review.save();
        listing.reviews.push(review._id);
        await listing.save();

        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding review');
    }
});

// DELETE - Delete a review
router.delete('/:reviewId', isLoggedIn, async (req, res) => {
    try {
        const { id, reviewId } = req.params;
        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).send('Review not found');

        // Check if user owns the review
        if (review.author.toString() !== req.session.userId.toString()) {
            return res.status(403).send('Unauthorized');
        }

        await Review.findByIdAndDelete(reviewId);
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting review');
    }
});

module.exports = router;
