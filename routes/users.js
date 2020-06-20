const router = require("express").Router();
let User = require("../models/user.model");

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
          res.status(201).json(true);
        })
        .catch((err) => res.status(400).json("Error: " + err));
    }
  });
});

router.route("/login").post((req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) res.status(400).json("Error: " + err);

    if (user) {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (err) throw err;
        if(isMatch){
          res.json(true);
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

module.exports = router;
