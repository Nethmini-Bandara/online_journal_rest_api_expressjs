const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');
const passport = require('passport');

const port = 3000;

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
    secret:"secret",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

require("./db/connection");

const User = require('./models/user');
const Journal = require('./models/journal');

app.get('/home', async(req,res) => {

});

app.post('/registeruser', async(req,res) => {
const uname = req.body.username;
const email = req.body.email;
const password = req.body.password;

try{
    const user = new User({
        username: uname,
        email: email,
        password: password,
      });
      await user.save();
      res.status(201).send(user);
}
catch(e){
  console.log(e);
}
});

app.post('/loginuser', async(req,res) => {
  const uname = req.body.username;
  const password = req.body.password;
  
  try{
      const user = new User({
          username: uname,
          email: email,
          password: password,
        });
        // await user.save();
        res.status(201).send(user);
  }
  catch(e){
    console.log(e);
  }
});

app.get('/userlist', async(req,res) => {

});

app.post('/createjournal', async(req,res) => {
  const title = req.body.title;
  const writer = req.body.writer;
  const jbody = req.body.jbody;
  
  try{
      const journal = new Journal({
          title: title,
          writer: writer,
          jbody: jbody,
        });
        await journal.save();
        res.status(201).send(journal);
  }
  catch(e){
    console.log(e);
  }
});

app.get('/journallist', async(req,res) => {

});

app.patch('/updatejournal/:ID', async(req,res) => {

});

app.delete('/deletejournal/:ID', async(req,res) => {

});

app.listen(port, function () {
  console.log("Server up on port " + port + ".");
});
