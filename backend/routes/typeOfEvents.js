const router = require("express").Router();
let TypeOfEvent = require("../models/typeOfEvent.model");

router.route("/").get((req, res) => {
  TypeOfEvent.find({}, (err, types) => {
    if (types) {
      res.json(types);
    } else {
      res.json("Not found");
    }
  });
});

router.route("/add").get((req, res) => {
    const newTypeOfEvent = new TypeOfEvent({
        name: req.body.name
    });

    newTypeOfEvent.save()
    .then(() => {res.json("Type of event added to user!")})
    .catch((err) => res.status(400).json("Error: " + err));
  });

module.exports = router;
