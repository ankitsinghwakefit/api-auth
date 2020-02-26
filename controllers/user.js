var auth = require('../modules/auth');
// var mongoose = require('mongoose');
// var User = mongoose.model('User');
var User = require('../models/user');


exports.register = async (req, res, next) => {
  try {
    const user = await User.create(req.body.user);
    const token = await auth.generateJWT(user);
    var userInfo = {
      email: user.email,
      token,
      username: user.username,
      bio: user.bio,
      image: user.image
    }
    res.json({
      user: userInfo
    });

  } catch (error) {
    next(error);
  }
}

exports.login = async (req, res, next) => {
  try {
    var { email, password }  = req.body.user;
    if(!email || !password) {
      return res.status(400).json({error: "Email/Password required"})
    }
    var user = await User.findOne({email});
    if(!user) return res.status(400).json({error: "Invalid Email"});
    var result = await user.verifyPassword(password);
    if(!result) return res.status(400).json({error: "Invalid Password"});
    var token = await auth.generateJWT(user);
    var userInfo = {
      email: user.email,
      token,
      username: user.username,
      bio: user.bio,
      image: user.image
    }
    res.json({user: userInfo});

  } catch (error) {
    next(error);
  }
  
}

exports.getCurrentUser = async (req, res, next) => {
try {
  var user = await User.findById(req.user.userId);
  var {email, username, bio, image } = user;
    res.json({
      user: {
        email,
        username,
        bio,
        image,
        token: req.user.token
      }
    })
} catch (error) {
  next(error);
}
  
}

