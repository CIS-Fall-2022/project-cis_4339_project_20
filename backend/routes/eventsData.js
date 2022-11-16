const express = require("express");
const router = express.Router();

//importing data model schemas
let { eventdata } = require("../models/models"); 

//GET all entries
router.get("/", (req, res, next) => { 
    eventdata.find( {organization_id: process.env.ORGANIZATION},
        (error, data) => {
            if (error) {
                return next(error),
                res.status(404).send('Could not retrieve all events.'); //error response with a status number when unable to retrieve all events.
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});

//GET single entry by ID
router.get("/id/:id", (req, res, next) => { 
    eventdata.find({ _id: req.params.id, organization_id: process.env.ORGANIZATION }, (error, data) => {
        if (error) {
            return next(error),
            res.status(404).send('Could not find eevent by given ID. Please check spelling and character placement!')//error message when client cannot be found by ID. Spell check and character placement check for ID's with more than just alphabetical characters.
        } else {
            res.json(data)
        }
    })
});

//GET entries based on search query
//Ex: '...?eventName=Food&searchBy=name' 
router.get("/search/", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'name') {
        dbQuery = { eventName: { $regex: `^${req.query["eventName"]}`, $options: "i" } }
    } else if (req.query["searchBy"] === 'date') {
        dbQuery = {
            date:  req.query["eventDate"]
        }
    };
    eventdata.find( {organization_id: process.env.ORGANIZATION},
        dbQuery, 
        (error, data) => { 
            if (error) {
                return next(error),
                res.status(404).send('Could not find event, please check spelling!');//error response 404 event not found
            } else {
                res.json(data);
            }
        }
    );
});

//GET events for which a client is signed up
router.get("/client/:id", (req, res, next) => { 
    eventdata.find( 
        { attendees: req.params.id, organization_id: process.env.ORGANIZATION }, 
        (error, data) => { 
            if (error) {
                return next(error),
                res.status(404).send('Could not find events tied to Client'); //error response showing no events tied to the selected client
            } else {
                res.json(data);
            }
        }
    );
});

//POST
router.post("/", (req, res, next) => { 
    req.body.organization_id = process.env.ORGANIZATION
    eventdata.create(
        req.body, 
        (error, data) => { 
            if (error) {
                return next(error),
                res.status(400).send('The event was NOT added to the database.');
            } else {
                res.json(data);
            }
        }
    );
});

//PUT
router.put("/:id", (req, res, next) => {
    eventdata.findOneAndUpdate(
        { _id: req.params.id, organization_id: process.env.ORGANIZATION },
        req.body,
        (error, data) => {
            if (error) {
                return next(error),
                res.status(400).send('ID was not added.');
            } else {
                res.json(data);
            }
        }
    );
});

//PUT add attendee to event
router.put("/addAttendee/:id", (req, res, next) => {
    //only add attendee if not yet signed uo
    eventdata.find( 
        { _id: req.params.id, attendees: req.body.attendee, organization_id: process.env.ORGANIZATION }, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                if (data.length == 0) {
                    eventdata.updateOne(
                        { _id: req.params.id }, 
                        { $push: { attendees: req.body.attendee } },
                        (error, data) => {
                            if (error) {
                                consol
                                return next(error),
                                res.status(400).send('Attendee was NOT able to be added.');
                            } else {
                                res.json(data);
                            }
                        }
                    );
                }
                
            }
        }
    );
    
});
// DELETE eventData by ID
router.delete("/id/:id", (req, res, next) => {
    eventdata.deleteOne({ _id: req.params.id }, (error, data) => {
        if (error) {
            return next(error),
            res.status(404).send('Unable to delete event.');
        } else {
            res.status(200).json({
            msg: data
            })
        }
    })
});

//GET Number of Attendees for an Event
router.get("/attendees/:id", (req, res, next) => {
    eventdata.find({ _id: req.params.id }, (error, data) => {
        if (error) {
            return next(error),
            res.status(404).send('Unable to find Attendees')
        } else {
            res.json(data[0].attendees.length) 
        }
    })
});

//GET events from the past 2 months
router.get("/organization/:name", (req, res, next) => {
    let dbQuery = "";
    dbQuery = { organization: req.params.name };
    
    eventdata.find(dbQuery,(error, data) => {
        let today = new Date();
        let twoMonthsAgo = new Date();
            twoMonthsAgo.setMonth(today.getMonth() - 2);
        let filteredData = data.filter((event) => {
        let eventDate = new Date(event.date);
            return eventDate > twoMonthsAgo;
        });
            if (error) {
            return next(error),
            res.status(404).send('Could not find events from the past 2 months');
            } else {
                res.json(filteredData);
            }
    });
});
module.exports = router;
