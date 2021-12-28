var creditMode = "";


$(document).ready(function () {
    $(window).load(function () {
        // Animate loader off screen
        $(".se-pre-con").fadeOut("slow");;
    });
    getActor();

    $(".knownButton").click(function () {
        if ($(this).css("background-color") != "rgb(0, 255, 255)")
            toggleCredits();
    });

    //move to requested page.
    $(document).on("click", ".tv", function () {
        let method = {
            id: this.id,
            type: "tv"
        }
        sessionStorage.setItem("mediaChoose", JSON.stringify(method));
        window.location.href = "index.html";
    });
    $(document).on("click", ".movie", function () {
        let method = {
            id: this.id,
            type: "movie"
        }
        sessionStorage.setItem("mediaChoose", JSON.stringify(method));
        window.location.href = "index.html";
    });
})


function getActor() {
    personId = JSON.parse(sessionStorage.getItem("personId"));
    method = "3/person/" + personId;
    api_key = "api_key=" + key;
    let apiCall = url + method + "?" + api_key;
    ajaxCall("GET", apiCall, "", getActorSuccessCB, getActorErrorCB);
}
function getActorSuccessCB(actor) {
    console.log(actor)
    renderActor(actor);
    getPhotos(actor);
    if (actor.known_for_department == "Acting") {
        getActorTvCredits();
        getActorMovieCredits();
    }
    else
        $("#known_from").hide();
    if (actor.place_of_birth != null)
        getMap(actor.place_of_birth);
}
function getActorErrorCB(err) {
    console.log(err);
}

//Render Actor details.
function renderActor(actor) {

    imageSrc = "<img src='" + checkPhotos(actor.profile_path) + "'>";

    getActorLinks();
    var gender = "";
    if (actor.gender == '1')
        gender = "Female";
    else if (actor.gender == '2')
        gender = "Male";

    let strInfo = "<p>Known for: " + actor.known_for_department + "</p><p>Gender: " + gender + "</p><p> Birthday: " + actor.birthday + "</p><p>Place of birth: " + actor.place_of_birth + "</p><p>Popularity: " + actor.popularity + "%</p>";
    var death = "";
    if (actor.deathday != null) {
        death = actor.deathday;
        strInfo += "<p>Date of death: " + death + "</p>";
    }

    strName = "<h1>" + actor.name + "</h1><br>";
    let strImg = imageSrc;
    $("#actorImg").append(strImg);
    actorBio = "<p>" + actor.biography + "</p>";
    $("#leftDetails").html(strInfo)
    $("#info").html(strName + actorBio);

}

function getPhotos(actor) {
    let apiCall = url + method + "/images?" + api_key;
    ajaxCall("GET", apiCall, "", getPhotosSuccessCB, getPhotosErrorCB);
}
function getPhotosSuccessCB(photos) {
    console.log(photos.profiles);
    photosArr = photos.profiles;
    if (photosArr.length == 0)
        $("#photos").hide();
    else {
        let str = "";
        for (let i = 0; i < photosArr.length; i++) {
            str += "<li class = 'card'><img class='card-img-top' src='" + checkPhotos(photosArr[i].file_path) + "'></li>";
        }
        $("#photosList").html(str);
    }
}

function getPhotosErrorCB(err) {
    console.log(err);
}
//toggle by credit type
function toggleCredits() {
    if (creditMode == "tv") {
        $("#knownMovieList").show();
        $("#knownTVList").hide();
        $("#tvButton").css("background-color", "white");
        $("#movieButton").css("background-color", "aqua");
        creditMode = "movie";
    }
    else {
        $("#knownTVList").show();
        $("#knownMovieList").hide();
        $("#movieButton").css("background-color", "white");
        $("#tvButton").css("background-color", "aqua");
        creditMode = "tv";
    }
}


