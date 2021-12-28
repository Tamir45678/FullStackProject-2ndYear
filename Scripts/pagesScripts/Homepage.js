
var popularMode = "";

$(document).ready(function () {

    $(window).load(function () {
        // Animate loader off screen
        $(".se-pre-con").fadeOut(2000);;

    });

    //Get Popular According to TMBD
    getPopularTv();
    getPopularMovie();
    showNews();

    recommendMode = "";

    //If User logged in, render User options to Homepage
    if (mode == "member") {
        getRecBySimilarUsers();
      
    }

    //Toggle TVShows/Movies by click option for each popular/recommend
    $(".popularButton").click(function () {
        if ($(this).css("background-color") != "rgb(0, 255, 255)")
            togglePopular();
    });
    $(".recommendButton").click(function () {
        if ($(this).css("background-color") != "rgb(0, 255, 255)")
            toggleRecommend();
    })

    //get TVShow/Movie selected Page.
    $(document).on("click", ".tv", function () {
        let method = {
            id: this.id,
            type: "tv"
        }
        sessionStorage.setItem("mediaChoose", JSON.stringify(method));
        window.location.href = 'index.html';
    });
    $(document).on("click", ".movie", function () {
        let method = {
            id: this.id,
            type: "movie"
        }
        sessionStorage.setItem("mediaChoose", JSON.stringify(method));
        window.location.href = 'index.html';
    });

});

//Get TVShows Recommendations according to similar Users.
function getRecBySimilarUsers() {
    let api = "../api/Seriess?mail=" + user.Mail + "&mode=Recommended";
    ajaxCall("GET", api, "", getRecSuccess, getRecError);
}
function getRecSuccess(rec) {
    console.log(rec);
    if (rec.length > 0) {
        $("#recommend").css("visibility", "visible");
        let str = "";
        for (let i = 0; i < rec.length; i++) {
            str += "<li id = '" + rec[i].Id + "'class = 'card tv'>";
            image = "<img class='card-img-top' src = '" + checkPhotos(rec[i].Poster_Path) + "'/>";
            cardBody = "<div class='card-body'><h6>" + rec[i].Name + "</h6> <p class='card-text'>" + rec[i].Original_Language + "</p></div>";
            str += image + "<div class='goToPage'>Go to page" + cardBody + "</div></li>";
        }
        $("#recommendTvList").html(str);
        $("#showTvRecommend").css("background-color", "aqua");
        recommendMode = "tv";
    }
    else {
        $("#showTvRecommend").remove();
        $("#recommendTV").remove();
        recommendMode = "movie";
        $("#showMovieRecommend").css("background-color", "aqua");
    }

    getRecMovieBySimilarUsers();
}
function getRecError(err) {
    console.log(err);
    getRecMovieBySimilarUsers();
}

//Get Movie Recommendations according to similar Users.
function getRecMovieBySimilarUsers() {
    let api = "../api/Movies?mail=" + user.Mail + "&mode=Recommended";
    ajaxCall("GET", api, "", getMovieRecSuccessCB, getMovieRecErrorCB);
}
function getMovieRecSuccessCB(movies) {
    if (movies.length > 0) {
        console.log(movies);
        $("#recommend").css("visibility", "visible");
        let str = "";
        for (let i = 0; i < movies.length; i++) {
            str += "<li id = '" + movies[i].Id + "'class = 'card movie'>";
            image = "<img class='card-img-top' src = '" + checkPhotos(movies[i].Backdrop_Path) + "'/>";
            cardBody = "<div class='card-body'><h6>" + movies[i].Title + "</h6> <p class='card-text'>" + movies[i].Original_Language + "</p></div>";
            str += image + "<div class='goToPage'>Go to page" + cardBody + "</div></li>";
        }
        $("#recommendMovieList").html(str);
        if (recommendMode != "movie")
            $("#recommendMovie").css("display", "none");
    }
    else {
        $("#recommendMovie").remove();
        $("showMovieRecommend").remove();
    }
}
function getMovieRecErrorCB(err) {
    console.log(err);
}

