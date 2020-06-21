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

eventSchema.pre('delete', function(next) {
    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    
});

module.exports = mongoose.model('Event', eventSchema);