$(document).ready(function () {
    var url = window.location.search;
    var id = url.split("=")[1];

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

    // Show selected restaurant detail
    $.get("/api/getRestaurantsInfo/" + id)
        .then(function (result) {
            var name = $("<h3>" + result[0].name + "</h3>");
            var category = $("<h4>" + result[0].category + "</h4>");
            var address = $("<h5>" + result[0].address + "</h5>");
            $(".restaurant_name").append(name);
            $(".restaurant_info").append(category).append(address);
        });

    // Submit comments
    $(".commentSubmitBtn").on("click", function () {
        var newCommentObj = {
            newCommentTitile: $("#comment_title").val().trim(),
            newCommentBody: $("#comment_body").val().trim()
        };
        $.post("/api/new/rating/" + id, newCommentObj)
            .then(function (err) {
                if (err) throw err;
            });
        $("#comment_title").val("");
        $("#comment_body").val("");
        location.reload();
    });

    // Get all comments for a restaurant
    $.get("/api/getomments/" + id)
        .then(function (result) {
            var comment = $("<ul class='row'>");
            var commentUser = $("<li> User Id: " + result.UserID + "</li>");
            var commentRating = $("<li><span id=star_'" + id + "'></span></li>");
            var commentBody = $("<li>" + result.body + "</li>");
            var commentTime = $("<li>" + result.createdAt.format("YYYY-MM-DD HH:mm") + "</li>");
            comment.append(commentUser).append(commentRating).append(commentBody).append(commentTime);
            $("#star_" + id).html(getStars(result.rating));
            $(".comment_area").append(comment);
        });

    // Rating summary
    $.get("/api/ratingSummary/" + id)
        .then(function (result) {
            for (var i = 5; i >= 0; i--) {
                $("#" + i + "_stars").html(getStars(i));
                for (var j = 0; j < result.length; j++) {
                    if (i === result[j]["Ratings.rating"]) {
                        $("#" + i + "_stars_counts").text("(" + result[j]["Ratings.ratingCount"] + ")")
                    }
                }
            }
        });
});
