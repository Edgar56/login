const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');
const bcrypt = require('bcryptjs');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: true}));

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/login', () => {
    console.log('Connected to db');
});

app.post('/register', (req, res) => {
    const newUser = new User();

    newUser.email = req.body.email;
    newUser.password = req.body.password;

    bcrypt.genSalt(10, (err, salt) => {

        bcrypt.hash(newUser.password, salt, (err, _hash) => {
            if (err) return err;

            newUser.password = _hash;

            newUser.save().then(userSaved => {

                res.send('User saved');

            }).catch(err => {

                res.send(`User was not saved because ` + err);
            });
        });
    });
});

app.post('/login', (req, res) => {

    User.findOne({email: req.body.email}).then(user => {

        if (user) {
            bcrypt.compare(req.body.password, user.password, (err, matched) => {
                if (err) return err;

                if (matched) {
                    res.send('User was able to login');
                } else {
                    res.send('Not able to login');
                }
            });
        }
    });

});


app.listen(4111, () => {
    console.log('Connected port 4111');
});
