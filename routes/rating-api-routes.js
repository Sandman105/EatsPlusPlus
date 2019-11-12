var db = require("../models");

console.log("Line 3 Rating API Routes");

module.exports = function (app) {

    app.post("/api/new/rating/:restaurantId", (req, res) => {
        //var userId = req.params.userId;
        var restId = req.params.restaurantId;

        db.Rating.create({
            RestaurantId: restId,
            UserId: req.body.newCommentId,
            body: req.body.newCommentBody,
            rating: req.body.newCommentRating
            //createdAt: db.sequelize.fn('NOW') //this might not work...fingers crossed
        }).then(function (result) {
            console.log("Rating created \n");
            console.log(result);
            return restId
        }).then(function (restaurantId) {
            db.Rating.findAll({
                where: {
                    RestaurantId: restaurantId
                },
                include: [db.Restaurant],
            }).then(function (dbRestaurantComment) {
                console.log("This is a single restaurant with all comments" + dbRestaurantComment);

                var comments = dbRestaurantComment.map(function (comment) {
                    return {
                        body: comment.body,
                        rating: comment.rating,
                        name: comment.Restaurant.name,
                        category: comment.Restaurant.category,
                        createdAt: comment.createdAt
                    }
                });
                console.log(dbRestaurantComment)
                res.json(comments);
            }).catch(function (err) {
                console.log(err)
            });
        })
    });

    app.get("/api/dev/rating", function (req, res) {
        // TODO: Not sure if i'm doing a join with db.User too to , need to follow-up with Group or TA's.
        db.Rating.findAll({ include: [db.Restaurant] }).then(function (dbRating) {
            res.json(dbRating);
        });
        console.log("These are the ratings" + dbRating);
    });


    app.get("/api/dev/rating/:id", function (req, res) {
        // Here we add an "include" property to our options in our findOne query
        // We set the value to an array of the models we want to include in a left outer join
        // In this case, just db.Rating.
        //TODO: Do we need to have a findOne rating?
        db.Rating.findAll({
            where: {
                id: req.params.id
            },
            include: [db.Restaurant]
        }).then(function (dbRating) {
            res.json(dbRating);
        });
        console.log("User rating" + dbRating);
    });
}