import mongoose from "mongoose";
import connectDB from "./src/lib/db.js";
import User from "./src/models/user.js";

// Connect to the database
await connectDB();

async function createTestUser() {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: "cedrick@gmail.com" });
    if (existingUser) {
      console.log("❌ User already exists:", existingUser.email);
      return;
    }

    const user = new User({
      username: "cedrick",
      email: "cedrick@gmail.com",
      password: "12345678", // will be hashed by pre-save middleware
      subscription: "daily",
      subscriptionStartDate: new Date(),
      credits: 1000,
    });

    await user.save();

    console.log("✅ User created successfully!");
    console.log({
      id: user._id,
      username: user.username,
      email: user.email,
      subscription: user.subscription,
      credits: user.credits,
    });

  } catch (error) {
    console.error("❌ Error creating user:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDatabase connection closed.");
    process.exit(0);
  }
}

// Run the function
createTestUser();
