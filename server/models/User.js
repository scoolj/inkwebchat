const mongoose = require("mongoose");
 const bcrypt = require('bcrypt')
 const saltRounds =10
 const jwt = require('jsonwebtoken')
 const userShema = mongoose.Schema({
    username: {
      type: String,
      maxlength: 40,
    },
    userstate: String,
    usercountry: String,
    email: {
      type: String,
      trim: true,
      unique: 1,
    },
    password: {
      type: String,
      minlength: 5,
    },
    token: {
      type: String,
    },
    tokenExp: {
      type: Number,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
  })

  userShema.pre('save', function(next){
    var user = this
    if(user.isModified('password')){
    bcrypt.genSalt(saltRounds, function(err, salt){
      if(err) return next(err)

      bcrypt.hash(user.password, salt, function(err, hash){
        if(err) return next(err)

        user.password = hash
        next()
      })
    })
  } else{
    next ()
  }
  });


  userShema.methods.comparePassword = function (plainPassword, cb){
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
      if(err) return cb(err)
      cb(null, isMatch)
    })
  }

  userShema.methods.generateToken = function(cb){
    var user = this;
    var token = jwt.sign(user._id.toHexString(), 'secret')

    user.token = token;
    user.save(function(err, user){
      if(err) return cb(err)
      cb(null, user)
    })
  }

const User = mongoose.model('User', userShema)

module.exports = { User };
