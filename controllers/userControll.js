const User = require('../models/user');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const passport = require("passport");


exports.getRegister = (req, res, next) => {
    res.render('register',{
      'title': 'Register'
    });
   }
exports.getLogin = (req, res, next)=> {
    res.render('login',{
        'title': 'Login'
    });
   }
exports.getUpdate = (req, res, next) => {
    res.render('update',{
      'title': 'Update'
    });
   }
exports.getDelete = (req,res,next)=>{
    res.render('delete', {
      'title':'Delete'
    });
  }
exports.postRegister =(req,res,next)=>{
    console.log(req.body)
    
    const name = req.body.name;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const user = {
      _id:mongoose.Types.ObjectId(),
      name,
      email,
      username,
      password
    }
    console.log(`user 
    ${JSON.stringify(user)}`);
      const newUser = new User(user);
    
    //saving the password as hashed
      let salt = 10;
  
      bcrypt.hash(newUser.password,salt, (err,hash) => {
          if(err) throw err;
  
              //Set Hashed Password
      newUser.password = hash;
      
    // saving a new user to database
    newUser.save()
      .then(item => {
        return res.send("You are an user");
        res.flash('/');
      })
      .catch (err =>{
        // return next(err)
        console.error(err)
        return res.status(400).send("Unable to save");
      });
  });
  }
//create jwt
function createJwt(profile){
    return jwt.sign(profile, 'ItsTheSecretMesage',{
      expiresIn: '2d'
    });
  }
exports.postLogin = (req,res)=> {

    //If Local Strategy Comes True
    //adding jwt token
    User.access_token = createJwt({user_name: User.username});
    console.log(User.access_token);
  
      console.log('Authentication Successful');
      req.flash('success','You are Logged In');
      res.redirect('/');
  
  }
 
exports.logout = (req,res)=> {
	req.logout();
	req.flash('success','You have logged out');
	res.redirect('/users/login');
}