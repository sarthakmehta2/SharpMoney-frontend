const mongoose = require('mongoose');
require('dotenv').config({path: "../.env"});

const MONGOURI = process.env.MONGO_URI;
console.log(process.env.MONGO_URI);

mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

// mongoose.connect("mongodb+srv://mehtasarthak2:UyXpqDokZPWfmmku@cluster0.pmhujc1.mongodb.net/")

const blogSchema = new mongoose.Schema({
title:{
    type: String,
    trim: true,
    min:3,
    max: 160,
    required: true
},
slug:{
    type: String,
    unique:true,
    index:true,
    lowercase: true
},
content:{
    type:{},
    required:true,
    min: 20,
    max: 2000000
},
user:{
    type:String,
    default:'Admin'
},
date:{
    type: String
},
imageUrl:{
    type: String
}
},
{timestamps:true}
);

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const blog = mongoose.model('blog', blogSchema);
const sharpadmin = mongoose.model('user', userSchema);

module.exports={
    blog: blog,
    sharpadmin: sharpadmin
};

