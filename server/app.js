const express = require('express')
const keys = require("./config/keys");
const app = express();

const db = require("./models");
const Role = db.role;

db.mongoose
  // .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
  .connect(keys.mongoUri, {
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






  // set port, listen for requests
const PORT = process.env.PORT || 8010;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'user' to  roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });

      new Role({
        name: "merchant",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Merchant' to roles collection");
      });

      new Role({
        name: "exchanger",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Exchanger' to roles collection");
      });
    }
  });
}

