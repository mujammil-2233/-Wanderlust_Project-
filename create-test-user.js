const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

(async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to MongoDB");

    const testUser = {
      username: "mujammil",
      email: "mujammilmujawar615@gmail.com",
      password: await bcrypt.hash("mujammil@1234", 12),
      emailVerified: true,
      verificationToken: null,
    };

    // Delete if exists
    await User.deleteOne({ email: testUser.email });

    // Create new user
    const user = new User(testUser);
    await user.save();

    console.log(
      "✅ Test user created successfully!\n\nLogin Credentials:\n━━━━━━━━━━━━━━━━━━━━━━━",
    );
    console.log(`📧 Email: ${testUser.email}`);
    console.log(`🔐 Password: mujammil@1234`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();
