const router = require("express").Router();
let User = require("../models/user.model");

router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if(user){
      res.json(false);
    } else {
      const newUser = new User({
        username: req.body.username,
        password: req.body.password,
        events: [],
      });
    
      newUser
        .save()
        .then(() => {
          res.json(true);
        })
        .catch((err) => res.status(400).json("Error: " + err));
    }

    res.status(200);
  });
});

router.route("/login").post((req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) res.status(400).json("Error: " + err);

    if (user) {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (err) throw err;

        if(isMatch){

          req.session.regenerate(function(err) {
            req.session.username = req.body.username;
            res.json(true);
          })
          
        } else {
          res.json(false);
        }
      });
    } else {
      res.json(false);
    }

    res.status(200);
  });
});

router.route("/logout").post((req, res) => {
  req.session.username = '';
  res.json(true);
  res.status(200).end();
  req.session.destroy();
});

router.route("/login_status").post((req, res) => {
  console.log('ses: ' + req.session.username)
  req.session.username ? res.json(true) : res.json(false);
  res.status(200);
});

module.exports = router;
