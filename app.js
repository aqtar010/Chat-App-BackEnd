const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("hello world");
});
app.post("/", (req, res) => {
  res.send("POST request to the homepage");
});
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.post("/submit", (req, res) => {
  const pass = req.body.Password;
  const email = req.body.Email;
  console.log(email, "  ", pass);

  res.json({ message: "Form submission received" });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const errorHandlers = require("./handlers/errorHandler");
app.use(errorHandlers.notFound);
app.use(errorHandlers.mongoseErrors);
if (process.env.ENV === "DEVELOPMENT") {
  app.use(errorHandlers.developmentErrors);
} else {
  app.use(errorHandlers.productionErrors);
}
module.exports = app;
