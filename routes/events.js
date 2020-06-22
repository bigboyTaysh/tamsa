const router = require("express").Router();
let Event = require("../models/event.model");
let TypeOfEvent = require("../models/typeOfEvent.model");
let User = require("../models/user.model");

const mongoose = require("mongoose");
const moment = require("moment");

router.route("/").get((req, res) => {
  User.findOne({ username: req.query.username }, (err, user) => {
    if (user) {
      Event.find({ _id: { $in: user.events } })
        .populate("type", "name")
        .exec(function (err, events) {
          if (events) {
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
  User.findOne({ username: req.body.username }, (err, user) => {
    if (user) {
      TypeOfEvent.findOne({ name: req.body.type }, (err, type) => {
        if (type) {
          const newEvent = new Event({
            title: req.body.title,
            description: req.body.description,
            completed: req.body.completed,
            date: new Date(req.body.date),
            type: type,
          });

          newEvent
            .save()
            .catch((err) =>
              res.status(400).json("Error, unable to add event: " + err)
            );

          user.events.push(newEvent);
          user
            .save()
            .catch((err) =>
              res.status(400).json("Error, unable to update user: " + err)
            );

          res.status(201);
        } else {
          res.status(404).json("Error: " + err);
        }
      });
    } else {
      res.status(404).json("Error: " + err);
    }
  });
});

router.route("/search").get((req, res) => {
  User.findOne({ username: req.query.username }, (err, user) => {
    if (user) {
      TypeOfEvent.find({ name: req.query.typename }, (err, type) => {
        if (type.length !== 0) {
          Event.find({
            _id: {
              $in: user.events,
            },
            title: {
              $regex: req.query.title,
              $options: "i",
            },
            description: {
              $regex: req.query.description,
              $options: "i",
            },
            type: type[0]._id,
            date: {
              $gte: new Date(req.query.start),
              $lte: new Date(req.query.end),
            },
          })
            .populate("type", "name")
            .exec(function (err, events) {
              if (events) {
                res.status(200).json(events);
              } else {
                res.status(400).json("Error: " + err);
              }
            });
        } else {
          Event.find({
            _id: {
              $in: user.events,
            },
            title: {
              $regex: req.query.title,
              $options: "i",
            },
            description: {
              $regex: req.query.description,
              $options: "i",
            },
            date: {
              $gte: new Date(req.query.start),
              $lte: new Date(req.query.end),
            },
          })
            .populate("type", "name")
            .exec(function (err, events) {
              if (events) {
                res.status(200).json(events);
              } else {
                res.status(400).json("Error: " + err);
              }
            });
        }
      });
    } else {
      res.status(400).json("Error: " + err);
    }
  });
});

router.route("/upcomingEvents").get((req, res) => { 
  User.findOne({ username: req.query.username }, (err, user) => {
    if (user) {
      Event.find({
        _id: {
          $in: user.events,
        },
        date: {
          $gte: moment(req.query.start).format("YYYY-MM-DDTHH:mm"),
        },
      })
        .populate("type", "name")
        .exec(function (err, events) {
          if (events) { 
            res.status(200).json(events);
          } else {
            res.status(400).json("Error: " + err);
          }
        });
    } else {
      res.status(400).json("Error: " + err);
    }
  });
});

router.route("/delete").delete((req, res) => {
  Event.deleteOne({ _id: req.body.id }, (err, event) => {
      User.findOneAndUpdate(
        { events: { $in: req.body.id }},
        { $pull: { events: req.body.id } },
      ).exec();
  })
    .then(() => res.status(200).json("Event deleted"))
    .catch((err) => res.status(204).json("Unable to delete event: " + err));
});

module.exports = router;
