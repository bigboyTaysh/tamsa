const mongoose = require('mongoose');

const typeOfEventSchema = new Schema ({
    name: {
        type: String
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('TypeOfEvent', typeOfEventSchema);