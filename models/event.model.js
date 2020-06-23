const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
let User = require("../models/typeOfEvent.model");

const eventSchema = new Schema ({
    title: {
        type: String,
        minlength: 3,
    },
    description : {
        type: String,
    },
    date: {
        type: Date
    },
    completed: {
        type: Boolean
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TypeOfEvent',
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Event', eventSchema);