$(document).ready(function() {

    // Selected restaurant detail
    var url = window.location.search;
    var id = url.split("=")[1];
    $.get("/api/restaurants?id=" + id)
    .then(function(oneRestaurantData){
        var name = $("<h3>" + oneRestaurantData.name + "</h3>");
        var category = $("<h4>" + oneRestaurantData.category +"</h4>");
        var address = $("<h5>" + oneRestaurantData.address +"</h5>");
        $(".restaurant_name").append(name);
        $(".restaurant_info").append(category).append(address);
    });
    
    // Submit comments
    $(".commentSubmitBtn").on("click", function(){
        var newCommentObj = {
            newCommentTitile: $("#comment_title").val().trim(), 
            newCommentBody: $("#comment_body").val().trim()
        };
        $.post("/api/restaurants/comments", newCommentObj)
        .then(function(err){
            if (err) throw err;
        });
        $("#comment_title").val("");
        $("#comment_body").val("");
        location.reload();
    });

    // Prepare stars function
    function getStars(rating){
        rating = Math.round(rating * 2) / 2;
        let output = [];
        for (var i = rating; i >= 1; i--) 
        output.push('<i class="fa fa-star" aria-hidden="true" style="color: gold;"></i>&nbsp;');
        if (i == .5) output.push('<i class="fa fa-star-half-o" aria-hidden="true" style="color: gold;"></i>&nbsp;');
        for (let i = (5 - rating); i >= 1; i--)
        output.push('<i class="fa fa-star-o" aria-hidden="true" style="color: gold;"></i>&nbsp;');
        return output.join('');
    };

    // Get all comments for a restaurant
    $.get("/api/comments?id=" + id)
    .then(function(oneRestaurantResult){
        var comment = $("<ul class='row'>");
        var commentUser = $("<li> User Id: " + oneRestaurantResult.userid + "</li>");
        var commentRating = $("<li>Rating: <span id=star_'" + i + "'></span> " + oneRestaurantResult.rating + "</li>");
        var commentBody = $("<li>" + oneRestaurantResult.body + "</li>");
        var commentDate = $("<li>" + oneRestaurantResult.date + "</li>");
        comment.append(commentUser).append(commentRating).append(commentBody).append(commentDate);
        $("#star_" + i).html(getStars(oneRestaurantResult.rating));
        $(".comment_area").append(comment);
    });

    // Rating summary
    $.get("/api/rating?id=" + id)
    .then(function(oneRestaurantRating){
        for (var i = 0; i <= 5; i++){
            $("#" + i + "_stars").html(getStars(i));
            $("#" + i + "_stars_counts").text("(" + oneRestaurantRating.ratingCount[i] + ")")
        }
    })
    for (var i = 0; i <= 5; i++){
        $("#" + i + "_stars").html(getStars(i));

    }
});
