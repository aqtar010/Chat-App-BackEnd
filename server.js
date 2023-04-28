const app = require("./app");
const PORT = process.env.PORT || 5000
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require("cors")
app.use(cors());


app.listen(PORT, () => {
  console.log(`listening on port ${PORT}` );
});
