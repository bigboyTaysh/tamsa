const router = require("express").Router();
let TypeOfEvent = require("../models/typeOfEvent.model");

router.route("/").get((req, res) => {
  TypeOfEvent.find({}, (err, types) => {
    if (types) {
      res.status(200).json(types);
    } else {
      res.status(400).json("Not found");
    }
  });
});

router.route("/add").post((req, res) => {
    const newTypeOfEvent = new TypeOfEvent({
        name: req.body.name
    });

    newTypeOfEvent.save()
    .then(() => {
      res.status(200).json("Type of event added!");
    })
    .catch((err) => res.status(400).json("Error: " + err));
  });

module.exports = router;
