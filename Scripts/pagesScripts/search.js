
$(document).ready(function () {

    $(window).load(function () {
        // Animate loader off screen
        $(".se-pre-con").fadeOut(2000);;

    })

    searchVal = sessionStorage.getItem("searchValue");
    $("#resultHeader").html("Result for: '" + searchVal + "'");
    getTv();

    //Get each requested search (TVShows/Movies/People). each call separetally according to request for quicker load.
    $(".buttonType").click(function () { changeType(this.id) });


    $(document).on("click", ".result", function () {
        if (this.getAttribute('data-mediatype') == "person") {
            sessionStorage.setItem("personId", JSON.stringify(this.id));
            window.location.href = "actor.html";
        }
        else {
            let method = {
                id: this.id,
                type: this.getAttribute('data-mediatype')
            }
            sessionStorage.setItem("mediaChoose", JSON.stringify(method));
            window.location.href = "index.html";
        }
	})

});


// Build apicall including search value and the search type --> person/tv/movie
function getType(type) {
    let method = "3/search/"+type+"?"
    let query = "query=" + encodeURIComponent(searchVal);
    let moreParams = "&language=en-US&include_adult=false&";
    return url + method + api_key + moreParams + query;
}


// Get tv shows by search value + Callbacks
function getTv() {
    let apiCall = getType("tv");
    ajaxCall("GET", apiCall, "", getTVSuccessCB, getErrorCB);
}

function getTVSuccessCB(tv) {
    console.log(tv);
    renderSearchTv(tv);
}


// Get movies by search value + Callbacks
function getMovies() {
    let apiCall = getType("movie");
    ajaxCall("GET", apiCall, "", getMoviesSuccessCB, getErrorCB);
}

function getMoviesSuccessCB(movie) {
    console.log(movie);
    renderSearchMovie(movie);
}


// Get persons by search value + Callbacks
function getPersons() {
    let apiCall = getType("person");
    ajaxCall("GET", apiCall, "", getPersonsSuccessCB, getErrorCB);
}

function getPersonsSuccessCB(person) {
    console.log(person);
    renderSearchPerson(person);
}


//Render Each Div by requested option
function renderSearchPerson(person) {
    let str = "";
    let personArr = person.results;
    if (personArr.length == 0)
        $("#results").html("<h3>No person results found!");
    else {
        for (let i = 0; i < personArr.length; i++) {
            str += "<div id='" + personArr[i].id + "' class='row result person' data-mediatype='person'><div class='resultText row'><div class='col-4'>";
            name = personArr[i].name;
            imageSrc = checkPhotos(personArr[i].profile_path);
            image = "<img class='imgResult' src = '" + imageSrc + "'/></div>";
            description = "<div class='col-8'><h3>" + name + "</h3><p>" + personArr[i].known_for_department + "</p></div>";
            str += image + description + "</div></div>";
        }
        $("#results").html(str);
    }
}

function renderSearchTv(tv) {
    let str = "";
    let tvArr = tv.results;
    if (tvArr.length == 0)
        $("#results").html("<h3>No Tv Shows results found!");
    else {
        for (let i = 0; i < tvArr.length; i++) {
            str += "<div id='" + tvArr[i].id + "' class='row result tv' data-mediatype='tv' style='background:url(" + checkPhotos(tvArr[i].backdrop_path) + "); background-size:cover; background-repeat:no-repeat'><div class='resultText row'><div class='col-4'>";
            name = tvArr[i].name;
            imageSrc = checkPhotos(tvArr[i].poster_path);
            description = "<div class='col-8'><h3>" + name + "</h3><p>" + tvArr[i].first_air_date + "</p><h6>" + tvArr[i].overview + "</h6></div>";
            image = "<img class='imgResult' src = '" +  imageSrc + "'/></div>";
            str += image + description + "</div></div>";
        }
        $("#results").html(str);
    }
}

function renderSearchMovie(movie) {
    let str = "";
    let movieArr = movie.results;
    if (movieArr.length == 0)
        $("#results").html("<h3>No movie results found!");
    else {
        for (let i = 0; i < movieArr.length; i++) {
            str += "<div id='" + movieArr[i].id + "' class='row result movie' data-mediatype='movie' style='background:url(" + checkPhotos(movieArr[i].backdrop_path) + "); background-size:cover; background-repeat:no-repeat'><div class='resultText row'><div class='col-4'>";
            name = movieArr[i].title;
            imageSrc = checkPhotos(movieArr[i].poster_path);
            description = "<div class='col-8'><h3>" + name + "</h3><p>" + movieArr[i].release_date + "</p><h6>" + movieArr[i].overview + "</h6></div>";
            image = "<img class='imgResult' src = '" + imageSrc + "'/></div>";
            str += image + description + "</div></div>";
        }
        $("#results").html(str);
    }
}




//Same error callback for all requested options
function getErrorCB(err) {
    console.log(err);
}


function changeType(id) {
    $(".buttonType").removeClass("chosen");
    $("#" + id).addClass("chosen");
    if (id == "person")
        getPersons();
    else if (id == "movie")
        getMovies();
    else
        getTv();
}

