const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established succesfully');
});

app.use(session({
    key: 'username',
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false
}));

const usersRouter = require('./routes/users');
const eventsRouter = require('./routes/events');
const typeOfEventsRouter = require('./routes/typeOfEvents');

app.use('/users', usersRouter);
app.use('/events', eventsRouter);
app.use('/typeOfEvents', typeOfEventsRouter);

app.listen(port, () => {
    console.log(`Server is running on port : ${port}`);
});