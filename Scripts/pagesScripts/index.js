

$(document).ready(function () {
	var i = 1; 
	trailerUrl = "";
	document.getElementById("defaultOpen").click();

	$("#watchTrailerBtn").hide();
	chosenMedia = sessionStorage.getItem("mediaChoose");

	if (chosenMedia != null) {
		chosenMedia = JSON.parse(sessionStorage.getItem("mediaChoose"));
		getMedia();
		seasonsList = "";
		seasonsArr = [];

		setButtons();
	}
});

// Setting buttons/cards click events
function setButtons() {

	$(document).on('click', '#seasonsList > .card', viewEpisodes) 

	$("#watchTrailerBtn").click(watchTrailer)

	$(document).on('click', '.recommended', function () {
		sessionStorage.setItem("mediaChoose", JSON.stringify({ id: this.id, type: chosenMedia.type }))
		window.location.href = 'index.html';
	})

	$(document).on('click', '.actorCard', function () {
		sessionStorage.setItem("personId", this.id);
		window.location.href = 'Actor.html';
	});

	$("#movieLikeBtn").click(postMovie);
}


// Post movie to DB after movieLikeBtn click event + Callbacks
function postMovie() {
	let movie = {
		Id: Current_TV.id,
		Release_Date: Current_TV.release_date,
		Title: Current_TV.title,
		Original_Language: Current_TV.original_language,
		Overview: Current_TV.overview,
		Popularity: Current_TV.popularity,
		Backdrop_Path: Current_TV.backdrop_path,
		Status: Current_TV.status,
		Tagline: Current_TV.tagline
	}
	ajaxCall("POST", "../api/Movies?mail="+user.Mail, JSON.stringify(movie), postMovieSuccessCB, postMovieErrorCB)
	return false;
}

function postMovieSuccessCB(alert) {
	console.log(alert);
	successAlert(alert);
}

function postMovieErrorCB(err) {
	console.log(err);
	errorAlert(err.responseJSON.Message);
}


// Open trailer iframe after watchTrailerBtn click event
function watchTrailer(pageName, elmnt) {
	$("#trailerModal").html('<iframe width="420" height="315" id="trailerFrame" class="modal-content" src="' + trailerUrl + '?autoplay=1" allow="autoplay" allowfullscreen></iframe>')
	$("#trailerModal").show();

}


// Get media details from TMDB api by the chosen media object (from sessionStorage) + Callbacks
// append_to_response --> for multiple requests in the same api call 
function getMedia() {
	mediaType = "3/" + chosenMedia.type + "/";
	apiCall = url + mediaType + chosenMedia.id + "?" + api_key + "&append_to_response=credits,videos,recommendations";
	ajaxCall("GET", apiCall, "", getMediaSuccess, getMediaError);
}

function getMediaSuccess(media) {
	console.log(media)
	seasonsList = "";
	i = 1;
	mediaId = media.id;
	Current_TV = media;
	str = "<img src='" + checkPhotos(Current_TV.poster_path) + "'/>";
	fillGenresDiv();
	if (chosenMedia.type =="tv")
		$("#leftDetails").html("<p>Episode Runtime: " + Current_TV.episode_run_time[0] + "min</p><p>First air date: " + Current_TV.first_air_date + "</p>")
	else
		$("#leftDetails").html("<p>Movie Runtime: " + Current_TV.runtime + "min</p><p>First air date: " + Current_TV.release_date + "</p>")
	$('#headerBackground').attr("src", checkPhotos(Current_TV.backdrop_path));  
	$("#seriesName").html(Current_TV.name)
	$("#ph").html(str);
	avg = Current_TV.vote_average*10;
	$("#average").addClass("c100 p" + avg +' small '+ (avg>50 ? "green" : "orange"))
	$("#average").html('<span>' + avg + '%</span><div class="slice"><div class="bar"></div><div class="fill"></div></div>');
	$("#overview").html(Current_TV.overview);

	switch (chosenMedia.type) {
		case "movie": {
			$("#seriesName").html(Current_TV.title)
			if (mode=="member") {
				$("#movieLikeBtn").show();
			}
			renderDetails(Current_TV);
			$("#seasonsTab").hide();
			break;
		}
		case "tv": {
			$("#seriesName").html(Current_TV.name)
			let apiCall = url + mediaType + Current_TV.id + "/season/" + i + "?" + api_key;
			ajaxCall("GET", apiCall, "", getSeasonSuccessCB, getSeasonErrorCB)
			break;
		}

	}
}


function fillGenresDiv() {
	let genres = Current_TV.genres;
	$("#genresDiv").html("") 
	for (let i = 0; i < genres.length; i++) {
		$("#genresDiv").append("<div class='genre'>" + Current_TV.genres[i].name + "</div>");
	}
}

function getMediaError(err) {
	window.history.go(-1);
	console.log(err);
	errorAlert("Page not found");
}


