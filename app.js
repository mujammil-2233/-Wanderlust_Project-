// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const multer = require("multer");
const ejsMate = require("ejs-mate");
const Listing = require("./models/listing.js");
const cors = require("cors");
const apiListings = require("./routes/api/listings");
const { isLoggedIn } = require("./middleware/auth");

const app = express();

// MongoDB connection URL
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// (session + auth routes are mounted later to ensure body parsing middleware runs first)
// Connect to MongoDB
main()
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

// App configurations
app.engine("ejs", ejsMate); // use ejs-mate for layouts
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // parse JSON bodies for API
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public"))); // for CSS/JS/static files

// enable CORS for API (allows external clients to fetch JSON)
app.use(cors({ credentials: true, origin: true }));

// Mount API router
app.use("/api/listings", apiListings);

// React app route
app.get("/react-app", (req, res) => {
  res.render("react-app.ejs");
});

// React test route
app.get("/react-test", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "react-test.html"));
});

// session setup (needs to run after body-parsing and other middleware)
const session = require("express-session");
const MongoStore = require("connect-mongo");
app.use(
  session({
    secret: process.env.SESSION_SECRET || "replace_this_with_secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/wanderlust",
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  }),
);

// expose current user to views (if logged in)
const User = require("./models/user");
app.use(async (req, res, next) => {
  res.locals.currentUser = null;
  try {
    if (req.session && req.session.userId) {
      const u = await User.findById(req.session.userId).select(
        "username email",
      );
      if (u)
        res.locals.currentUser = {
          id: u._id,
          username: u.username,
          email: u.email,
        };
    }
  } catch (e) {
    console.error("Error loading current user:", e);
  }
  next();
});

// mount auth routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// mount JSON auth API (register/login) after session middleware
const apiAuth = require("./routes/api/auth");
app.use("/api/auth", apiAuth);

// mount reviews router
const reviewsRouter = require("./routes/reviews");
app.use("/listings/:id/reviews", reviewsRouter);

// mount favorites API router
const favoritesRouter = require("./routes/api/favorites");
app.use("/api/favorites", favoritesRouter);

// mount bookings router
const bookingsRouter = require("./routes/bookings");
app.use("/bookings", bookingsRouter);

// mount payment API router
const paymentRouter = require("./routes/api/payment");
app.use("/api/payment", paymentRouter);

// mount admin router
const adminRouter = require("./routes/admin");
app.use("/admin", adminRouter);

// Multer setup for file uploads (store in public/uploads)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "public", "uploads"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + ext);
  },
});
const upload = multer({ storage });

// Profile route - show user's profile and listings
app.get("/profile", isLoggedIn, async (req, res) => {
  try {
    const myListings = await Listing.find({ author: req.session.userId });
    res.render("profile.ejs", { myListings });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading profile");
  }
});

// Favorites route - show user's favorite listings
app.get("/favorites", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).populate("favorites");
    res.render("favorites.ejs", { favorites: user.favorites || [] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading favorites");
  }
});

// Root route - if user is logged in show homepage, otherwise
// if no users exist show register page, else show login page
app.get("/", async (req, res) => {
  try {
    if (req.session && req.session.userId) {
      return res.render("home.ejs");
    }
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      return res.redirect("/auth/register");
    }
    return res.redirect("/auth/login-react");
  } catch (err) {
    console.error("Error on root route:", err);
    return res.status(500).send("Server error");
  }
});

