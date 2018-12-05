const User = require('../models/user');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

//require dotenv
require('dotenv').config();


exports.getRegister = (req, res) => {
    res.render('register',{
      'title': 'Register'
    });
   }
exports.getLogin = (req, res)=> {
  res.render('login',{
    'title': 'Login'
  });
}
  
exports.getUpdate = (req, res) => {
    res.render('update',{
      'title': 'Update'
    });
   }
exports.getDelete = (req,res)=>{
    res.render('delete', {
      'title':'Delete'
    });
  }
exports.postRegister =(req,res)=>{
    
    let name = req.body.name;
    let lastname = req.body.lastname;
    const username = req.body.username;
    let email = req.body.email;
    const password = req.body.password;
    const user = {
      _id:mongoose.Types.ObjectId(),
      name,
      lastname,
      email,
      username,
      password
    }
    const newUser = new User(user);
    
    //saving the password as hashed
      const salt = 10;
      console.log(salt)
      bcrypt.hash(newUser.password,salt, (err,hash) => {
        if(err) throw err;
        //Set Hashed Password
        newUser.password = hash;
      
    //async await- saving a user to database
    async function newUserSave(){
      try{
        await newUser.save()
        return res.send("You are an user");

      }
      catch (err){
        console.error(err)
        return res.status(400).send("Unable to save");
      }
    }
    newUserSave();
  });
  }

exports.postLogIn =(req,res)=> {

  //If Local Strategy Comes True
  //adding jwt token
  User.access_token = createJwt({user_name: User.username});
  console.log('Authentication Successful');
  req.flash('success','You are Logged In');
  res.redirect('/');

}

exports.postUpdate = function (req, res){
  const email = req.params.email;
  User.findOneAndUpdate(
    {"email": email}, 
    {"$set": {"name:": req.body.name,"lastname": req.body.lastname}})
    .exec(function(err, findObj){
      if (err){
        console.error(err);
        return res.status(500).send(err);
  
      }else{
        res.status(200).send(findObj);
      }
    })
}

exports.logout = (req,res)=> {
	req.logout();
	req.flash('success','You have logged out');
	res.redirect('/users/login');
}
function createJwt(profile){
  return jwt.sign(profile, 'ItsTheSecretMesage',{
    expiresIn: '2d'
  });
}