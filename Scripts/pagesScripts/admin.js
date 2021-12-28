$(document).ready(function () {


	$(window).load(function () {
		// Animate loader off screen
		$(".se-pre-con").fadeOut(2000);;

	});

	getTables();

	document.getElementById("defaultOpen").click();
})



// Get data from DB + Callbacks
function getTables() {
	let api = "../api/Episodes"
	ajaxCall("GET", api, "", getTableSuccess, getTableError);
}

function getTableSuccess(table) {
	console.log(table);
	getUsers(table.Users);
	getMovies(table.LikedMovies);
	getSeries(table.LikedSeries);
	getEpisodes(table.LikedEpisodes);
}

function getTableError(err) {
	console.log(err)
}


// Create and render DataTable for each category
function getUsers(users) {
	console.log(users)
	$("#usersTbl").DataTable({
		data: users,
		columns: [
			{
				title: "Full Name",
				render: function (data, type, row, meta) {
					fullName = row.FirstName + " " + row.LastName;
					return fullName;
				}
			},
			{
				title: "Mail",
				data: "Mail"
			},
			{
				title: "Phone Number",
				data: "PhoneNum"
			},
			{
				title: "Gender",
				render: function (data, type, row, meta) {
					if (row.Gender == 'F')
						return "Female";
					return "Male";
				}
			},
			{
				title: "Age",
				render: function (data, type, row, meta) {
					let currentYear = new Date().getFullYear();
					return currentYear - row.BirthYear;
				}
			},
			{
				title: "Style",
				data: "Style"
			},
			{
				title: "Address",
				data: "HomeAddress"
			}

		]
	})
}

function getSeries(shows) {
	console.log(shows)
	$("#likedShowsTbl").DataTable({
		data: shows,
		columns: [
			{
				title: "Series ID",
				data: "ID"
			},
			{
				title: "Series Name",
				data: "Name"
			},
			{
				title: "Number of likes",
				data: "NumOfUsers"
			},
		]
	})
}

function getMovies(movies) {
	console.log(movies)
	$("#likedMoviesTbl").DataTable({
		data: movies,
		columns: [
			{
				title: "Series ID",
				data: "ID"
			},
			{
				title: "Series Name",
				data: "Title"
			},
			{
				title: "Number of likes",
				data: "NumOfUsers"
			},
		]
	})
}

function getEpisodes(episodes) {
	console.log(episodes)
	$("#likedEpisodesTbl").DataTable({
		data: episodes,
		columns: [
			{
				title: "Series ID",
				data: "Series_ID"
			},
			{
				title: "Series Name",
				data: "Name"
			},
			{
				title: "Episode ID",
				data: "ID"
			},
			{
				title: "Episode Name",
				data: "Episode_Name"
			},
			{
				title: "Number of Likes",
				data: "NumOfUsers"
			}
		]
	})
}



/* Tabs JS */
// Gets the page name and the button we clicked
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
	elmnt.style.backgroundColor = "lightgrey";
}

