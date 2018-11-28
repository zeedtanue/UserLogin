const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/NewDB');


//schema for user

const UserSchema = new mongoose.Schema({
    name :String,
    lastname :String,
    email : {
        type : String,
        unique: true
    },
    username: String,

    password :{
        type : String,
        bcrypt: true
    } 
    
    
    
});

module.exports =  mongoose.model('User', UserSchema);

