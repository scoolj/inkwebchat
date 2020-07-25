const express = require('express')
const app = express()
const keys = require('./config/keys')
const mongoose = require('mongoose')

mongoose.connect(keys.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

app.get('/', (req, res) =>{
    res.send('Hello world')
})
app.listen(5000)