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

app.post("/auth/sign-up", (req, res) => {
  console.log(req.body);
  const {Fname,Lname,Email,Password}=req.body;
  const newUser = new User({
    FirstName:Fname,
    LastName:Lname,
    email: Email,
    password: Password,
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
