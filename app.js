//jshint esversion:6
const mongoose = require('mongoose');
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];
// ======= mongoDB ===========
mongoose.connect('mongodb://localhost:27017/blogsDB');

const blogSchema = {
  title: String,
  content: String
};

const Blog = mongoose.model("Blog",blogSchema);

const aboutContent = new Blog({
  title: "About Me",
  content: "Hi guys, this is Kayla Yin. Thanks for using this blog. Hope this will help you !"
});

const contactContent = new Blog({
  title: "Contacts",
  content: "If you have any problem or issue, you send an email to me. Email: yingyiling_ray@163.com"
});
const homeStartingContent = new Blog({
  title: "Home",
  content:"Welcome to this blog."
});



//========REQ & RES ==========
app.get("/", function(req, res){

  Blog.find(function(err,foundList){
    if (!err) {
      res.render("home", {
        homeStartingContent: homeStartingContent,
        posts: foundList
        });
    }else{
      console.log(err);
    }
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

  const newBlog = new Blog({
    title: req.body.postTitle,
    content:req.body.postBody
  });

  newBlog.save(function(err){
    if(!err){
        res.redirect("/");
    }else{
      console.log(err);
    }
  });


});

app.get("/posts/:postId", function(req, res){
  const requestedTitle = req.params.postId;
  console.log(requestedTitle);
  // find by ID
  Blog.findById({_id:requestedTitle},function(err,foundBlog){
    if(!err){
      console.log(foundBlog.title);
      res.render("post",{
        currentBlog:foundBlog,
      });
    }else{
      console.log(err);
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
