const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());
const connectDB=require('./handlers/db');
const bcrypt = require(("bcryptjs"))
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
  
  const {Fname,Lname,Email,Password}=req.body;
  const newUser = new User({
    FirstName:Fname,
    LastName:Lname,
    email: Email,
    password: bcrypt.hashSync(Password, bcrypt.genSaltSync()),
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
app.post('/auth/sign-in',async (req,res)=>{
  const user=await User.findOne({email:req.body.email})
  user?console.log(user,"User found"):console.log("User Not Found");
});


module.exports = app;
