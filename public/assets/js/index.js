$(document).ready(function() {

    // Populate add-restaurant form
    $(".add_restaurant").on("click", function(){
        $(".form-area").attr("style","display:block");
    });

    // Places API keys
    var placesAutocomplete = places({
        appId: "pl6X6RH9K3GT",
        apiKey: "b15db3b8c1d929ba373ff9b85a784dd1",
        container: document.querySelector("#restaurant_address")
    });

    // Submit new restaurant information
    $(document.body).on("click", ".submitBtn", function(){
        event.preventDefault();
        var newRestaurantOjb = {
            newRestaurantName: $("#restaurant_name").val().trim(),
            newRestaurantCategory: $("#restaurant_category").val().trim(),
            newRestaurantAddress: $("#restaurant_address").val().trim()
        }
        $("#restaurant_name").val("");
        $("#restaurant_category").val("");
        $("#restaurant_address").val("");
        $.post("/api/add_restaurant", newRestaurantOjb)
        .then(function(err){
            if (err) throw err;
        });
        $(".form-area").attr("style","display:none");
        location.reload();
    });

    // Populate searchbar
    $(".search_btn").on("click", function(){
        var status = $(".searchbar").attr("style");
        if (status === "display:none") {
            $(".searchbar").attr("style","display:block");
        }
        else {
            $(".searchbar").attr("style","display:none");
        }
    });

    // Download a restaurant list from database
    function getList() {
        var searchName;
        $.get("api/restaurants", searchName)
        .then(function(result){
            $(".restaurant_list").empty();
            for (var i=0; i<result.length; i++){
                var tableRow = $("<tr class='each_restaurant' href='/restaurant?id=" + result[i].id + "' data-id=" + result[i].id + ">");
                var tableDataId = $("<td>" + i + "</td>");
                var tableDataName = $("<td>" + result[i].name + "</td>");
                var tableDataRating = $("<td>" + result[i].rating + "</td>");
                tableRow.append(tableDataId).append(tableDataName).appen(tableDataRating);
                $(".restaurant_list").append(tableRow);
            }
        });
    };

    // Use big search icon to submit get restaurant list
    $(".begin_searchbar_btn").on("click", function(){
        searchName = $(".begin_searchbar").val().trim();
        getList();
        $(".begin_search").attr("style","display:none");
        $(".list-display").attr("style","display:block");

    });

    // Use small search icon to submit get restaurant list
    $(document.body).on("click", ".searchbar_btn", function(){
        searchName = $(".searchbar").val().trim();
        getList();
        $(".searchbar").attr("style","display:none");
        $(".list-display").attr("style","display:block");
        location.reload();
    });
});