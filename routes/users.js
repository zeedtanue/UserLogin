const express = require('express');
const passport = require("passport");
const router = express.Router();

const userControll = require('../controllers/userControll');
const passportControll = require('../controllers/passportControll');
const registrationValidator = require('../lib/validation/registration');
const updateValidator = require('../lib/validation/updateValidator');

const jwtToken = passport.authenticate('jwt', { session : false });

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});
router.get('/register', userControll.getRegister );
router.get('/login', userControll.getLogin);
router.get('/update', [jwtToken, updateValidator],  userControll.getUpdate);
router.get('/delete/',jwtToken, userControll.getDelete);
  
 

//post-register
router.post('/register',registrationValidator,userControll.postRegister);
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
router.post('/update/:email',  jwtToken, userControll.postUpdate);

module.exports = router;
