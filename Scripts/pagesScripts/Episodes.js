$(document).ready(function () {
    $(window).load(function () {
        // Animate loader off screen
        $(".se-pre-con").fadeOut(2000);;

    });


    Current_TV = JSON.parse(sessionStorage.getItem("currentTV"))
    Current_Season = JSON.parse(sessionStorage.getItem("season"));
    episodes = JSON.parse(sessionStorage.getItem("episodes"));
    let str = "<div id='seasonDetails'> <h3>" + Current_TV.name + "</h3><h4> Season " + Current_Season + "</h4></div><div id='episodesList'>";

    for (let i = 0; i < episodes.length; i++) {
        str += "<div class='episodeCard row'><div class='col-4'><img class='chapterImg' src='" + checkPhotos(episodes[i].still_path) + "'/></div><div class='info col-8'><h3>" + episodes[i].name + "</h3><br><p> " + episodes[i].overview + "</p>";
        str += "<p><b>Air Date: </b>" + episodes[i].air_date + "</p> <button id='" + i + "' class='addEpisode heart'><i class='fa fa-heart'></i></button></div>"
        str += "</div>"
    }
    $("#episodes").html(str + "</div>");

    if (mode == "guest") {
        $(".addEpisode").hide();
    }

    $(document).on('click', '.addEpisode', postTV);

    $(document).on("click", ".heart", function () {
        $(this).removeClass("heart").addClass("red-heart");

    });
})

function postTV() {
    Current_ep = this.id;
    let TV = {
        Id: Current_TV.id,
        First_Air_Date: Current_TV.first_air_date,
        Name: Current_TV.name,
        Origin_Country: Current_TV.origin_country[0],
        Original_Language: Current_TV.original_language,
        Overview: Current_TV.overview,
        Popularity: Current_TV.popularity,
        Poster_Path: Current_TV.poster_path
    }
    ajaxCall("POST", "../api/Seriess", JSON.stringify(TV), postTVSuccessCB, postTVErrorCB)
    return false;
}

function postTVSuccessCB(num) {
    console.log("Post TV Success");
    postEpisode();
}

function postTVErrorCB(err) {
    console.log("Post TV Not working")
}

function postEpisode() {
    let ep = episodes[Current_ep];

    let episode = {
        Id: ep.id,
        SeriesName: Current_TV.name,
        Season: ep.season_number,
        EpisodeName: ep.name,
        ImageURL: ep.still_path,
        Overview: ep.overview,
        AirDate: ep.air_date
    }

    let api = "../api/Episodes?mail=" + user.Mail;
    ajaxCall("POST", api, JSON.stringify(episode), postEpisodeSuccessCB, postEpisodeErrorCB)
}

function postEpisodeSuccessCB(numInserted) {
    successAlert("Added successfully!");
}

function postEpisodeErrorCB(err) {
    console.log("Error");
}
