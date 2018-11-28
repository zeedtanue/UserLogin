const localStrategy = require("passport-local").Strategy;

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;


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
      console.log(token.user);
      return done(null, token.user);
    } catch (error) {
      done(error);
    }
  })

  exports.newLocalStrategy= new localStrategy(
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
    });
  