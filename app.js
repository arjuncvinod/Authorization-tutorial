//jshint esversion:6
 const express = require("express")
 const ejs = require("ejs")
 const mongoose = require("mongoose")
  const bodyParser = require("body-parser");
  const encrypt = require("mongoose-encryption")
  const app=express()
  app.use(express.static("/public"))
  app.set("view engine","ejs")
  app.use(bodyParser.urlencoded({extended:true}))
  mongoose.connect("mongodb://127.0.0.1:27017/userDB",{
    useNewUrlParser: true
  }).then(console.log("mongo connected"))

  const userSchema= new mongoose.Schema({
    email:String,
    password:String
  })
   const secret="thisisasecret"
  userSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]})
  const User = new mongoose.model("user", userSchema);

app.get("/",(req,res)=>{
    res.render("home")
})
app.get("/login",(req,res)=>{
    res.render("login")
})
app.get("/register",(req,res)=>{
    res.render("register")
})

app.post("/register",(req,res)=>{
    const user = new User({
        email:req.body.username,
        password:req.body.password
    })
    user.save().then(
        res.render("secrets")
      )
})

app.post("/login",async(req,res)=>{
  const username = req.body.username
  const password=req.body.password
  const results = await User.findOne({email:username})
if(results){
  console.log(results);
    if(results.password===password){
      res.render("secrets")
    
    }else{
      res.send("wrong")
    }
  }
  })


  app.listen(3000,()=>{
    console.log("server started");
  })