const router = require("express").Router();
let Event = require("../models/event.model");
let TypeOfEvent = require("../models/typeOfEvent.model");
let User = require("../models/user.model");

router.route("/").get((req, res) => {
    console.log(req.query.username);
    User.findOne({username: req.query.username}, (err, user) => {
        if(user){
            Event.find({_id: {$in: user.events}}).populate('type', 'name').exec(function (err, events) {
                if(events){
                    console.log(events);
                    res.status(200).json(events);
                } else {
                    res.status(200).json("Not found");
                }
            });
        } else {
            res.status(400).json("Error: " + err);
        }
    });
});

router.route("/add").post((req, res) => {
    User.findOne({username: req.body.username}, (err, user) => {
        if(user){
            TypeOfEvent.findOne({name: req.body.type.name}, (err, type) => {
                if(type){
                    const newEvent = new Event({
                        title: req.body.title,
                        description: req.body.description,
                        completed: req.body.completed,
                        type: type,
                    });
        
                    newEvent.save()
                    .catch((err) => res.status(400).json("Error: " + err));
        
                    user.events.push(newEvent);
                    user.save()
                    .catch((err) => res.status(400).json("Error: " + err));

                    res.status(201).json("Event added!");
                } else {
                    res.status(400).json("Error: " + err);
                }
            });

        } else {
            res.status(400).json("Error: " + err);
        }
    });
});

module.exports = router;