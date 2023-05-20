const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());
const connectDB = require("./handlers/db");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("./Controller/userSchema");
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("hello world");
});
app.post("/", (req, res) => {
  res.send("POST request to the homepage");
});
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.post("/auth/sign-up", async (req, res) => {
  try {
    const { Fname, Lname, Email, Password } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email: Email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Create a new user
    const newUser = new User({
      FirstName: Fname,
      LastName: Lname,
      email: Email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    console.log("User created:", savedUser);

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.post('/chatroom/user',async (req,res)=>{
  res.status(201).json({Message:"Message Sent"});
  console.log(req.body)
})

app.post("/auth/sign-in", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.log("User Not Found");
      return res.status(404).json({ message: "User not found" });
    }

    bcrypt
      .compare(req.body.password, user.password)
      .then((result) => {
        if (result) {
          console.log("Password is valid");
          return res.status(200).json({ message: "Sign-in successful" });
        } else {
          console.log("Invalid password");
          return res.status(401).json({ message: "Invalid password" });
        }
      })
      .catch((error) => {
        console.log("Error:", error);
        return res.status(500).json({ message: "Internal server error" });
      });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = app;
