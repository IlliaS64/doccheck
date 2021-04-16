const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Profile = require('./models/profile.js');
const PORT = process.env.PORT || 5000;
const fs = require('fs');
const favicon = require('serve-favicon');

//MongoDB
const url = "mongodb+srv://admin:ConnorRK800@savecluster.qzpgr.mongodb.net/player_profiles?retryWrites=true&w=majority";

const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Set Favicon
app.use(favicon(__dirname + '/public/images/favicon.ico'));

//connect to MongoDB and start server
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true , useFindAndModify: false})
    .then((result) => app.listen(PORT, () => console.log(`Server started on port ${PORT}`)))
    .catch((err) => console.log(err))


//---------MAIN----------

app.post('/updatenames', (req, res) => {
    var type = req.body.type;

    fs.readFile('./public/Characters/Names/' + type +  'Names.txt', function(err, data) {
        if(err) throw err;
        var names = data.toString().split("\n");
        res.json(names);
    });
});

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

app.post('/addnewprofile', (req, res) =>{
    var username = req.body.username;
    var password = req.body.password;
    Profile.findOne({userName: username})
        .then((result) => {
            if(result != null){
                res.json({exists: true});
            }else{
                const newProfile = new Profile({
                    userName: username,
                    userPassword: password,
                    progress:{
                        //save_1
                        progressDay_1: 0,
                        progressBalance_1: randInt(100, 500),
                        loanPending_1: 0,
                        //save_2
                        progressDay_2: 0,
                        progressBalance_2: randInt(100, 500),
                        loanPending_2: 0,
                        //save_3
                        progressDay_3: 0,
                        progressBalance_3: randInt(100, 500),
                        loanPending_3: 0
                    }
                });
            
                newProfile.save()
                    .then((result) => {
                        res.send(result);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post('/updateProfile', (req, res) => {
    const saveNumber = req.body.number;
    const userName = req.body.username;
    var update;
    Profile.findOne({userName: userName})
        .then((result) =>{
            console.log(result);
            update = result;
            switch(saveNumber){
                case '1':{
                    update.progress.progressDay_1 = req.body.day;
                    update.progress.progressBalance_1 = req.body.balance;
                    update.progress.loanPending_1 = req.body.loan;
                    break;
                }
                case '2':{
                    update.progress.progressDay_2 = req.body.day;
                    update.progress.progressBalance_2 = req.body.balance;
                    update.progress.loanPending_2 = req.body.loan;
                    break;
                }
                case '3':{
                    update.progress.progressDay_3 = req.body.day;
                    update.progress.progressBalance_3 = req.body.balance;
                    update.progress.loanPending_3 = req.body.loan;
                    break;
                }
                
            }
        
            Profile.findOneAndUpdate({userName: userName}, update, {new: true})
                .then((result) => {
                    res.json(result);
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
    
        
});

app.get('/getallprofiles', (req, res) => {
    Profile.find()
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            console.log(err);
        });
});

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}