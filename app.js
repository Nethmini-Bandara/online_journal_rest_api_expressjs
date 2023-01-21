const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");

const port = 3000;

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

require("./db/connection");

const User = require("./models/user");
const Journal = require("./models/journal");

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/home", async (req, res) => {});

app.post("/registeruser", async (req, res) => {
  const uname = req.body.username;
  const uemail = req.body.email;
  const upassword = req.body.password;

  try {
    // register function from passport js not a variable
    await User.register(
      {
        username: uname,
        email: uemail,
      },
      upassword,
      async (err, user) => {
        if (err) {
          res.status(504).send(err);
        } else {
          await passport.authenticate("local")(req, res, function () {
            res.status(201).send(user);
          });
        }
      }
    );
    // const user = new User({
    //     username: uname,
    //     email: email,
    //     password: password,
    //   });
    //   await user.save();
    //   res.status(201).send(user);
  } catch (e) {
    console.log(e);
  }
});

app.post("/loginuser", async (req, res) => {
  try {
    const uname = req.body.username;
    const upassword = req.body.password;

    console.log(uname);
    console.log(upassword);

    const user = new User({
      username: uname,
      password: upassword,
    });
    req.login(user, async (err) => {
      if (err) {
        // res.status(404).send(err);
        console.log(err);
      } else {
        await passport.authenticate("local")(req, res, function () {
          res.status(200).send(user);
        });
      }
    });
  } catch (e) {
    console.log(e);
  }
});

app.get("/userlist", async (req, res) => {
  try {
    let users = await User.find();
    res.status(200).send(users);
  } catch (e) {
    res.status(444).send(e);
  }
});

app.post("/createjournal", async (req, res) => {
  const title = req.body.title;
  const writer = req.body.writer;
  const jbody = req.body.jbody;

  try {
    if (await req.isAuthenticated()) {
      await User.findById(req.user.id, async (err, foundUser) => {
        if (err) {
          res.status(444).send(err);
        } else {
          if (foundUser) {
            const journal = new Journal({
              title: title,
              writer: writer,
              jbody: jbody,
              uid: foundUser._id,
            });
            await journal.save();
            res.status(201).send(journal);
          } else {
            res.status(404).send("User not found");
          }
        }
      });
    } else {
      res.status(444).send("not authenticate");
    }
  } catch (e) {}
  // try {
  //   const journal = new Journal({
  //     title: title,
  //     writer: writer,
  //     jbody: jbody,
  //   });
  //   await journal.save();
  //   res.status(201).send(journal);
  // } catch (e) {
  //   console.log(e);
  // }
});

app.get("/journallist", async (req, res) => {
  try {
    let journals = await Journal.find();
    res.status(200).send(journals);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.patch("/updatejournal/:ID", async (req, res) => {
  const id = await req.params.ID;

  try {
    if (await req.isAuthenticated()) {
      const updatedjournal = await Journal.findByIdAndUpdate(id, req.body);

      if (updatedjournal) {
        res.status(210).send("updated");
      } else {
        res.status(345).send("error");
      }
    } else {
      res.status(404).send("Log In");
    }
  } catch (e) {}
});

app.delete("/deletejournal/:ID", async (req, res) => {
  const id = await req.params.ID;

  try {
    if (await req.isAuthenticated()) {
      const deletedjournal = await Journal.findByIdAndDelete(id);

      if (deletedjournal) {
        res.status(220).send(deletedjournal);
      } else {
        res.status(345).send("error");
      }
    }
    else{
      res.status(404).send("Please log in");
    }
  } catch (e) {
    res.status(404).send(e);
  }
});

app.listen(port, function () {
  console.log("Server up on port " + port + ".");
});
