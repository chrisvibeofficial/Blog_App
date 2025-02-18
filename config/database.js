require('dotenv').config();
const mongoose = require('mongoose');
const DB = process.env.MongoDB_URI;

mongoose.connect(DB).then(() => {
  console.log('Connection to Database has been established')
}).catch((error) => {
  console.log('Error connecting to Database: ' + error.message)
})