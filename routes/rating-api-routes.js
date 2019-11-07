var db = require("../models");

console.log("Line 3 Rating API Routes");

module.exports = function (app) {

    app.get("/api/rating", function (req, res) {
        // TODO: Not sure if i'm doing a join with db.User too to , need to follow-up with Group or TA's.
        db.Rating.findAll({ include: [db.Restaurant] }).then(function (dbRating) {
            res.json(dbRating);
        });
        console.log("These are the ratings" + dbRating);
    });


    app.get("/api/rating/:id", function (req, res) {
        // Here we add an "include" property to our options in our findOne query
        // We set the value to an array of the models we want to include in a left outer join
        // In this case, just db.Rating.
        //TODO: Do we need to have a findOne rating?
        db.Rating.findOne({
            where: {
                id: req.params.id
            },
            include: [db.Restaurant]
        }).then(function (dbRating) {
            res.json(dbRating);
        });
        console.log("User rating" + dbRating);
    });

    app.post("/api/rating", function (req, res) {
        db.Rating.create(req.body).then(function (dbRating) {
            res.json(dbRating);
        });
        console.log("New rating" + dbRating);
    });

    app.delete("/api/rating/:id", function (req, res) {
        db.Author.destroy({
            where: {
                id: req.params.id
            }
        }).then(function (dbRating) {
            res.json(dbRating);
        });
        console.log("Deleted rating" + dbRating);
    });

}