const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    // use lowercase `image` so it matches form fields and views
    image: {
        type: String,
        default:
            "https://images.unsplash.com/photo-1758565811430-3423f31396f9?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8",
        set: (v) => (v === "" || v == null)
            ? "https://images.unsplash.com/photo-1758565811430-3423f31396f9?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8"
            : v,
    },
    // new: support multiple images (optional). Keep `image` for backwards compatibility.
    images: {
        type: [String],
        default: undefined,
    },
    price: Number,
    location: String,
    country: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    bookings: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Booking'
        }
    ]
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
