const router = require("express").Router();
let TypeOfEvent = require("../models/typeOfEvent.model");

router.route("/").post((req, res) => {
  TypeOfEvent.find({}, (err, types) => {
    if (types) {
      res.json(types);
    } else {
      res.json("Not found");
    }
  });
});

router.route("/add").post((req, res) => {
    const newTypeOfEvent = new TypeOfEvent({
        name: req.body.name
    });

    newTypeOfEvent.save()
    .then(() => {res.json("Type of event added!")})
    .catch((err) => res.status(400).json("Error: " + err));
  });

module.exports = router;
