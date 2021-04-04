const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    userName: {
        type: 'String',
        required: true
    },
    userPassword:{
        type: 'String',
        required: true
    },
    progressDay:{
        type: 'Number',
        required: true
    },
    progressBalance:{
        type: 'Number',
        required: true
    }
}, {timestamps: true});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;