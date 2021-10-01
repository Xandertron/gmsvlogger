var gamedig = require("gamedig")
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('logs.db');

async function getInfo() {
    return new Promise((resolve, reject) => {
        gamedig.query({
            type: "garrysmod",
            host: "208.103.169.60"
        }).then((state) => {
            //console.log(state.raw.numplayers);
            resolve(state.raw.numplayers)
        }).catch((error) => {
            console.log("Server is offline @"+Date.now());
            resolve(0)
        });
    });
}

db.serialize(function () {
    db.run(`CREATE table IF NOT EXISTS playercount(
      count INT,
      time DATETIME DEFAULT CURRENT_TIMESTAMP
      );`);
      getInfo().then((res) => {db.run("INSERT INTO playercount VALUES (?,CURRENT_TIMESTAMP)", res)})
    setInterval(() => {
        getInfo().then((res) => {db.run("INSERT INTO playercount VALUES (?,CURRENT_TIMESTAMP)", res)})
    }, 15*60*1000);
});