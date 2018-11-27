const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/NewDB');
let db = mongoose.connection;


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


console.log(UserSchema)

var User = module.exports =  mongoose.model('User', UserSchema);

