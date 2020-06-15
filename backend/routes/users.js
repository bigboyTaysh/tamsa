const router = require("express").Router();
let User = require("../models/user.model");

router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const newUser = new User({
    username: req.body.username,
    password: req.body.password,
    events: [],
  });

  newUser
    .save()
    .then(() => res.json("User added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/login").post((req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) res.status(400).json("Error: " + err);

    if (user) {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (err) throw err;

        req.session.loggedInStatus = true;

        isMatch ? res.json(true) : res.json(false);
      });
    } else {
      res.json(false);
    }
  });
});

router.route("/logout").post((req, res) => {
  req.session.loggedInStatus = true;
  res.json(true);
});

router.route("/login_status").post((req, res) => {
    res.json(req.session.loggedInStatus);
});

module.exports = router;
