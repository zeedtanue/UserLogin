const express = require('express');
const router = express.Router();
const mongo = require("mongodb");
const flash = require("connect-flash");
const bcrypt =require('bcrypt');
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require('../models/user');
const jwt = require('jsonwebtoken');
let url = 'mongodb://localhost:27017/NewDB'

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.get('/register', (req, res, next) => {
  res.render('register',{
    'title': 'Register'
  });
 });

router.get('/login', (req, res, next)=> {
 res.render('login',{
 	'title': 'Login'
 });
});
router.get('/update', (req, res, next) => {
  res.render('update',{
    'title': 'Update'
  });
 });
 router.get('/delete', (req, res, next)=> {
  try {
    var jwtString = req.cookies.Authorization.split(" ");
    var profile = verifyJwt(jwtString[1]);
    if (profile) {
      res.render('delete',{
        'title': 'delete'
      });
    }
}catch (err) {
    res.json({
        "status": "error",
        "body": [
            "You are not logged in."
        ]
    });
}
});
  
 

 //post-register
router.post('/register',(req,res,next)=>{
  console.log(req.body)
  
  const name = req.body.name;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const user = {
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
});
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
//create jwt
function createJwt(profile){
  return jwt.sign(profile, 'ItsTheSecretMesage',{
    expiresIn: '2d'
  });
}
//jwt verify
function verifyJwt(jwtString){
	const value = jwt.verify(jwtString, 'ItsTheSecretMesage');
	return value;
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
router.post('/update', (req, res)=>{
  
})




//delete
router.delete('/delete', (req,res,next)=>{
  User.remove({_id: req.params._id}, (err)=>{
    res.json({result: err ? 'errpr': 'ok'});
  });
});
router.post('/delete', (req,res)=>{
  
});




module.exports = router;
