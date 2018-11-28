const express = require('express');
const passport = require("passport");
const router = express.Router();


const userControll = require('../controllers/userControll');
const passportControll = require('../controllers/passportControll');


/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});
router.get('/register', userControll.getRegister );
router.get('/login', userControll.getLogin);
router.get('/update',passport.authenticate('jwt', { session : false }),  userControll.getUpdate);
router.get('/delete/',passport.authenticate('jwt', { session : false }), userControll.getDelete);
  
 

//post-register
router.post('/register',userControll.postRegister);
//passport 
passport.serializeUser(passportControll.passportSerializeUser);
passport.deserializeUser(passportControll.passportDeSerializeUser);
passport.use(passportControll.JWTstrategy);
passport.use(passportControll.newLocalStrategy);

//login
router.post('/login',passport.authenticate('local',{failureRedirect:'/users/login',failureFlash:'Invalid Username or Password'}), userControll.getLogin);
//logout 
router.get('/logout',userControll.logout);
//update
router.post('/update/:email',  passport.authenticate('jwt', { session : false }), userControll.postUpdate);

module.exports = router;
