var db = require("../models");

console.log("Line 3 Restaurant API Routes")

module.exports = function (app) {
    // GET route for getting all of the restaurants
    app.get("/api/rankRestaurants", (req, res) => {
        db.Restaurant.findAll({
            include: [
                {
                    model: db.Rating,
                    //required: true, //makes it an inner join rather than left outer which is default
                    attributes: [[db.sequelize.fn("AVG", db.sequelize.col("rating")), "avgRating"]]
                    //order: [["avgRating", "DESC"]]
                }
            ],
            attributes: [
                //[db.sequelize.fn('AVG', db.sequelize.col("Rating.rating")), "rating"],
                "Name",
                "Id"
            ],
            group: ["Name", "Id"],
            order: [[db.sequelize.fn('AVG', db.sequelize.col('rating')), 'DESC']], //confirm with Joe why this does not work
            raw: true,
            logging: console.log
        })
            //db.sequelize.query("select AVG(rating.rating)as rating, restaurant.id, Restaurant.Name AS name from rating inner join restaurant on rating.restaurantid = restaurant.id group by name, id order by rating desc",{type: db.sequelize.QueryTypes.SELECT})
            .then(function (result) {
                console.log(result);
                res.json(result); //uncomment when done testing and want to send to front-end
            }).catch(console.error);
    });

    app.get("/api/ratingSummary/:id", (req, res) => {
        var restaurantID = req.params.id;
        db.Restaurant.findAll({
            include: [
                {
                    model: db.Rating,
                    required: true,
                    attributes: [[db.sequelize.fn("COUNT", db.sequelize.col("rating")), "ratingCount"], "rating"]
                }
            ],
            attributes: ["name"],
            where: { id: restaurantID },
            group: ['name', 'rating'],
            //order: [[db.sequelize.col("rating"), "DESC"]],
            order: [[db.sequelize.fn('COUNT', db.sequelize.col('rating')), 'DESC']],
            raw: true,
            logging: console.log
        }).then(function (result) {
            console.log(result);
            res.json(result); //uncomment when done testing and want to send to front-end
        });
    });

    app.get("/api/search/:query", (req, res) => {
        var query = (req.params.query).toLowerCase();
        db.Restaurant.findAll({
            include: [
                {
                    model: db.Rating,
                    //required: true, //makes it an inner join rather than left outer which is default
                    attributes: [[db.sequelize.fn("AVG", db.sequelize.col("rating")), "avgRating"]]
                    //order: [["avgRating", "DESC"]]
                }
            ],
            attributes: [
                //[db.sequelize.fn('AVG', db.sequelize.col("Rating.rating")), "rating"],
                "Name",
                "Id"
            ],
            where: {
                [db.sequelize.Op.or]: [
                    {
                        name: {
                            [db.sequelize.Op.like]: '%' + query + '%'
                        }
                    },
                    {
                        category: {
                            [db.sequelize.Op.like]: '%' + query + '%'
                        }
                    }
                ]
            },
            group: ["Name", "Id"],
            order: [[db.sequelize.fn('AVG', db.sequelize.col('rating')), 'DESC']], //confirm with Joe why this does not work
            raw: true,
            logging: console.log
        })
            //db.sequelize.query("select restaurant.name, restaurant.id, restaurant.category, restaurant.address, avg(rating.rating ) as avgRating from rating inner join restaurant on rating.restaurantid = restaurant.id where restaurant.name like '%italian%' or restaurant.category like '%italian%' group by name, id, category, address order by avgRating desc;",{type: db.sequelize.QueryTypes.SELECT})
            .then(function (result) {
                console.log(result); //result[0].Restaurant.dataValues.{columnsOfTables}
                res.json(result); //uncomment when done testing and want to send to front-end
            });
    });

    app.post("/api/new/restaurant", (req, res) => {
        console.log(req.body)
        var name = req.body.newRestaurantName;
        var category = req.body.newRestaurantCategory;
        var address = req.body.newRestaurantAddress;

        db.Restaurant.create({
            name: name,
            category: category.toLowerCase(),
            address: address
        }).then(function (result) {
            console.log("Restaurant created \n");
            console.log(result);
            //result.Restaurant.dataValues.id
            res.json(result);
        });
    });

    app.get("/api/dev/restaurant", function (req, res) { //developer
        var query = {};
        //TODO: Not sure if we are just retrieving just the name object of restaurant or all objects, category and address. 
        if (req.query) {
            query.Name = req.query.name;
        }
        // Here we add an "include" property to our options in our findAll query
        // We set the value to an array of the models we want to include in a left outer join
        //TODO: Are we returning just restaurant & rating? Guessing we need user also in return. How do we do a JOIN with include to include two values, need to check documentation.
        db.Restaurant.findAll({

        }).then(function (dbRestaurant) {
            console.log("This is all restaurant information" + dbRestaurant);
            res.json(dbRestaurant);
        }).catch(function (err) {
            console.log(err)
        })
    });

    app.get("/api/getRestaurantInfo/:id", function (req, res) {

        //TODO: Not sure if we are just retrieving just the name object of restaurant or all objects, category and address. 

        // Here we add an "include" property to our options in our findAll query
        // We set the value to an array of the models we want to include in a left outer join
        //TODO: Are we returning just restaurant & rating? Guessing we need user also in return. How do we do a JOIN with include to include two values, need to check documentation.
        db.Restaurant.findAll({
            where: {
                id: req.params.id
            }

        }).then(function (dbRestaurant) {
            console.log("This is all restaurant information" + dbRestaurant);
            res.json(dbRestaurant);
        }).catch(function (err) {
            console.log(err)
        })
    });

    app.get("/api/getComments/:id", function (req, res) {
        db.Rating.findAll({
            where: {
                RestaurantId: req.params.id
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
    });

    // Get route for retrieving a single restaurant
    app.get("/api/dev/restaurant/:id", function (req, res) {
        // Here we add an "include" property to our options in our findOne query
        // We set the value to an array of the models we want to include in a left outer join
        //TODO: Looking for single restaurant should include the user and rating, need to resolve this, so the where property.

        db.Rating.findOne({
            where: {
                id: req.params.id
            },
            include: [db.Restaurant]
        }).then(function (dbRestaurant) {
            console.log("This is single restaurant" + dbRestaurant);
            res.json(dbRestaurant);

        })
    });

    // POST route for saving a new restaurant
    // app.post("/api/restaurant", function (req, res) {
    //     db.Restaurant.create(req.body).then(function (dbRestaurant) {
    //         res.json(dbRestaurant);
    //         console.log("New restaurant added" + dbRestaurant);
    //     });
    // });

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