

$(document).ready(function () {

    $(window).load(function () {
        // Animate loader off screen
        $(".se-pre-con").fadeOut(2000);;

    });
    
    imagePath = "https://image.tmdb.org/t/p/w500/";
    
    getTVNames();
    getMovies();


    $(".favoriteButton").click(function () {
        if ($(this).css("background-color") != "rgb(0, 255, 255)")
            toggleFavorites();
    });

    $(document).on('click','.showEpisodes',getEpisodes);

    $(document).on('click', '.movie', function () {
        sessionStorage.setItem("mediaChoose", JSON.stringify({ id: this.id, type: 'movie' }))
        window.location.href = 'index.html';
    });
})


// Get liked series from Seriess api --> by user mail  + Callbacks
function getTVNames() {
    let api = "../api/Seriess?mail=" + user.Mail +"&mode=Favorites";
    ajaxCall("GET", api, "", getTVNamesSuccessCB, getTVNamesErrorCB);
}

function getTVNamesSuccessCB(series) {
    console.log(series)
    let str = "";
    for (let i = 0; i < series.length; i++) {
        str += "<li data-id=" + series[i].Id + " class='card showEpisodes'> <span id='seriesName' hidden>" + series[i].Name +"</span><img class='card-img-top' src='"+imagePath + series[i].Poster_Path+"'/></li>";
    }
    $("#tvShowsPic").html(str);
    favoriteMode = "tv";
    $("#showTvFavorites").css("background-color", "aqua");
    $("#favoritesMovies").hide();
}

function getTVNamesErrorCB() {
    console.log("Error");
}


// Get liked movies from Movies api --> by user mail  + Callbacks
function getMovies() {
    let api = "../api/Movies?mail=" + user.Mail + "&mode=Favorites";
    ajaxCall("GET", api, "", getMovieSuccessCB, getMovieErrorCB);
}

function getMovieSuccessCB(movies) {
    console.log(movies)
    let str = "";
    if (movies.length == 0)
        $("#favoritesMovies").html("<h3>No movie results found!</h3>");
    else {
        for (let i = 0; i < movies.length; i++) {
            str += "<div id="+movies[i].Id+" class='row result movie' style='background:url(" + checkPhotos(movies[i].Backdrop_Path) + "); background-size:cover; background-repeat:no-repeat'><div class='resultText row'>"
            description = "<div class='col-8'><h3>" + movies[i].Title + "</h3><p><b>Air Date: </b>" + movies[i].Release_Date + "</p><h5>" + movies[i].Tagline + "</h5><p> " + movies[i].Overview + "</p></div>"
            str += description + "</div></div>"
        }
        $("#favoritesMovies").html(str)

    }
}

function getMovieErrorCB(err) {
    console.log(err);
}


// On list index change - Gets the current series episodes that the user liked  + Callbacks
function getEpisodes() {
    $(".showEpisodes").removeClass("chosen");
    $(this).addClass("chosen");
        $("#tvName").html($(this).children()[0].innerText);
    let api = "../api/Episodes?seriesID=" + $(this).attr("data-id") + "&mail=" + user.Mail;
    ajaxCall("GET", api, "", getEpisodesSuccessCB, getEpisodesErrorCB);


}

function getEpisodesSuccessCB(episodes) {
    let str = "";
    for (let i = 0; i < episodes.length; i++) {
        str += "<div class='row result'><div class='row resultText episode'><div class='col-4'><img src='" + checkPhotos(episodes[i].ImageURL) + "'/></div><div class='col-8'><h3>" + episodes[i].EpisodeName + "</h3><br><p> " + episodes[i].Overview + "</p>";
        str += "<p><b>Air Date: </b>" + episodes[i].AirDate + "</p></div></div>"
        str += "</div>"
    }
    $("#seriesEpisodes").html(str)
}

function getEpisodesErrorCB() {
    console.log("Error");
}


// Toggles the two modes --> favorites tv shows / favorite movies
function toggleFavorites() {
    if (favoriteMode == "tv") {
        $("#favoritesMovies").show();
        $("#favoritesTv").hide();
        $("#showTvFavorites").css("background-color", "white");
        $("#showMovieFavorites").css("background-color", "aqua");
        favoriteMode = "movie";
    }
    else {
        $("#favoritesTv").show();
        $("#favoritesMovies").hide();
        $("#showMovieFavorites").css("background-color", "white");
        $("#showTvFavorites").css("background-color", "aqua");
        favoriteMode = "tv";
    }
}
