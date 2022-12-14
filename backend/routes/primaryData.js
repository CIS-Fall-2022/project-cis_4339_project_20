const express = require("express"); 
const router = express.Router(); 

//importing data model schemas
let { primarydata } = require("../models/models"); 
let { eventdata } = require("../models/models"); 

//GET all entries
router.get("/", (req, res, next) => { 
    primarydata.find({organization_id: process.env.ORGANIZATION}, 
        (error, data) => {
            if (error) {
                return next(error),
                res.status(404).send('Could not retrieve all clients.'); //error code response sent with a status number and message to be displayed.
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});

//GET single entry by ID
router.get("/id/:id", (req, res, next) => {
    primarydata.find({ _id: req.params.id, organization_id: process.env.ORGANIZATION}, 
        (error, data) => {
            if (error) {
                return next(error),
                res.status(404).send('Could not find client by given ID. Please check spelling and character placement!'); //error response to check spelling for searches.
            } else {
                res.json(data);
            }
        }
    );
});

//DELETE primaryData by ID
router.delete("/id/:id", (req, res, next) => {
    primarydata.deleteOne({ _id: req.params.id, organization_id: process.env.ORGANIZATION},
         (error, data) => {
        if (error) {
            return next(error),
            res.status(400).send('Unable to delete client.'); //error response if client cannot be deleted.
        } else {
             res.status(200).json({
            msg: data
            })
        }
    })
});
//GET entries based on search query
//Ex: '...?firstName=Bob&lastName=&searchBy=name' 
router.get("/search/", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'name') {
        dbQuery = { firstName: { $regex: `^${req.query["firstName"]}`, $options: "i" }, lastName: { $regex: `^${req.query["lastName"]}`, $options: "i" } }
    } else if (req.query["searchBy"] === 'number') {
        dbQuery = {
            "phoneNumbers.primaryPhone": { $regex: `^${req.query["phoneNumbers.primaryPhone"]}`, $options: "i" }
        }
    };
    primarydata.find( 
        dbQuery, 
        (error, data) => { 
            if (error) {
                return next(error),
                res.status(404).send('Could not find client, please check spelling!');//error response for client not found with spell check.
            } else {
                res.json(data);
            }
        }
    );
});


//POST
router.post("/", (req, res, next) => {
    req.body.organization_id = process.env.ORGANIZATION 
    primarydata.create( 
        req.body,
        (error, data) => { 
            if (error) {
                return next(error),
                res.status(400).send('The client was NOT added to the database.');
            } else {
                res.json(data); 
            }
        }
    );
    primarydata.createdAt;
    primarydata.updatedAt;
    primarydata.createdAt instanceof Date;
});

//PUT update (make sure req body doesn't have the id)
router.put("/:id", (req, res, next) => { 
    primarydata.findOneAndUpdate({ _id: req.params.id, organization_id: process.env.ORGANIZATION}, 
        req.body,
        (error, data) => {
            if (error) {
                return next(error),
                res.status(400).send('ID not added.');
            } else {
                res.json(data);
            }
        }
    );
});

module.exports = router;
