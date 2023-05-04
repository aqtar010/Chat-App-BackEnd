const app = require("./app");
const PORT = process.env.PORT || 5000
const http = require('http').createServer(app);
const io = require('socket.io')(http);
// assuming you have the schema in a separate file

const cors = require("cors")
app.use(cors());



// create a new user and save it to the database



app.listen(PORT, () => {
  console.log(`listening on port ${PORT}` );
});
