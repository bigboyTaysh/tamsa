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
            date: moment(req.body.date).format("YYYY-MM-DDTHH:mm"),
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
              $gte: moment(req.query.start).format(),
              $lte: moment(req.query.end).format(),
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
              $gte: moment(req.query.start).format(),
              $lte: moment(req.query.end).format(),
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
          $gte: new Date(moment(req.query.start).toDate()),
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

router.route("/event").get((req, res) => {
  User.findOne({ username: req.query.username }, (err, user) => {
    if (user) {
      Event.findOne({ _id: req.query.id })
        .populate("type", "name")
        .exec(function (err, event) {
          if (event) {
            res.status(200).json(event);
          } else {
            res.status(200).json("Not found");
          }
        });
    } else {
      res.status(400).json("Error: " + err);
    }
  });
});

router.route("/changeState").put((req, res) => {
  Event.updateOne(
    {
      _id: req.body.id,
    },
    {
      completed: req.body.completed,
    },
    function (err, event) {
      if (event) {
        res.status(200).json("ok");
      } else {
        res.status(204).json(err);
      }
    }
  );
});

router.route("/update").put((req, res) => {
  console.log(req.body);
  TypeOfEvent.findOne({ name: req.body.type }, (err, type) => {
    if (type.length !== 0) {
      console.log("robimy update");
      Event.updateOne(
        {
          _id: req.body.id,
        },
        {
          title: req.body.title,
          description: req.body.description,
          completed: req.body.completed,
          date: moment(req.body.date).format("YYYY-MM-DDTHH:mm"),
          type: type,
        },
        function (err, event) {
          if (event) {
            Event.findOne({ _id: req.body.id })
              .populate("type", "name")
              .exec(function (err, event) {
                if (event) {
                  res.status(200).json(event);
                } else {
                  res.status(200).json("Not found");
                }
              });
          } else {
            console.log("nie ok");
            res.status(204).json(err);
          }
        }
      );
    }
  });
});

router.route("/delete").delete((req, res) => {
  Event.deleteOne({ _id: req.body.id }, (err, event) => {
    User.findOneAndUpdate(
      { events: { $in: req.body.id } },
      { $pull: { events: req.body.id } }
    ).exec();
  })
    .then(() => res.status(200).json("Event deleted"))
    .catch((err) => res.status(204).json("Unable to delete event: " + err));
});

router.route("/timeOffset").get((req, res) => {
  res.status(200).json(moment());
});

module.exports = router;
