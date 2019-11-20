var express = require('express');
var app = express();

const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL || "postgres://uhzpoksdfjeast:13c2b6104d0fd3d0778bc95d96838684cf006f95b462886b3829821c8fb695d1@ec2-174-129-253-113.compute-1.amazonaws.com:5432/d796pog6c2c07u";
const pool = new Pool({connectionString: connectionString});

app.set("port", (process.env.PORT || 5000));

app.get("/getPerson", getPerson)

app.listen(app.get("port"), function() {
    console.log("Now listening on port for connections on port: ", app.get("port"));
});

function getPerson(req, response) {
    console.log("Getting person information.")

    var id = req.query.id;
    console.log("Retreiving person with id: ", id);

    getPersonFromDb(id, function(err, result){
        console.log("Back from the getPersonFromDb result: ", res);

        if (error || result == null || result.length != 1) {
            response.status(500).json({success:false, data: error});
        } else {
            response.json(result[0]);
        }

        
    })
};

function getPersonFromDb(id, callback) {
    console.log("getPersonFromDb called with id: ", id);

    var sql = "SELECT id, first, last, birthdate FROM persondb WHERE id = $1::int";
    var params = [id];

    pool.query(sql, params, function(err, res) {
        if (err) {
            console.log("An error with the DB occured");
            console.log(err);
            callback(err, null);
        }

        console.log("Found db result: " + JSON.stringify(res.rows));

        callback(null, res.rows);
    })
}