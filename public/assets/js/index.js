$(".add_restaurant").on("click", function(){
    $(".form-area").attr("style","display:block");
});

var placesAutocomplete = places({
    appId: "pl6X6RH9K3GT",
    apiKey: "b15db3b8c1d929ba373ff9b85a784dd1",
    container: document.querySelector("#restaurant_address")
});

$(document.body).on("click", ".submitBtn", function(){
    event.preventDefault();
    var newOjb = {
        newRestaurantName: $("#restaurant_name").val().trim(),
        newRestaurantNumber: $("#restaurant_phone_number").val().trim(),
        newRestaurantAddress: $("#restaurant_address").val().trim()
    }
    $(".form-area").attr("style","display:none");
});

$(".search_btn").on("click", function(){
    var status = $(".searchbar").attr("style");
    if (status === "display:none") {
        $(".searchbar").attr("style","display:block");
    }
    else {
        $(".searchbar").attr("style","display:none");
    }
});

function getList() {
    var searchName;
    $.get("api/restaurants", searchName, function(result){
        $(".restaurant_list").empty();
        for (var i=0; i<result.length; i++){
            var tableRow = $("<tr class='each_restaurant' href='/restaurant' data-id=" + result[i].id + ">");
            var tableDataId = $("<td>" + result[i].id + "</td>");
            var tableDataName = $("<td>" + result[i].name + "</td>");
            var tableDataRating = $("<td>" + result[i].rating + "</td>");
            tableRow.append(tableDataId).append(tableDataName).appen(tableDataRating);
            $(".restaurant_list").append(tableRow);
        }
    });
};

$(".begin_searchbar_btn").on("click", function(){
    searchName = $(".begin_searchbar").val().trim();
    getList();
    $(".begin_search").attr("style","display:none");
    $(".list-display").attr("style","display:block");

});

$(document.body).on("click", ".searchbar_btn", function(){
    searchName = $(".searchbar").val().trim();
    getList();
    $(".searchbar").attr("style","display:none");
});

$(document.body).on("clock", ".each_restaurant", function(){
    event.preventDefault();
    var id = $(this).data("id");
});