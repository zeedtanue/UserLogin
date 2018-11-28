const express = require('express');
const router = express.Router();
const bcrypt =require('bcrypt');
const passport = require("passport");
const userControll = require('../controllers/userControll');
const passportControll = require('../controllers/passportControll');


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
passport.serializeUser(passportControll.passportSerializeUser);
passport.deserializeUser(passportControll.passportDeSerializeUser);
const comparePassword = (candidatePassword, hash, callback)=>{

  bcrypt.compare(candidatePassword, hash, (err, isMatch)=>{
    if (err) return callback(err);
    callback(null, isMatch);
  });
}
passport.use(passportControll.JWTstrategy);
passport.use(passportControll.newLocalStrategy);

router.post('/login',passport.authenticate('local',{failureRedirect:'/users/login',failureFlash:'Invalid Username or Password'}), userControll.getLogin);
//logout 
router.get('/logout',userControll.logout);

//update
router.post('/update/:email',  userControll.postUpdate);

module.exports = router;
