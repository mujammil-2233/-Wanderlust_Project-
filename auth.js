const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/user");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../config/email");

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("auth/register.ejs");
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).send("All fields required");
    const hashed = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const user = new User({
      username,
      email,
      password: hashed,
      emailVerified: false,
      verificationToken,
    });
    await user.save();

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    res.render("auth/verify-email.ejs", { email, message: "" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error registering");
  }
});
router.get("/login", (req, res) => {
  res.render("auth/login.ejs");
});

router.get("/login-react", (req, res) => {
  res.render("auth/login-react.ejs");
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("Invalid credentials");
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).send("Invalid credentials");
    if (!user.emailVerified) {
      return res.render("auth/verify-email.ejs", {
        email: user.email,
        message: "",
      });
    }
    req.session.userId = user._id;
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error logging in");
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// Email verification route
router.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });

    if (!user) return res.status(400).render("auth/verify-failed.ejs");

    user.emailVerified = true;
    user.verificationToken = null;
    await user.save();

    req.session.userId = user._id;
    res.render("auth/verify-success.ejs");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error verifying email");
  }
});

// Resend verification email
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("User not found");
    if (user.emailVerified)
      return res.status(400).send("Email already verified");

    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = verificationToken;
    await user.save();

    await sendVerificationEmail(email, verificationToken);

    res.render("auth/verify-email.ejs", {
      email,
      message: "Verification email sent again",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error resending verification email");
  }
});

// Forgot password route
router.get("/forgot-password", (req, res) => {
  res.render("auth/forgot-password.ejs", { message: null });
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("auth/forgot-password.ejs", {
        message:
          "If an account exists with this email, a reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send password reset email
    await sendPasswordResetEmail(email, resetToken);

    res.render("auth/forgot-password.ejs", {
      message: "Password reset link has been sent to your email.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error processing forgot password");
  }
});

// Reset password route
router.get("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).render("auth/reset-password-expired.ejs");

    res.render("auth/reset-password.ejs", { token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading reset page");
  }
});

router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).render("auth/reset-password.ejs", {
        token,
        error: "Passwords do not match",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).render("auth/reset-password-expired.ejs");

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.render("auth/reset-password-success.ejs");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error resetting password");
  }
});

module.exports = router;
