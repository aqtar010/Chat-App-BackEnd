const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());
const connectDB=require('./handlers/db')
const mongoose = require('mongoose');
const User = require('./handlers/schemaHandler'); 
connectDB()
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

app.post("/auth/*", (req, res) => {
  const pass = req.body.Password;
  const email1 = req.body.Email;
  console.log(email1, "  ", pass);
  const newUser = new User({
    email: email1,
    password: pass,
  });
  
  newUser.save()
    .then((user) => {
      console.log('User created:', user);
    })
    .catch((error) => {
      console.error('Error creating user:', error);
    });

  res.json({ message: "Form submission received" });
});


module.exports = app;
