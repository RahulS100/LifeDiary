//--------------------module inclusion-----------------------
const express = require("express");
const bodyParser = require("body-parser");
const lodash = require("lodash");
const mongoose = require('mongoose');
const { result } = require("lodash");
const { render } = require("ejs");

//----------------------connect the mongoose to mongoDB--------------------
mongoose.connect('mongodb://localhost:27017/postDB', {useNewUrlParser: true});

//-----------------------Make a New Post Schema and Model--------------------
/************postDB Schema for Struture of Post documents************/
const postSchema = mongoose.Schema({
  postTitle: String,
  post: String
});

/************postDB model for Storing the posts**************/
const postModel = mongoose.model('post', postSchema);


//--------------------Constant Parameters--------------------
const homePage =
  "This is a blog Website ot a personel diary website that we can usage for writing our daily thought and interest's and without using any third party blogging website to write your valuable thought you can usage Dugu Dairy - The Personel Blogging Tool";

const aboutPage =
  "Dugu Dairy is personel bloging website to show your thought about anything that you like to the people and One of the main thing about dugu dairy is there is you don't need any complex work to done from your side you we get a premade platform. you can create your profile and start sharing your thought.";

const contactPage =
  "This is Simple Blogging Web App Powered By Express.js Create by Rahul Saharan, You can contact us Using Our email";

//-------------------Setup Express App-----------------------
const BlogApp = express();

//--------------------Setup Utilities and View Engine------------------------
BlogApp.set("view engine", "ejs");
BlogApp.use(bodyParser.urlencoded({ extended: true }));
BlogApp.use(express.static("public"));

//---------------------------Requests--------------------------
//-------------------------------------------------------------
//-------------------------------GET---------------------------
BlogApp.get("/", (req, res) => {

  //-----------fatch all post from the database---------------
  postModel.find({}, (err, result) => {
    if(!err) {
      res.render("home", {
        homePageLines: homePage,
        posts_Send: result,
      });   
    }
}); //------end of the fatching all post from DB---------

});

//--------------------Other Pages-------------------
BlogApp.get("/about", (req, res) => {
  res.render("about", { homePageLines: aboutPage });
});


BlogApp.get("/contact", (req, res) => {
  res.render("contact", { homePageLines: contactPage });
});


BlogApp.get("/compose", (req, res) => {
  res.render("compose");
});

//-----------------render post according to the id---------------
BlogApp.get("/posts/", (req, res) => {
  let postId  = req.query.postId;

  postModel.findOne({_id: postId}, (err, found)=>{
    if(!err) {
    res.render('post', {title: found.postTitle, post: found.post, post_ID: found._id});
    }
  });

});

//-------------------------------POST---------------------------

BlogApp.post("/compose", (req, res) => {
  let post = {
    postTitle: req.body.posttitle,
    post: req.body.post,
  };

  //--------------add post to the database-----------
  const newPost = new postModel(post);

  newPost.save((err) => {
    if(!err) {
      //-----------------redirct to the homepage-----------
      res.redirect("/");
    }
  });
  
});

//------------delete a post----------------
BlogApp.post('/deletepost', (req, res) => {
  let postID = req.body.deletePostBtn;
  postModel.deleteOne({_id: postID}, (err, result) => {
    if(!err) {
      console.log('Post Deleted Successfully');
      res.redirect('/');
    }
  });
});

//-------------------------------Server PORT Stuff------------------
BlogApp.listen(5000, () => {
  console.log("Server Running at port 5000");
});