// Get seasons callbacks
function getSeasonSuccessCB(season) {
	seasonsArr.push(season);
	image = "<li id=" + i + " class='card'> <img class='card-img-top' src='" + checkPhotos(season.poster_path) + "'/>";
	cardBody = "<div class='card-body' ><h6>" + season.name + "</h6><p>" + season.air_date + "</p></div> ";
	seasonsList += image + "<div class='goToPage'>Go to page" + cardBody + "</div></li>";
	i++;
	let apiCall = url + tvMethod + mediaId + "/season/" + i + "?" + api_key;
	ajaxCall("GET", apiCall, "", getSeasonSuccessCB, getSeasonErrorCB);

}

function getSeasonErrorCB(err) {
	if (err.status == 404) {
		$("#seasonsList").append(seasonsList);
		renderDetails(Current_TV);
	}
	else console.log("Error");
}


//Render media details after get media success callback
function renderDetails(media) {
	let video = media.videos.results[0];
	let credits = media.credits.cast;
	let recommendations = media.recommendations.results;
	getCredits(credits);
	if (recommendations.length > 0)
		getSimilar(recommendations);
	else
		$("#recommendationsTab").hide();
	getTrailer(video);
	getExternalLinks();
	$("#seriesDiv").show();
	$(".se-pre-con").fadeOut(1000);
}


// Get the current media trailer from youtube (if exists) and show watchTrailerBtn
function getTrailer(video) {
	if (video) {
		trailerUrl = "https://www.youtube.com/embed/" + video.key;
		$("#watchTrailerBtn").show();
	}
	else $("#watchTrailerBtn").hide();
}

// Render credits - called by renderDetails()
function getCredits(actors) {
	$("#actors").html("");
	let str = "";
	let profile = "";
	for (let i = 0; i < actors.length; i++) {
		image = "<li id=" + actors[i].id + " class='card actorCard'> <img class='card-img-top actorImg' src='" + checkPhotos(actors[i].profile_path) + "'>"
		cardBody = "<div class='card-body'><h6>" + actors[i].name + "</h6><p class='card-text'>" + actors[i].character + "</p></div ></li > ";
		str += image + "<div class='goToPage'>Go to page" + cardBody + "</div></li>";
	}
	$("#actors").html(str);
}

// Render similar shows/movies - called by renderDetails()
function getSimilar(series) {
	let recommendations = "";
	if (series.length > 0) {
		for (let i = 0; i < series.length; i++) {
			if (chosenMedia.type == "movie")
				name = series[i].title;
			else name = series[i].name;
			image = "<li id=" + series[i].id + " class='card recommended'> <img class='card-img-top' src='" + checkPhotos(series[i].backdrop_path) + "'/>";
			cardBody = "<div class='card-body'><h6>" + name + "</h6> <p class='card-text'>" + series[i].original_language + "</p></div>";
			recommendations += image + "<div class='goToPage'>Go to page" + cardBody + "</div></li>";
		}
		$("#recommendations").html(recommendations);
		//$("#recommendationsDiv").show();



	}
}


// Get external links - called by renderDetails() + Callbacks
function getExternalLinks() {
	let apiCall = url + mediaType + chosenMedia.id + "/external_ids?" + api_key;
	ajaxCall("GET", apiCall, "", getExternalLinksSuccessCB, getExternalLinksErrorCB);
}

function getExternalLinksSuccessCB(links) {
	console.log(links);
	let str = "";
	if (links.twitter_id != null)
		str += "<a class='linkIcons' href= 'https://www.twitter.com/" + links.twitter_id + "/'><i class='fa fa-twitter'></i></a>";
	if (links.facebook_id != null)
		str += "<a class='linkIcons' href= 'https://www.facebook.com/" + links.facebook_id + "/'><i class='fa fa-facebook'></i></a>";
	if (links.instagram_id != null)
		str += "<a class='linkIcons' href= 'https://www.instagram.com/" + links.instagram_id + "/'><i class='fa fa-instagram'></i> </a>";
	$("#externalLinks").html(str);
}

function getExternalLinksErrorCB(err) {
	console.log(err);
}


// Pass data of season by sessionStorage and transfer to Episodes.html
function viewEpisodes() {
	let id = this.id;
	sessionStorage.setItem("currentTV", JSON.stringify(Current_TV));
	sessionStorage.setItem("season", id);
	sessionStorage.setItem("episodes", JSON.stringify(seasonsArr[id-1].episodes))
	window.location.href = "Episodes.html";
}


function openPage(pageName, elmnt) {
	var tabcontent, tablinks;
	// Hide all the pages with class tabcontent
	tabcontent = document.getElementsByClassName("tabcontent");
	for (let i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}

	// Remove the background color of all tablinks/buttons
	tablinks = document.getElementsByClassName("tablink");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].style.backgroundColor = "";
	}

	// Show the specific tab content
	document.getElementById(pageName).style.display = "block";

	// Add the specific color to the button used to open the tab content
	elmnt.style.backgroundColor = "deepskyblue";
}