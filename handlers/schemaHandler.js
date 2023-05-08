const mongoose = require("mongoose");

// Define a schema for the email and password object
const userSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Create a Mongoose model from the schema
const User = mongoose.model("User", userSchema);

// Export the User model for use in other files
module.exports = User;
