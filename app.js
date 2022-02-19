
require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const {Schema} = mongoose;
const encrypt = require("mongoose-encryption");
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema =new mongoose.Schema({
email:String,
password:String
});

userSchema.plugin(encrypt,{secret:process.env.SECRETS,encryptedFields: ['password']})
const User = new mongoose.model("User",userSchema);
app.get("/",function(req,res){
res.render("home");
});

app.get("/login",function(req,res){
res.render("login");
});
app.post("/login",function(req,res){
  User.findOne({email:req.body.username},function(err,docs){
    if(err){
      console.log(err)
    }else{
      if (docs) {
        if (req.body.password === docs.password) {
          res.render("secrets");
        }

      }

    }
  })
})
app.get("/register",function(req,res){
res.render("register");
});

app.post("/register",function(req,res){
  const newuser = new User({
    email:req.body.username,
    password:req.body.password
  })

  newuser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
})
app.listen(3000,function(){
  console.log("logged successfully")
});