//Get Popular TvShows
function getPopularTv() {
    let apiCall = url + tvMethod + "popular?" + api_key + "&language=en-US&page=1";
    ajaxCall("GET", apiCall, "", getTopShowSuccessCB, getTopShowErrorCB);
}
function getTopShowSuccessCB(topTv) {

    popularShows = topTv.results;
    let str = "";
    for (let i = 0; i < popularShows.length; i++) {
        str += "<li id = '" + popularShows[i].id + "'class = 'card tv'>";
        image = "<img class='card-img-top' src = '" + checkPhotos(popularShows[i].poster_path) + "'/>";
        cardBody = "<div class='card-body'><h6>" + popularShows[i].name + "</h6> <p class='card-text'>" + popularShows[i].original_language + "</p></div>";
        str += image + "<div class='goToPage'>Go to page"+cardBody + "</div></li>";
    }
    $("#anyShowType").html(str);
    $("#showTvPopular").css("background-color", "aqua");
}
function getTopShowErrorCB(err) {
    console.log(err);
}

//Get Popular Movies
function getPopularMovie() {
    let apiCall = url + movieMethod + "popular?" + api_key + "&language=en-US&page=1";
    ajaxCall("GET", apiCall, "", getTopMovieSuccessCB, getTopMovieErrorCB);
};
function getTopMovieSuccessCB(movies) {
    console.log(movies);
    popularMovies = movies.results;
    let str = "";
    for (let i = 0; i < popularMovies.length; i++) {
        str += "<li id = '" + popularMovies[i].id + "'class = 'card movie'>";
        image = "<img class='card-img-top' src = '" + checkPhotos(popularMovies[i].poster_path) + "'/>";
        cardBody = "<div class='card-body'><h6>" + popularMovies[i].original_title + "</h6> <p class='card-text'>" + popularMovies[i].original_language + "</p></div>";
        str += image + "<div class='goToPage'>Go to page" + cardBody + "</div></li>";
    }
    $("#anyMovieType").html(str);
    $("#popularMovie").hide();
    popularMode = "tv";
}
function getTopMovieErrorCB(err) {
    console.log(err);
}

//Toggle Functions
function togglePopular() {
    if (popularMode == "tv") {
        $("#popularMovie").show();
        $("#popularTV").hide();
        $("#showTvPopular").css("background-color", "white");
        $("#showMoviePopular").css("background-color", "aqua");
        popularMode = "movie";
    }
    else {
        $("#popularTV").show();
        $("#popularMovie").hide();
        $("#showMoviePopular").css("background-color", "white");
        $("#showTvPopular").css("background-color", "aqua");
        popularMode = "tv";
    }
}
function toggleRecommend() {
    if (recommendMode == "tv") {
        $("#recommendMovie").show();
        $("#recommendTV").hide();
        $("#showTvRecommend").css("background-color", "white");
        $("#showMovieRecommend").css("background-color", "aqua");
        recommendMode = "movie";
    }
    else {
        $("#recommendTV").show();
        $("#recommendMovie").hide();
        $("#showMovieRecommend").css("background-color", "white");
        $("#showTvRecommend").css("background-color", "aqua");
        recommendMode = "tv";
    }
}

function showNews() {
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth() - 1;

    const getNews1 = async () => {
        const url = "https://gnews.io/api/v4/search?q=movie&q=movies&q=film&q=trailer&q=netflix&from=" + currentMonth + "&sortBy=publishedAt&token=ba321b37abc7a5d974194335c54ceef8&lang=en";
        const res = await fetch(url); //פונקציה שיש בדפדפן המקבלת כתובת ומחזירה את התוכן שלו.
        // await תמשיך לשורה הבאה רק כאשר התוכן נטען במלואו
        const { articles } = await res.json();  //לוקחים רק את articles מבין כל השדות שיש בכתובת.
        return articles;
    };

    const createNewsItemEl = ({ description, title, url, image }) => {
        const d = document.createElement("div");
        d.innerHTML = `
            <div class='newDiv'>
            <div class='newImg'><img src="${image}" style="width:300px; height:auto"  /> </div>    
            <div class='newDescription'>
            <div class='newUrl'><a href="${url}" target="_blank" ><h5>${title}</h5></a></div>
               <p>${description}</p></div></div>
            
            <hr class="solid"></div>
                `
            ;
        return d;
    };

    
    getNews1().then((news) => { 
        const cont = document.getElementById("showNews");
        cont.appendChild(createNewsItemEl(news[0]));
        newsInterval = setInterval(function () {
            var index = Math.floor(Math.random() * 10);
            $(cont).fadeToggle('slow', function () {
                cont.replaceChild(createNewsItemEl(news[index]), cont.lastChild);
                $(cont).fadeToggle('slow');
            }
         )
        },5000)

    }).catch(console.error);

 
}