// INDEX Route - Show all listings (with search & filter)
app.get("/listings", async (req, res) => {
  try {
    const { search, minPrice, maxPrice, location, category } = req.query;
    let query = {};

    // Search by title or location
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // Filter by category (infer from description/location/title)
    if (category) {
      const categoryFilters = {
        "amazing-views": {
          $or: [
            {
              description: {
                $regex: /view|mountain|ocean|sea|lake|valley|scenic/i,
              },
            },
            {
              title: { $regex: /view|mountain|ocean|sea|lake|valley|scenic/i },
            },
          ],
        },
        beachfront: {
          $or: [
            {
              description: {
                $regex: /beach|ocean|sea|coast|shore|waterfront/i,
              },
            },
            { title: { $regex: /beach|ocean|sea|coast|shore|waterfront/i } },
            { location: { $regex: /beach|ocean|sea|coast|shore/i } },
          ],
        },
        cabins: {
          $or: [
            { description: { $regex: /cabin|wood|rustic|log/i } },
            { title: { $regex: /cabin|wood|rustic|log/i } },
          ],
        },
        countryside: {
          $or: [
            {
              description: { $regex: /countryside|rural|farm|field|pasture/i },
            },
            { title: { $regex: /countryside|rural|farm|field|pasture/i } },
            { location: { $regex: /countryside|rural|farm|field|pasture/i } },
          ],
        },
        design: {
          $or: [
            {
              description: {
                $regex: /design|modern|architect|stylish|contemporary/i,
              },
            },
            {
              title: {
                $regex: /design|modern|architect|stylish|contemporary/i,
              },
            },
          ],
        },
        luxury: {
          $or: [
            {
              description: {
                $regex: /luxury|luxurious|premium|exclusive|high-end/i,
              },
            },
            {
              title: { $regex: /luxury|luxurious|premium|exclusive|high-end/i },
            },
            { price: { $gte: 200 } },
          ],
        },
        mansions: {
          $or: [
            { description: { $regex: /mansion|estate|villa|palace|grand/i } },
            { title: { $regex: /mansion|estate|villa|palace|grand/i } },
          ],
        },
        boats: {
          $or: [
            { description: { $regex: /boat|yacht|sail|marine|water/i } },
            { title: { $regex: /boat|yacht|sail|marine|water/i } },
          ],
        },
        trending: {
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      };

      if (categoryFilters[category]) {
        Object.assign(query, categoryFilters[category]);
      }
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = query.price || {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const allListings = await Listing.find(query);
    res.render("listings/index.ejs", {
      allListings,
      search: search || "",
      minPrice: minPrice || "",
      maxPrice: maxPrice || "",
      location: location || "",
      category: category || "",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching listings");
  }
});

// NEW Route - Form to create a new listing (login required)
app.get("/listings/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// SHOW Route - Show one listing
app.get("/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({
      path: "reviews",
      populate: {
        path: "author",
        select: "username",
      },
    });
    if (!listing) return res.status(404).send("Listing not found!");
    res.render("listings/show.ejs", { listing });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching listing");
  }
});

// CREATE Route - Add a new listing (login required)
app.post(
  "/listings",
  isLoggedIn,
  upload.array("listingFiles", 3),
  async (req, res) => {
    try {
      const listingData = req.body.listing || {};
      // Normalize images: express will give an array for listing[images][]; remove empty strings
      if (listingData.images) {
        // make sure it's an array
        if (!Array.isArray(listingData.images))
          listingData.images = [listingData.images];
        listingData.images = listingData.images
          .map((s) => (s || "").trim())
          .filter(Boolean);
      }
      // fallback: if no images array but single image provided, use it
      if (
        (!listingData.images || listingData.images.length === 0) &&
        listingData.image
      ) {
        listingData.images = [listingData.image];
      }
      // require title
      if (!listingData.title || listingData.title.trim() === "") {
        return res.status(400).send("Title is required");
      }

      // keep `image` for backward compatibility as the first image (if any)
      // attach uploaded files (if any)
      if (req.files && req.files.length > 0) {
        listingData.images = listingData.images || [];
        for (const f of req.files) {
          listingData.images.push(`/uploads/${f.filename}`);
        }
      }

      if (listingData.images && listingData.images.length > 0)
        listingData.image = listingData.images[0];

      listingData.author = req.session.userId;
      const newListing = new Listing(listingData);
      await newListing.save();
      res.redirect("/listings");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error creating listing");
    }
  },
);

// EDIT Route - Form to edit a listing (login required)
app.get("/listings/:id/edit", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).send("Listing not found!");
    res.render("listings/edit.ejs", { listing });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading edit form");
  }
});

// UPDATE Route - Update a listing (login required)
app.put(
  "/listings/:id",
  isLoggedIn,
  upload.array("listingFiles", 3),
  async (req, res) => {
    try {
      const { id } = req.params;
      const listingData = req.body.listing || {};
      if (listingData.images) {
        if (!Array.isArray(listingData.images))
          listingData.images = [listingData.images];
        listingData.images = listingData.images
          .map((s) => (s || "").trim())
          .filter(Boolean);
      }
      if (
        (!listingData.images || listingData.images.length === 0) &&
        listingData.image
      ) {
        listingData.images = [listingData.image];
      }
      // require title on update
      if (!listingData.title || listingData.title.trim() === "") {
        return res.status(400).send("Title is required");
      }

      // attach uploaded files (if any)
      if (req.files && req.files.length > 0) {
        listingData.images = listingData.images || [];
        for (const f of req.files) {
          listingData.images.push(`/uploads/${f.filename}`);
        }
      }

      if (listingData.images && listingData.images.length > 0)
        listingData.image = listingData.images[0];

      await Listing.findByIdAndUpdate(id, { ...listingData });
      res.redirect(`/listings/${id}`);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error updating listing");
    }
  },
);

// DELETE Route - Delete a listing (login required)
app.delete("/listings/:id", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting listing");
  }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is listening on http://localhost:${PORT}`);
});
