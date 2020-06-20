const router = require("express").Router();
let TypeOfEvent = require("../models/typeOfEvent.model");

router.route("/").get((req, res) => {
  TypeOfEvent.find({}, (err, types) => {
    if (types) {
      res.json(types);
      res.status(200).end();
    } else {
      res.json("Not found");
      res.status(200).end();
    }
  });
});

router.route("/add").post((req, res) => {
    const newTypeOfEvent = new TypeOfEvent({
        name: req.body.name
    });

    newTypeOfEvent.save()
    .then(() => {
      res.json("Type of event added!");
      res.status(200).end();
    })
    .catch((err) => res.status(400).json("Error: " + err));
  });

module.exports = router;
