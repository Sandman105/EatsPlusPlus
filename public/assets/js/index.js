$(document).ready(function () {

    // Prepare stars function
    function getStars(rating) {
        if (!isNaN(rating)) {
            rating = Math.round(rating * 2) / 2;
            let output = [];
            for (var i = rating; i >= 1; i--) {
                output.push('<i class="fa fa-star" aria-hidden="true" style="color: gold;"></i>&nbsp;');
            }
            if (i == .5) output.push('<i class="fa fa-star-half-o" aria-hidden="true" style="color: gold;"></i>&nbsp;');
            for (let i = (5 - rating); i >= 1; i--) {
                output.push('<i class="fa fa-star-o" aria-hidden="true" style="color: gold;"></i>&nbsp;');
            }
            return output.join('');
        }
        else {
            return ("New Restaurant! No Reviews yet!");
        }
    };

    function getRestaurantList(result) {
        for (var i = 0; i < result.length; i++) {
            var tableRow = $("<tr class='each_restaurant' data-id=" + result[i].Id + ">");
            var tableRank = i + 1;
            var tableDataRank = $("<td>" + tableRank + "</td>");
            var tableDataName = $("<td>" + result[i].Name + "</td>");
            var RatingNum = parseFloat(result[i]["Ratings.avgRating"]).toFixed(2);
            console.log(RatingNum);
            console.log(typeof (RatingNum));
            var tableDataRating = $("<td>");
            var tableDataRatingStar = $("<span class='rating_star'>").html(getStars(RatingNum));
            var tableDataRatingNum = $("<span class='rating_text'> (" + RatingNum + ")</span>");
            tableDataRatingStar.append(tableDataRatingNum);
            tableDataRating.append(tableDataRatingStar);
            tableRow.append(tableDataRank).append(tableDataName).append(tableDataRating);
            $(".restaurant_list").append(tableRow);
        }
    }

    // Download a list of all restaurants from database
    $.get("/api/rankRestaurants")
        .then(function (result) {
            $(".restaurant_list").empty();
            getRestaurantList(result);
        });

    // Populate searchbar
    $(".search_btn").on("click", function () {
        var status = $(".searchbar").attr("style");
        if (status === "display:none") {
            $(".searchbar").attr("style", "display:block");
        }
        else {
            $(".searchbar").attr("style", "display:none");
        }
    });

    // ------------- Big searchbar function -------------
    // // Use big search icon to submit get restaurant list
    // $(".begin_searchbar_btn").on("click", function(){
    //     searchName = $(".begin_searchbar").val().trim();
    //     getList();
    //     $(".begin_search").attr("style","display:none");
    // });
    // ------------- Big searchbar function -------------

    // Use small search icon to submit get restaurant list in specific category
    $(document.body).on("click", ".searchbar_btn", function () {
        event.preventDefault();
        var searchCategory = $(".search_text").val().toLowerCase().trim();
        // window.location.href = "/search?" + searchCategory;
        $(".restaurant_list").empty();
        $.get("/api/search/" + searchCategory)
            .then(function (result) {
                if (result.length === 0) {
                    alert("No restaurant found!");
                    location.reload();
                } else {
                    console.log(result);
                    getRestaurantList(result);
                }
            });
        $(".search_text").val("");
        $(".searchbar").attr("style", "display:none");
    });

    // Restaurant click
    $(document.body).on("click", ".each_restaurant", function () {
        console.log(true);
        var selectedRestaurantId = $(this).data("id");
        window.location.href = "/restaurant?id=" + selectedRestaurantId;
    })

    // Populate add-restaurant form
    $(".add_restaurant").on("click", function () {
        $(".form-area").attr("style", "display:block");
    });

    // Places API keys
    var placesAutocomplete = places({
        appId: "pl6X6RH9K3GT",
        apiKey: "b15db3b8c1d929ba373ff9b85a784dd1",
        container: document.querySelector("#restaurant_address")
    });

    // Submit new restaurant information
    $(document.body).on("click", ".submitBtn", function () {
        event.preventDefault();
        var newRestaurantOjb = {
            newRestaurantName: $("#restaurant_name").val().trim(),
            newRestaurantCategory: $("#restaurant_category").val().toLowerCase().trim(),
            newRestaurantAddress: $("#restaurant_address").val().trim()
        }
        $.post("/api/new/restaurant", newRestaurantOjb)
            .then(function (result) {
                console.log(result);
                location.reload(true);
            });
        $(".form-area").attr("style", "display:none");
        $("#restaurant_name").val("");
        $("#restaurant_category").val("");
        $("#restaurant_address").val("");
    });

    $(document.body).on("click", ".cancelBtn", function () {
        event.preventDefault();
        $("#restaurant_name").val("");
        $("#restaurant_category").val("");
        $("#restaurant_address").val("");
        $(".form-area").attr("style", "display:none");
    })
});