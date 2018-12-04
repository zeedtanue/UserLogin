//const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const bcrypt =require('bcrypt');


const User = require('../models/user');

exports.passportSerializeUser= (user,done)=>{
    done(null, user[0].id);
  };
  
exports.passportDeSerializeUser = (id,done)=>{
    User.findById(id, (err, user)=>{
      done(err,user);
    });
  }

exports.JWTstrategy = new JWTstrategy({
    secretOrKey : 'ItsTheSecretMesage',
    
    jwtFromRequest : ExtractJWT.fromUrlQueryParameter('secret_token')
  }, async (token, done) => {
    try {
      return done(null, token.user);
    } catch (error) {
      done(error);
    }
  })
  
exports.newLocalStrategy=new localStrategy({
      usernameField: 'username',
      passwordField: 'password'
},(username,done)=>{
  User.find({username}).then(user =>{
    if(!user) return done(null, null, console.error('user or email incorrect'));
    comparePassword(password,user[0].password)
    .then(isMatch=>{
      if (isMatch) return (done,null);
    })
    .catch(err=>{
      console.error(err);
      return done(err, null);
    });
      
  }).catch(err =>{
    return done(err, null);
  });
  
});
let comparePassword =new Promise((candidatePassword, hash, callback)=>{
  bcrypt.compare(candidatePassword, hash, (err, isMatch)=>{
    if (err) return callback(err);
    callback(null, isMatch);
    });
});

