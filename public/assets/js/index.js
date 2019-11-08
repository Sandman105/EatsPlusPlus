$(document).ready(function () {

    // Prepare stars function
    function getStars(rating) {
        rating = Math.round(rating * 2) / 2;
        let output = [];
        for (var i = rating; i >= 1; i--)
            output.push('<i class="fa fa-star" aria-hidden="true" style="color: gold;"></i>&nbsp;');
        if (i == .5) output.push('<i class="fa fa-star-half-o" aria-hidden="true" style="color: gold;"></i>&nbsp;');
        for (let i = (5 - rating); i >= 1; i--)
            output.push('<i class="fa fa-star-o" aria-hidden="true" style="color: gold;"></i>&nbsp;');
        return output.join('');
    };

    // Download a list of all restaurants from database
    $.get("/api/rankRestaurant")
        .then(function (result) {
            $(".restaurant_list").empty();
            for (var i = 0; i < result.length; i++) {
                var tableRow = $("<tr class='each_restaurant' data-id=" + result[i].Id + ">");
                var tableDataRank = $("<td>" + i + "</td>");
                var tableDataName = $("<td>" + result[i].Name + "</td>");
                var tableDataRating = $("<td><span id=star_'" + result[i].Id + "'></span></td>");
                $("#star_" + result[i].Id).html(getStars(result[i]["Rating.avgRating"]));
                tableRow.append(tableDataRank).append(tableDataName).appen(tableDataRating);
                $(".restaurant_list").append(tableRow);
            }
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
        $(".restaurant_list").empty();
        location.reload();
        var searchCategory = $(".search_text").val().trim();
        $.get("/api/search/" + searchCategory)
            .then(function (result) {
                for (var i = 0; i < result.length; i++) {
                    var tableRow = $("<tr class='each_restaurant' data-id=" + result[i].id + ">");
                    var tableDataRank = $("<td>" + i + "</td>");
                    var tableDataName = $("<td>" + result[i].name + "</td>");
                    var tableDataRating = $("<td><span id=star_'" + result[i].id + "'></span></td>");
                    $("#star_" + result[i].id).html(getStars(result[i].avgRating));
                    tableRow.append(tableDataRank).append(tableDataName).appen(tableDataRating);
                    $(".restaurant_list").append(tableRow);
                }
            });
        $(".searchbar").attr("style", "display:none");
        window.location.href = "/category_search?" + searchCategory;
    });

    $(document.body).on("click",".each_restaurant", function(){
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
            newRestaurantCategory: $("#restaurant_category").val().trim(),
            newRestaurantAddress: $("#restaurant_address").val().trim()
        }
        $("#restaurant_name").val("");
        $("#restaurant_category").val("");
        $("#restaurant_address").val("");
        $.post("/api/new/restaurant", newRestaurantOjb)
            .then(function (err) {
                if (err) throw err;
            });
        $(".form-area").attr("style", "display:none");
    });
});