const express = require('express');
const cors = require('cors');
const prisma = require('./prisma.cjs');
const { sendRecoveryCode } = require('./services/email.cjs'); // adjust path
const argon2 = require('argon2');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing fields" });
  }

  try {
      const hashedPassword = await argon2.hash(password);

      const newUser = await prisma.users.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser.id,
        email: newUser.email
      }
    });
  } catch (err) {
    console.error("Prisma error:", err);

    // Ensure Prisma error is always returned as JSON
    if (err.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Database error",
      error: err.message || "Unknown error"
    });
  }
});


app.post('/api/register-google', async (req, res) => {
  const { email, name, googleId } = req.body;

  if (!email || !googleId || !name) {
    return res.status(400).json({
      success: false,
      message: "Missing Google account details"
    });
  }

  try {
    // Check if user already exists
    let user = await prisma.users.findUnique({
      where: { email }
    });

    if (!user) {
      user = await prisma.users.create({
        data: {
          email,
          name,
          googleId, // Add this field to your Prisma schema if not present
          registeredVia: "google" // Optional tracking field
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: "Google user registered successfully",
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (err) {
    console.error("Google registration error:", err);
    return res.status(500).json({
      success: false,
      message: "Google registration failed",
      error: err.message
    });
  }
});

// Utility to generate 6-digit code
const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};



app.post('/api/verify-code', async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: "Missing email or code" });
  }

  try {
    const match = await prisma.recovery_code.findFirst({
      where: {
        email,
        code,
        used: false,
      },
    });

    if (!match) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    // Optionally: mark the code as used to prevent reuse
    await prisma.recovery_code.update({
      where: { id: match.id },
      data: { used: true },
    });

    res.json({ message: "Code verified" });
  } catch (err) {
    console.error("❌ Failed to verify code:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/recover", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    // 🔍 Check if user exists
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({
        message: "Your account doesn't exist. Please sign up first.",
      });
    }

    // 🚫 Block Google-registered accounts from using password recovery
    if (user.googleId) {
      return res.status(400).json({
        message: "This account was created using Google Sign-In. Please use Google to log in.",
      });
    }

    const code = generateCode();

    // 🌏 Convert to Malaysia time (UTC+8)
    const now = new Date();
    const offsetMs = 8 * 60 * 60 * 1000; // +8 hours
    const malaysiaTime = new Date(now.getTime() + offsetMs);
    const expiresAt = new Date(malaysiaTime.getTime() + 10 * 60 * 1000); // +10 minutes

    // Save to DB
    await prisma.recovery_code.create({
      data: {
        email,
        code,
        used: false,
        createdAt: malaysiaTime,
        expiresAt,
      },
    });

    await sendRecoveryCode(email, code);

    return res.json({ message: "Recovery code sent successfully." });
  } catch (err) {
    console.error("❌ Failed to send recovery code:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



app.post("/api/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Missing email or new password" });
  }

  try {
    // Check if user exists
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update password
    const hashedNewPassword = await argon2.hash(newPassword);

    await prisma.users.update({
      where: { email },
      data: { password: hashedNewPassword },
    });

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("❌ Failed to reset password:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }

  try {
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await argon2.verify(user.password, password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful", user: { email: user.email } });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
