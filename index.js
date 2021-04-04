const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Profile = require('./models/profile.js');
const PORT = process.env.PORT || 5000;
const fs = require('fs');

//MongoDB
const url = "mongodb+srv://admin:ConnorRK800@savecluster.qzpgr.mongodb.net/player_profiles?retryWrites=true&w=majority";

const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));


//connect to MongoDB and start server
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(PORT, () => console.log(`Server started on port ${PORT}`)))
    .catch((err) => console.log(err))

//BODY

app.post('/loginuser', (req, res) =>{
    var username = req.body.username;
    var password = req.body.password;

    Profile.findOne({userName: username})
        .then((result) =>{
            res.json(result);
        })
        .catch((err) => {
            console.log(err);
        });
    
});

app.post('/adduserprofile', (req, res) =>{
    var username = req.body.username;
    var password = req.body.password;
    console.log(req.body);
    const newProfile = new Profile({
        userName: username,
        userPassword: password,
        progressDay: 0,
        progressBalance: 200
    })

    newProfile.save()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        })
});

app.post('/updatenames', (req, res) => {
    var type = req.body.type;

    fs.readFile('./characters/names/' + type +  'Names.txt', function(err, data) {
        if(err) throw err;
        var names = data.toString().split("\n");
        res.json(names);
    });
});




