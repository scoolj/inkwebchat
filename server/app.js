const express = require("express");
const keys = require("./config/keys");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { User } = require("./models/User");
const { auth } = require("./middlewares/auth");
const db = require("./models");
// const { User } = require("./models");
const Role = db.role;

db.mongoose
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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// authentication
app.get("/api/user/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req._id,
    isAuth: true,
    username: req.user.username,
    email: req.user.email,
    userstate: req.user.userstate,
    usercountry: req.user.usercountry,
    role: req.user.roles,
  });
});

app.post("/api/users/register", (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({
      success: true,
      userData: doc,
    });
  });
});

app.post("/api/user/login", (req, res) => {
  // find the username
  User.findOne({ username: req.body.username }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: "Auth Failed, username not found",
      });

    // compare password
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: "Wrong password",
        });
      }
    });

    //generateToken
    user.generateToken((err, user) => {
      if (err) return res.status(400).send(err);
      res.cookie("x_auth", user.token).status(200).json({
        loginSuccess: true,
      });
    });
  });
});

// logout function
app.get("/api/user/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

// set port, listen for requests
const PORT = process.env.PORT || 5030;
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
