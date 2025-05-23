const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
function generateOTP(length = 6) {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10); // only digits 0–9
  }
  return otp;
}
const sendEmail = require("../utils/emailService");
const multer = require("multer");
const crypto = require("crypto");

//  User Registration with OTP

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, mobileNumber, gender } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if email or mobile number already exists
    const existingUser = await User.findOne({ $or: [{ email }, { mobileNumber }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or Mobile already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a verification token (JWT)
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const verificationTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // Token expires in 1 hour

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      mobileNumber,
      gender,
      verificationToken,
      verificationTokenExpires
    });

    await newUser.save();

    // Create the verification link
    const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${verificationToken}`;

    // Send verification email with the link
    try {
      await sendEmail(
        email,
        "Email Verification",
        `Click here to verify your account: ${verificationLink}`
      );
    } catch (emailErr) {
      console.warn("⚠️ Failed to send email (SMTP issue):", emailErr.message);
    }

    res.status(201).json({
      message: "User registered successfully. Please verify your email to activate your account."
    });

  } catch (error) {
    console.error("❌ Register Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🟢 Email Verification Endpoint
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    // Decode the JWT token to get the email
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user with the given email
    const user = await User.findOne({ email: decoded.email });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if the token has expired
    if (new Date() > user.verificationTokenExpires) {
      return res.status(400).json({ message: "Verification token has expired" });
    }

    // Mark the user as verified and clear the verification token
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully. Your account is now active." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
// 🟢 Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.otp !== otp || new Date() > user.otpExpires) return res.status(400).json({ message: "Invalid or expired OTP" });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully. Your account is now active." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// 🟢 User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.isVerified) return res.status(400).json({ message: "Invalid credentials or unverified account" });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// 🟢 Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmail(email, "Password Reset OTP", `Your password reset OTP is: ${otp}`);
    res.status(200).json({ message: "OTP sent to your email for password reset" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// 🟢 Verify OTP for Password Reset
exports.verifyOTPForReset = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || new Date() > user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.status(200).json({ message: "OTP verified, you can reset your password now" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// 🟢 Reset Password
// Reset Password (Only if OTP is valid)
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if OTP is valid
    if (!user.otp || user.otp !== otp || new Date() > user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

     //Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear OTP fields
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// 🟢 Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, mobileNumber, gender, DOB } = req.body;
    const userId = req.user.userId;

    let encryptedMobile = null;
    if (mobileNumber) {
      encryptedMobile = crypto.createCipher("aes-256-cbc", process.env.MOBILE_SECRET)
        .update(mobileNumber, "utf8", "hex") + 
        crypto.createCipher("aes-256-cbc", process.env.MOBILE_SECRET)
        .final("hex");
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { firstName, lastName, mobileNumber: encryptedMobile, gender, DOB }, { new: true });

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// 🟢 Upload Profile Picture
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.userId}-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

exports.uploadProfilePic = async (req, res) => {
  try {
    const userId = req.user.userId;
    const profilePic = req.file.path;

    await User.findByIdAndUpdate(userId, { profilePic });
    res.status(200).json({ message: "Profile picture uploaded successfully", profilePic });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// 🟢 Delete Account
exports.deleteAccount = async (req, res) => {
  try {
    console.log("User Data:", req.user); 

    const userId = req.user.userId; 
    if (!userId) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete Account Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }

};