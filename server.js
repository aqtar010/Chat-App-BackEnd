const app = require("./app");
const PORT = process.env.PORT || 5000
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const mongoose = require('mongoose');
const User = require('./handlers/schemaHandler'); // assuming you have the schema in a separate file

const cors = require("cors")
app.use(cors());

mongoose.connect('mongodb://localhost:27017/ChatApp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// create a new user and save it to the database
const newUser = new User({
  email: 'user@example.com',
  password: 'password123',
});

newUser.save()
  .then((user) => {
    console.log('User created:', user);
  })
  .catch((error) => {
    console.error('Error creating user:', error);
  });


app.listen(PORT, () => {
  console.log(`listening on port ${PORT}` );
});
