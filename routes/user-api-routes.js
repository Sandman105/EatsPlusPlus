var db = require("../models");

module.exports = function(app) {

    // TODO: Still need to understand how this user route is going to work.
    app.get("/api/user", function (req, res) {
         
        db.User.findAll().then(function (dbUser) {
            res.json(dbUser);
        });
        console.log("These are the users" + dbUser);
    });


















    
}