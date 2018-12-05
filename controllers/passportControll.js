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
  //async await 
  
  async function locStrat() {
    try{
      const user = await User.find({username});
      if(!user) return done(null, null, console.error('user or email incorrect'));
      const isMatch = comparePassword(password,user[0].password);
      if (isMatch) return (done,null);

    }
    catch (err){
      console.error(err);
      return done(err, null);
    }
   
  }
  locStrat();
});


let comparePassword = (candidatePassword, hash)=>{
  return new Promise((resolve, reject)=>{
    bcrypt.compare(candidatePassword,hash,(err,isMatch)=>{
      if (err) return reject(err);
      resolve(null,isMatch);
    });
  })
}
