const uuid = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//collection for intakeData
let primaryDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    firstName: {
        type: String,
        require: true
    },
    middleName: {
        type: String,
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    phoneNumbers: {
        type: Array,
        required: true
    },
    address: {
        line1: {
            type: String
        },
        line2: {
            type: String,
        },
        city: {
            type: String,
            required: true
        },
        county: {
            type: String,
        },
        zip: {
            type: String,
        }
    },
    organization_id: {
        type: mongoose.Schema.Types.ObjectId,
      ref: 'organizationData'
    }
}, {
    collection: 'primaryData',
    timestamps: true
});

//collection for eventData
let eventDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    eventName: {
        type: String,
        require: true
    },
    services: {
        type: Array
    },
    date: {
        type: Date,
        
    },
    address: {
        line1: {
            type: String
        },
        line2: {
            type: String,
        },
        city: {
            type: String,
        },
        county: {
            type: String,
        },
        zip: {
            type: String,
        }
    },
    description: {
        type: String,
    },
    attendees: [{
        type: String
    }],
    organization_id: {
        type: mongoose.Schema.Types.ObjectId,
      ref: 'organizationData'
    }
}, {
    collection: 'eventData'
});

// Created the new collection to hold the Organization Data.
let organizationDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    OrgName: { type: String, require: true},
},{
    collection: 'organizationData'
});

// create models from mongoose schemas
const primarydata = mongoose.model('primaryData', primaryDataSchema);
const eventdata = mongoose.model('eventData', eventDataSchema);
const organizationdata = mongoose.model('organizationData', organizationDataSchema); // Added the variable for orgData.
// package the models in an object to export 
module.exports = { primarydata, eventdata, organizationdata } //added the variable organizationdata to be exported.
