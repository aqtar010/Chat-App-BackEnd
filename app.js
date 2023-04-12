const express = require("express");
const app = express();



app.get("/", (req, res) => {
  res.send("hello world");
});
app.post('/', (req, res) => {
    res.send('POST request to the homepage')
  })

  
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
