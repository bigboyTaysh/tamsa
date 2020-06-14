const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const typeOfEventSchema = new Schema ({
    name: {
        type: String
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('TypeOfEvent', typeOfEventSchema);