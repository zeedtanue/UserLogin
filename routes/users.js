const express = require('express');
const router = express.Router();
const mongo = require("mongodb");
const flash = require("connect-flash");
const bcrypt =require('bcrypt');
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const userControll = require('../controllers/userControll');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;


let url = 'mongodb://localhost:27017/NewDB'

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.get('/register', userControll.getRegister );

router.get('/login', userControll.getLogin);
router.get('/update',passport.authenticate('jwt', { session : false }),  userControll.getUpdate);
router.get('/delete/', userControll.getDelete);
  
 

 //post-register
router.post('/register',userControll.postRegister);
//passport 
passport.serializeUser((user,done)=>{
  done(null, user[0].id);
});

passport.deserializeUser((id,done)=>{
  User.findById(id, (err, user)=>{
    done(err,user);
  });
});

const comparePassword = (candidatePassword, hash, callback)=>{

  bcrypt.compare(candidatePassword, hash, (err, isMatch)=>{
    if (err) return callback(err);
    callback(null, isMatch);
  });
}
passport.use(new JWTstrategy({
  secretOrKey : 'ItsTheSecretMesage',
  //we expect the user to send the token as a query paramater with the name 'secret_token'
  jwtFromRequest : ExtractJWT.fromUrlQueryParameter('secret_token')
}, async (token, done) => {
  try {
    console.log(token.user);
    //Pass the user details to the next middleware
    return done(null, token.user);
  } catch (error) {
    done(error);
  }
}));
passport.use(new localStrategy(
  (username,password,done)=>{
    User.find({username: username},(err, user)=>{
      if (err) throw err;
      if(user.length == 0){
        console.log("Unknown User");
        return done(null,false,{message: 'unknown User'});

      }
      comparePassword(password,user[0].password, (err,isMatch)=>{
        if (err) throw err;
        if (isMatch){
          
          return done(null, user);
          res.redirect('/');

        }else{
          console.log('invalid password');
          return done(null, false, {message:"Invalid password"});
        }
      })
    });
  }
));

function createJwt(profile){
  return jwt.sign(profile, 'ItsTheSecretMesage',{
    expiresIn: '2d'
  });
}
router.post('/login',passport.authenticate('local',{failureRedirect:'/users/login',failureFlash:'Invalid Username or Password'}), (req,res)=> {

  //If Local Strategy Comes True
  //adding jwt token
  User.access_token = createJwt({user_name: User.username});
  console.log(User.access_token);

    console.log('Authentication Successful');
    req.flash('success','You are Logged In');
    res.redirect('/');

});

//logout 
router.get('/logout', (req,res)=> {
	req.logout();
	req.flash('success','You have logged out');
	res.redirect('/users/login');
});




//update
router.post('/update/:email',  function (req, res){
  const email = req.params.email;
  User.findOneAndUpdate({"email": email}, {"$set": {"name:": req.body.name,"lastname": req.body.lastname}}).exec(function(err, findObj){
    if (err){
      console.log(err);
      res.status(500).send(err);

    }else{
      res.status(200).send(findObj);
    }
  })
});

module.exports = router;