//get Actor TV Known from, from TMDB
function getActorTvCredits() {
    let apiCall = url + method + "/tv_credits?" + api_key;
    ajaxCall("GET", apiCall, "", getActorTvCreditsSuccessCB, getActorTvCreditsErrorCB);
}
function getActorTvCreditsSuccessCB(tv) {
    console.log(tv);
    castingArr = tv.cast;
    $("#tvButton").css("background-color", "aqua");
    creditMode = "tv";
    if (castingArr == null) {
        toggleCredits();
        $("#tvButton").attr("disabled", true);
    }
    else {
        let str = "";
        for (let i = 0; i < castingArr.length; i++) {
            str += "<li id = '" + castingArr[i].id + "'class = 'card tv'>";
            imageTv = "<img class='card-img-top' src='" + checkPhotos(castingArr[i].poster_path) + "'>";
            cardBody = "<div class='card-body'><h6>" + castingArr[i].name + "</h6> <p class='card-text'>" + castingArr[i].character + "</p></div>";
            str += imageTv + "<div class='goToPage'>Go to page" + cardBody + "</div></li> ";
        }
        $("#anyTvKnown").html(str);
        $("#knownMovieList").hide();
    }
}
function getActorTvCreditsErrorCB(err) {
    console.log(err);
}

//get Actor Movie Known from, from TMDB
function getActorMovieCredits() {
    let apiCall = url + method + "/movie_credits?" + api_key;
    ajaxCall("GET", apiCall, "", getActorMovieCreditsSuccessCB, getActorMovieCreditsErrorCB);
}
function getActorMovieCreditsSuccessCB(movie) {
    console.log(movie);
    castingArr = movie.cast;
    if (castingArr == null) {
        $("#movieButton").attr("disabled", true);
    }
    else {
        let str = "";
        for (let i = 0; i < castingArr.length; i++) {
            str += "<li id = '" + castingArr[i].id + "'class = 'card movie'>";
            imageTv = "<img class='card-img-top' src='" + checkPhotos(castingArr[i].poster_path) + "'>";
            cardBody = "<div class='card-body'><h6>" + castingArr[i].title + "</h6> <p class='card-text'>" + castingArr[i].character + "</p></div>";
            str += imageTv + "<div class='goToPage'>Go to page" + cardBody + "</div></li> ";
        }
        $("#anyMovieKnown").html(str);


    }
}
function getActorMovieCreditsErrorCB(err) {
    console.log(err);
}

//Get actor external links (Facebook,twitter,Instagram)
function getActorLinks() {
    let apiCall = url + method + "/external_ids?" + api_key;
    ajaxCall("GET", apiCall, "", getLinksSuccessCB, getLinksErrorCB);
}
function getLinksSuccessCB(links) {
    let strLink = "";
    if (links.facebook_id != null)
        strLink += "<a class='linkIcons' href= 'https://www.facebook.com/" + links.facebook_id + "/'><i class='fa fa-facebook'></i></a>";
    if (links.instagram_id != null)
        strLink += "<a class='linkIcons' href= 'https://www.instagram.com/" + links.instagram_id + "/'><i class='fa fa-instagram'></i> </a>";
    if (links.twitter_id != null)
        strLink += "<a class='linkIcons' href= 'https://www.twitter.com/" + links.twitter_id + "/'><i class='fa fa-twitter'></i></a>";
    $("#externalLinks").html(strLink);
}
function getLinksErrorCB(err) {
    console.log(err);
}

//Use axios library for get location details, and then call render function map for location coordinates. 
function getMap(place) {
    axios.get("https://maps.googleapis.com/maps/api/geocode/json?", {
        params: {
            address: place,
            key: "AIzaSyBqizvDTzKr_SVdhfsKIcrDZPxdbPPA8ag"
        }
    })
        .then(response => {
            initMap(response.data.results[0].geometry.location);
        })
        .catch(error => {
            console.log(error);
        })
}
function initMap(location) {
    var latlng = {
        lat: location.lat,
        lng: location.lng
    }; //get location coordinates.
    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 8,
        center: latlng
    });//initiate map in html div
    var marker = new google.maps.Marker({
        position: latlng,
        map: map
    });//put a marker location in the map.
}
