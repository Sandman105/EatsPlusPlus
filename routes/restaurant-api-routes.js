var db = require("../models");

console.log("Line 3 Restaurant API Routes")

module.exports = function (app) {
    // GET route for getting all of the restaurants
    app.get("/api/restaurant", function (req, res) {
        var query = {};
        //TODO: Not sure if we are just retrieving just the name object of restaurant or all objects, category and address. 
        if (req.query.name) {
            query.Name = req.query.name;
        }
        // Here we add an "include" property to our options in our findAll query
        // We set the value to an array of the models we want to include in a left outer join
        //TODO: Are we returning just restaurant & rating? Guessing we need user also in return. How do we do a JOIN with include to include two values, need to check documentation.
        db.Restaurant.findAll({
            where: query,
            include: [db.Rating]
        }).then(function (dbRestaurant) {
            res.json(dbRestaurant);
        });
        console.log("This is all restaurants" + dbRestaurant);
    });

    // Get route for retrieving a single restaurant
    app.get("/api/restaurant/:id", function (req, res) {
        // Here we add an "include" property to our options in our findOne query
        // We set the value to an array of the models we want to include in a left outer join
        //TODO: Looking for single restaurant should include the user and rating, need to resolve this, so the where property.
        db.Restaurant.findOne({
            where: {
                id: req.params.id
            },
            include: [db.Rating]
        }).then(function (dbRestaurant) {
            res.json(dbRestaurant);
        });
        console.log("This is single restaurant" + dbRestaurant);
    });

    // POST route for saving a new restaurant
    app.post("/api/restaurant", function (req, res) {
        db.Restaurant.create(req.body).then(function (dbRestaurant) {
            res.json(dbRestaurant);
        });
        console.log("New restaurant added" + dbRestaurant);
    });

    // DELETE route for deleting restaurant
    //TODO: Are we going to be deleting restaurant information?
    //UPDATE: Commented out DELETE since we probably don't want user to be able to DELETE RESTAURANT.
   /*  app.delete("/api/restaurant/:id", function (req, res) {
        db.Restaurant.destroy({
            where: {
                id: req.params.id
            }
        }).then(function (dbRestaurant) {
            res.json(dbRestaurant);
        });
        console.log("Restaurant deleted" + dbRestaurant);
    }); */

    // PUT route for updating restaurant information
    //UPDATE: We don't really need a PUT here since we are using Places library, so RESTAURANT information wont need updating.
    /* app.put("/api/restaurant", function (req, res) {
        db.Restaurant.update(
            req.body,
            {
                //TODO: Need to review where property, is there another property needed inside.
                where: {
                    id: req.body.id
                }
            }).then(function (dbRestaurant) {
                res.json(dbRestaurant);
            });
            console.log("Restaurant updated" + dbRestaurant);
    }); */














}