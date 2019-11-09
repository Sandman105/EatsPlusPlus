// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");

module.exports = function (app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function (req, res) { //"local" refers to the login info being passed in from html form
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    res.json("/index"); //res.json("/members");
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function (req, res) {
    console.log(req.body);
    db.User.create({
      email: req.body.email,
      password: req.body.password
    }).then(function () {
      res.redirect(307, "/api/login");
    }).catch(function (err) {
      console.log(err);
      res.json(err);
      // res.status(422).json(err.errors[0].message);
    });
  });

  app.get("/api/rankRestaurants", (req, res) => {
    db.Restaurant.findAll({
      include: [
        {
          model: db.Rating,
          required: true, //makes it an inner join rather than left outer which is default
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
      raw: true
    })
      //db.sequelize.query("select AVG(rating.rating)as rating, restaurant.id, Restaurant.Name AS name from rating inner join restaurant on rating.restaurantid = restaurant.id group by name, id order by rating desc",{type: db.sequelize.QueryTypes.SELECT})
      .then(function (result) {
        console.log(result);
        //res.json(result); //uncomment when done testing and want to send to front-end
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
      raw: true
    }).then(function (result) {
      console.log(result);
      //res.json(result); //uncomment when done testing and want to send to front-end
    });
  });

  app.get("/api/search/:query", (req, res) => {
    var query = req.params.query;
    db.Restaurant.findAll({
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
      }
    })
    //db.sequelize.query("select restaurant.name, restaurant.id, restaurant.category, restaurant.address, avg(rating.rating ) as avgRating from rating inner join restaurant on rating.restaurantid = restaurant.id where restaurant.name like '%italian%' or restaurant.category like '%italian%' group by name, id, category, address order by avgRating desc;",{type: db.sequelize.QueryTypes.SELECT})
    .then(function (result) {
      console.log(result); //result[0].Restaurant.dataValues.{columnsOfTables}
      res.json(result); //uncomment when done testing and want to send to front-end
    });
  });

  //app.get("/api/getRestaurantInfo/:id"); //finish this pls

  app.post("/api/new/restaurant", (req, res) => {
    console.log(req.body)
    var name = req.body.newRestaurantName;
    var category = req.body.newRestaurantCategory;
    var address = req.body.newRestaurantAddress;

    db.Restaurant.create({
      name: name,
      category: category,
      address: address
    }).then(function (result) {
      console.log("Restaurant created \n");
      console.log(result);
      res.json(result);
    });
  });

  app.post("/api/new/rating/:userId/:restaurantId/", (req, res) => {
    var userId = req.params.userId;
    var restId = req.params.restaurantId;

    db.Rating.create({
      RestaurantId: restId,
      UserId: userId,
      body: req.body.body,
      rating: req.body.rating
      //createdAt: db.sequelize.fn('NOW') //this might not work...fingers crossed
    }).then(function (result) {
      console.log("Restaurant created \n");
      console.log(result);
    });
  });

  // Route for logging user out
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function (req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    }
    else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

};
