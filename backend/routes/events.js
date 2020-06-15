const router = require("express").Router();
let Event = require("../models/event.model");
let User = require("../models/user.model");

router.route("/").get((req, res) => {
    User.find({username: req.username}, (err, user) => {
        if(user){
            Event.findById({id: {$in: user.events}}, (err, events) => {
                if(events){
                    res.json(events);
                } else {
                    res.json("Not found");
                }
            });
        } else {
            res.status(400).json("Error: " + err);
        }
    });
});

router.route("/add").get((req, res) => {
    User.findOne({username: req.body.username}, (err, user) => {
        if(user){
            const newEvent = new Event({
                title: req.body.title,
                description: req.body.description,
                completed: req.body.completed,
            });

            newEvent.save()
            .then(() => res.json("Event added!"))
            .catch((err) => res.status(400).json("Error: " + err));

            user.events.push(newEvent);
            user.save()
            .then(() => res.json("Event added to user!"))
            .catch((err) => res.status(400).json("Error: " + err));

        } else {
            res.status(400).json("Error: " + err);
        }
    });
});



module.exports = router;