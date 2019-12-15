var express = require('express');
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

const { Pool } = require("pg");
users = [];
connections = [];

const connectionString = process.env.DATABASE_URL || "postgres://uhzpoksdfjeast:13c2b6104d0fd3d0778bc95d96838684cf006f95b462886b3829821c8fb695d1@ec2-174-129-253-113.compute-1.amazonaws.com:5432/d796pog6c2c07u";
const pool = new Pool({connectionString: connectionString});

app.set("port", (process.env.PORT || 5000));

app.get('/', function(req, res){
    res.render("main.ejs");
});
app.get("/getPerson", getPerson)

app.listen(app.get("port"), function() {
    console.log("Now listening on port for connections on port: ", app.get("port"));
});

// Database querrying
function getPerson(req, response) {
    console.log("Getting person information.")

    var id = req.query.id;
    console.log("Retreiving person with id: ", id);

    getPersonFromDb(id, function(error, result){
        console.log("Back from the getPersonFromDb result: ", result);

        if (error || result == null || result.length != 1) {
            response.status(500).json({success:false, data: error});
        } else {
            response.json(result[0]);
        }

    });
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

// Chat functionality
io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log("Connection: %s sockets connected", connections.length);

    // Disconnect
    socket.on('disconnect', function(data){
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log("Disconnected: %s sockets disconnected", connections.length);
    });

    // send message
    socket.on('send message', function(data){
        io.sockets.emit("new message", {msg: data, user: socket.username});
    })

    // new user
    socket.on("new user", function(data, callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });

    function updateUsernames() {
        io.sockets.emit('get users', users);
    }
});
