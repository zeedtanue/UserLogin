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

let url = 'mongodb://localhost:27017/NewDB'

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.get('/register', userControll.getRegister );

router.get('/login', userControll.getLogin);
router.get('/update', checkAuth ,userControll.getUpdate);
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


router.post('/login',passport.authenticate('local',{failureRedirect:'/users/login',failureFlash:'Invalid Username or Password'}), userControll.postLogin);

//logout 
router.get('/logout', (req,res)=> {
	req.logout();
	req.flash('success','You have logged out');
	res.redirect('/users/login');
});



//update
router.post('/update', (req, res)=>{
  
})


router.delete('/delete/:username', (req, res) => {
  url.collection('users').findOneAndDelete({username: req.params.username}, 
  (err, result) => {
    if (err) return console.log(500, err)
    console.log('got deleted');
    res.redirect('/');
  })
})

//delete
/*
router.post('delete/:id', (req, res, next) => {
  User.findOneAndRemove({_id: req.params.id}, (err) => {
    if (err) {
      req.flash("error", err);
      return res.redirect("/");
    }

    req.flash("success", "Your account has been deleted.");
    req.logout();
    return res.redirect("/");
  });
});
//router.post('/delete', (req,res)=>{
  
//});


*/

module.exports = router;
