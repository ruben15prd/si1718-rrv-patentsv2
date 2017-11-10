"use strict";

/* global __dirname */



var express = require("express");

var bodyParser = require("body-parser");

var helmet = require("helmet");

var path = require('path');



var  MongoClient = require('mongodb').MongoClient;



var mdbURL = "mongodb://rrv:rrv@ds255455.mlab.com:55455/si1718-rrv-patents";



var port = (process.env.PORT || 10000);

var BASE_API_PATH = "/api/v1";



var db;





MongoClient.connect(mdbURL,{native_parser:true},function (err,database){



    if(err){

        console.log("CAN NOT CONNECT TO DB: "+err);

        process.exit(1);

    }

    

    db = database.collection("patents");

    



    app.listen(port, () => {

        console.log("Magic is happening on port " + port);    

    });



});



var app = express();



app.use(bodyParser.json()); //use default json enconding/decoding

app.use(helmet()); //improve security





// GET a collection

app.get(BASE_API_PATH + "/patents", function (request, response) {

    console.log("INFO: New GET request to /patents");

    db.find({}).toArray( function (err, patents) {

        if (err) {

            console.error('WARNING: Error getting data from DB');

            response.sendStatus(500); // internal server error

        } else {

            console.log("INFO: Sending patents: " + JSON.stringify(patents, 2, null));

            response.send(patents);

        }

    });

});





// GET a single resource

app.get(BASE_API_PATH + "/patents/:patentId", function (request, response) {

    var patentId = request.params.patentId;

    if (!patentId) {

        console.log("WARNING: New GET request to /patents/:patentId without patentId, sending 400...");

        response.sendStatus(400); // bad request

    } else {

        console.log("INFO: New GET request to /patents/" + patentId);

         db.findOne({ "patentId": patentId }, (err, filteredPatent) => {

            if (err) {

                console.error('WARNING: Error getting data from DB');

                response.sendStatus(500);

            }

            else {

                if (filteredPatent) {

                    console.log("INFO: Sending patent: " + JSON.stringify(filteredPatent, 2, null));

                    response.send(filteredPatent);

                }

                else {

                    console.log("WARNING: There is not any patent with patentId " + patentId);

                    response.sendStatus(404);

                }

            }

        });

    }

});





//POST over a collection

app.post(BASE_API_PATH + "/patents", function (request, response) {

    var newPatent = request.body;

    if (!newPatent) {

        console.log("WARNING: New POST request to /patents/ without patent, sending 400...");

        response.sendStatus(400); // bad request

    } else {

        console.log("INFO: New POST request to /patents with body: " + JSON.stringify(newPatent, 2, null));

        if (!newPatent.title || !newPatent.date || !newPatent.inventors) {

            console.log("WARNING: The patent " + JSON.stringify(newPatent, 2, null) + " is not well-formed, sending 422...");

            response.sendStatus(422); // unprocessable entity

        } else {

            db.find({}, function (err, patents) {

                if (err) {

                    console.error('WARNING: Error getting data from DB');

                    response.sendStatus(500); // internal server error

                } else {

                    var patentsBeforeInsertion = patents.filter((patent) => {

                        return (patent.name.localeCompare(newPatent.name, "en", {'sensitivity': 'base'}) === 0);

                    });

                    if (patentsBeforeInsertion.length > 0) {

                        console.log("WARNING: The patent " + JSON.stringify(newPatent, 2, null) + " already extis, sending 409...");

                        response.sendStatus(409); // conflict

                    } else {

                        console.log("INFO: Adding patent " + JSON.stringify(newPatent, 2, null));

                        db.insert(newPatent);

                        response.sendStatus(201); // created

                    }

                }

            });

        }

    }

});





//POST over a single resource

app.post(BASE_API_PATH + "/patents/:patentId", function (request, response) {

    var patentId = request.params.patentId;

    console.log("WARNING: New POST request to /patents/" + patentId + ", sending 405...");

    response.sendStatus(405); // method not allowed

});





//PUT over a collection

app.put(BASE_API_PATH + "/patents", function (request, response) {

    console.log("WARNING: New PUT request to /patents, sending 405...");

    response.sendStatus(405); // method not allowed

});



// Estoy testeando a partir de aqui

//PUT over a single resource

app.put(BASE_API_PATH + "/patents/:patentId", function (request, response) {

    var updatedPatent = request.body;

    var patentId = request.params.patentId;

    if (!updatedPatent) {

        console.log("WARNING: New PUT request to /patents/ without contact, sending 400...");

        response.sendStatus(400); // bad request

    } else {

        console.log("INFO: New PUT request to /patents/" + patentId + " with data " + JSON.stringify(updatedPatent, 2, null));

        if (!updatedPatent.title || !updatedPatent.date || !updatedPatent.inventors) {

            console.log("WARNING: The contact " + JSON.stringify(updatedPatent, 2, null) + " is not well-formed, sending 422...");

            response.sendStatus(422); // unprocessable entity

        } else {

         db.findOne({ "patentId": patentId }, (err, filteredPatent) => {

            if (err) {

                console.error('WARNING: Error getting data from DB');

                response.sendStatus(500);

            }

            else {

                if (filteredPatent) {
                        db.update({"patentId": patentId}, updatedPatent);

                        console.log("INFO: Modifying patent with patentId " + patentId + " with data " + JSON.stringify(updatedPatent, 2, null));

                        response.send(updatedPatent); // return the updated patent
                }

                else {

                    console.log("WARNING: There is not any patent with patentId " + patentId);

                    response.sendStatus(404);

                }

            }

        });

        }

    }

});





//DELETE over a collection

app.delete(BASE_API_PATH + "/patents", function (request, response) {

    console.log("INFO: New DELETE request to /patents");

    db.remove({}, {multi: true}, function (err, numRemoved) {

        if (err) {

            console.error('WARNING: Error removing data from DB');

            response.sendStatus(500); // internal server error

        } else {

            if (numRemoved.result.n > 0) {

                console.log("INFO: All the patents (" + numRemoved.result.n + ") have been succesfully deleted, sending 204...");

                response.sendStatus(204); // no content

            } else {

                console.log("WARNING: There are no patents to delete");

                response.sendStatus(404); // not found

            }

        }

    });

});





//DELETE over a single resource

app.delete(BASE_API_PATH + "/patents/:patentId", function (request, response) {

    var patentId = request.params.patentId;

    if (!patentId) {

        console.log("WARNING: New DELETE request to /patents/:patentId without patentId, sending 400...");

        response.sendStatus(400); // bad request

    } else {

        console.log("INFO: New DELETE request to /patents/" + patentId);

        db.remove({patentId: patentId}, {}, function (err, numRemoved) {

            if (err) {

                console.error('WARNING: Error removing data from DB');

                response.sendStatus(500); // internal server error

            } else {

                console.log("INFO: Patents removed: " + numRemoved.result.n);

                if (numRemoved.result.n === 1) {

                    console.log("INFO: The patent with patentId " + patentId + " has been succesfully deleted, sending 204...");

                    response.sendStatus(204); // no content

                } else {

                    console.log("WARNING: There are no patents to delete");

                    response.sendStatus(404); // not found

                }

            }

        });

    }

});