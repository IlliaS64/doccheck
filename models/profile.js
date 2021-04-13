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
    progress:{
        progressDay_1:{
            type: 'Number',
            required: true
        },
        progressBalance_1:{
            type: 'Number',
            required: true
        },
        loanPending_1:{
            type: 'Boolean',
            required: true
        },
        progressDay_2:{
            type: 'Number',
            required: false
        },
        progressBalance_2:{
            type: 'Number',
            required: false
        },
        loanPending_2:{
            type: 'Boolean',
            required: true
        },
        progressDay_3:{
            type: 'Number',
            required: false
        },
        progressBalance_3:{
            type: 'Number',
            required: false
        },
        loanPending_3:{
            type: 'Boolean',
            required: true
        }
    }
}, {timestamps: true});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;