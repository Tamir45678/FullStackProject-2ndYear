
var searchInput = 'addressTB';

//onload user logged in check
function checkLS() {
    if (localStorage["User"] != null) {
        user = JSON.parse(localStorage["User"]);
        $("#welcomeDiv").html("Welcome back, " + user.FirstName + " " + user.LastName);
        toggleBar();
        mode = "member";
        if (typeof (sessionStorage.chat) != "undefined")
            chatDetails = JSON.parse(sessionStorage["chat"]);
        else
            chatDetails = "";
        getChats();
        getProfilePicture(user);
        setChat();
    }
    else {
        mode = "guest";
        $("#userProfilePh").hide();
    }
}

$(document).ready(function () {

    $("#phNav").html(nav)

    errorPng = "..//Images//noImage.jpg";
    mode = "";
    key = "46ee229c787140412cbafa9f3aa03555";
    url = "https://api.themoviedb.org/";
    imagePath = "https://image.tmdb.org/t/p/w500/";
    tvMethod = "3/tv/";
    movieMethod = "3/movie/";
    api_key = "api_key=" + key;
    newsInterval = "";


    var memberBar = document.getElementById("memberBar");
    var guestBar = document.getElementById("guestBar");

    guestBar.style.display = "block";
    memberBar.style.display = "none";

    checkLS();

    var autocomplete;
    autocomplete = new google.maps.places.Autocomplete((document.getElementById(searchInput)), {
        types: ['geocode']
    });

    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var near_place = autocomplete.getPlace();
    });

    var loginModal = document.getElementById("loginModal");
    var registerModal = document.getElementById("registerModal");
    var trailerModal = document.getElementById("trailerModal");
 

    var loginBtn = document.getElementById("loginBtn");
    var registerBtn = document.getElementById("registerBtn");

    loginBtn.onclick = function () {
        loginModal.style.display = "block";
    }
    registerBtn.onclick = function () {
        registerModal.style.display = "block";
    }

   

    window.onclick = function (event) {
        if (event.target == loginModal) {
            loginModal.style.display = "none";
            $("#loginForm").trigger("reset");
        }
        if (event.target == registerModal) {
            registerModal.style.display = "none";
            $("#registerForm").trigger("reset");
        }
        if (event.target == trailerModal) {
            trailerModal.style.display = "none";
            $('#trailerModal').html("")
        }
    }

    $("#registerForm").submit(insertUser);

    $("#loginForm").submit(getUserByData);

    $(document).on("click", "#logoutBtn", function () {
        localStorage.clear();
        $("#welcomeDiv").html("");
        toggleBar();
        localStorage.removeItem("profileSrc");
        deleteChat();
        window.location.href = "Homepage.html";
    })

    $("#getTV").click(searchByName);

    $("#tvShowName").keypress(function (event) {
        if (event.keyCode === 13)
            searchByName();
    })

    $("#tvShowName").keyup(function () {
        if ($("#tvShowName").val() != "undefined") {
            let method = "3/search/multi?"
            let query = "query=" + $("#tvShowName").val();
            let moreParams = "&language=en-US&include_adult=false&page=1&";
            apiCall = url + method + api_key + moreParams + query;
            ajaxCall("GET", apiCall, "", getMultiSuccessCB, getMultiErrorCB);
        }
        else {
            $("#ui-id-1").hide();
        }
    })

    $(".logo").click(function () {
        window.location.href = "Homepage.html";
    })



    //scroll with button
    $('.rightScrollBtn').click(function () {
        element = this.parentElement.children[1];
        position = $(element).scrollLeft()
        width = $(element).width();
        $(element).animate({ //animate element that has scroll
            scrollLeft: position + width //for scrolling
        }, 1000);
    });

    $('.leftScrollBtn').click(function () {
        element = this.parentElement.children[1];
        position = $(element).scrollLeft()
        width = $(element).width();
        $(element).animate({ //animate element that has scroll
            scrollLeft: position - width //for scrolling
        }, 1000);
    });

    //'Enter' keypress event for send message in chat
    $("#msgTB").keypress(function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            AddMSG();
        }
    })

    chatListBtn = document.getElementById("openChatListBtn");
    $(chatListBtn).click(function () {
        $("#fanClub").toggle("fast")
    })

    //Join selected Chat.
    $(document).on("click", ".joinChatBtn", function () {
        $("#fanClub").toggle("fast");
        chatDetails = {
            id: this.id,
            name: this.parentElement.firstElementChild.innerText,
            bottom:'0px'
        }
        setChat();
    });
    $("#chatHeader").click(toggleChat);

    //Menu toggle
    $("#openMenuBtn").click(function () {
        $("#menuContent").slideToggle('fast');
    })

    window.onbeforeunload = function () {
        if (typeof (chatDetails) != "undefined") {
            chatDetails.bottom = $("#chatWindow").css("bottom");
            sessionStorage["chat"] = JSON.stringify(chatDetails);
        }
    }

    $(document).on('click', ".autoOption", function () {

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

function play() {
    hoverSound.play();
}

function getMultiSuccessCB(availableTags) {
    console.log(availableTags);
    arr = availableTags.results;
    name = "";
    res = [];
    for (let i = 0; i < arr.length; i++) {

        if (arr[i].media_type == "movie")
            name = arr[i].title;
        else name = arr[i].name;
        if (arr[i].media_type == "person")
            photo = arr[i].profile_path;
        else
            photo = arr[i].poster_path;

        obj = {
            "id":arr[i].id,
            "name": name,
            "poster": photo,
            "mediaType": arr[i].media_type
        }
        res[i]=JSON.stringify(obj) 
	}

   

    $("#tvShowName").autocomplete({
        source: res,
        minLength: 0
    })
        .autocomplete("instance")._renderItem = function (ul, item) {
            
            realItem = JSON.parse(item.label)
            item.value = realItem.name;
      return $( "<li class='autoOption' id="+realItem.id+" data-mediatype="+realItem.mediaType+">")
          .append( "<div style='width:100%'><img src='"+checkPhotos(realItem.poster)+"' style='width:70px;'/><p class='nameP'>" +realItem.name +" </p><p class='typeP'>"+ realItem.mediaType + "</p></div>" )
                .appendTo(ul);
          
    };


}
function getMultiErrorCB(err) {
    if (err.status == 422 || err.status==404)
        $("#ui-id-1").hide();
}

function searchByName() {
    sessionStorage.setItem("searchValue", $("#tvShowName").val());
    window.location.href = "Search.html";
}
function toggleBar() {
    if (memberBar.style.display != "block") {
        memberBar.style.display = "block";
        guestBar.style.display = "none";
    }
    else {
        memberBar.style.display = "none";
        guestBar.style.display = "block";
    }
}
function toggleModal() {
    if (loginModal.style.display != "block") {
        loginModal.style.display = "block";
        registerModal.style.display = "none";
    }
    else {
        loginModal.style.display = "none";
        registerModal.style.display = "block";
    }
}

//Register Functions
function insertUser() {
    registerModal.style.display = "none";
    let user = {
        FirstName: $("#firstNameTB").val(),
        LastName: $("#lastNameTB").val(),
        Mail: $("#mailTB").val(),
        Password: $("#passwordTB").val(),
        PhoneNum: $("#phoneTB").val(),
        Gender: $("input[name='gender']:checked").val(),
        BirthYear: $("#birthYearTB").val(),
        Style: $("#styleTB").val(),
        Address: $("#addressTB").val(),
    }

    let api = "../api/Users";
    ajaxCall("POST", api, JSON.stringify(user), postUserSuccessCB, postUserErrorCB)
    return false;
}
function postUserSuccessCB(num) {
    if (num == 0) {
        errorAlert("Mail already taken. Please try different Mail.");
        return;
    }
    uploadImage();
    $("#registerForm").trigger("reset");
    successAlert("Registered Successfully");
}
function postUserErrorCB(err) {
    errorAlert("Error");
}

//Profile picture functions
function uploadImage() {
    const file = document.querySelector("#profileFile").files[0];
    if (typeof (file) == "undefined")
        return;
    const ref = firebase.storage().ref();
    const name = $("#mailTB").val();
    const metadata = {
        contentType: file.type
    }
    ref.child(name).put(file, metadata);
}
function getProfilePicture(user) {
    const ref = firebase.storage().ref();
    ref.child(user.Mail).getDownloadURL()
        .then(url => {
            localStorage['profileSrc'] = url;
            $("#userProfilePh").attr("src", url).show();
        })
     .catch ((error) => {
        // Handle any errors
         if (error.code == "storage/object-not-found") {
             localStorage['profileSrc'] = "";
         }
    });

}

//login Get (Admin/Regular)
function getUserByData() {
    let api = "../api/Users?Mail=" + $("#loginMail").val() + "&Password=" + $("#loginPassword").val();
    ajaxCall("GET", api, " ", getUserSuccessCB, getUserErrorCB);
    return false;
}
function getUserSuccessCB(user) {
    if (user.Mail == 'admin@admin.com')
        window.location.href = "Admin.html";
    else {
        delete user["Password"];
        localStorage["User"] = JSON.stringify(user);
        getProfilePicture(user);
        loginModal.style.display = "none";
        location.reload();
    }
}
function getUserErrorCB(err) {
    errorAlert(err.responseJSON.Message);
}

//Get Chats from every prefered Series and his initiate functions
function setChat() {
    if (chatDetails != "") {
        ref = firebase.database().ref("messages/" + chatDetails.id);
        $("#chatName").html(chatDetails.name);
        $("#chatWindow").css({ "visibility": "visible", "bottom": chatDetails.bottom })
        $("#messages").html("");
        listenToNewMessages();
    }
}
function getChats() {
    let api = "../api/Seriess?mail=" + user.Mail + "&mode=Favorites";
    ajaxCall("GET", api, "", getChatsSuccess, getChatsError);
}
function getChatsSuccess(series) {
    let str = "";
    for (let i = 0; i < series.length; i++) {
        str += "<li><p>" + series[i].Name + "</p><button class='joinChatBtn' id=" + series[i].Id + ">Join</button></li>"
    }
    $("#chatList").html(str);
}
function getChatsError(err) {
    console.log(err);
}
function printMessage(msg) {
    type = "";
    profileSrc = msg.profileSrc;
    if (profileSrc == "")
        chatPhotoSrc = "../Images/userPng.jpeg";
    else
        chatPhotoSrc = profileSrc;
    imageSrc = '<img src=' + chatPhotoSrc + ' width="30" height="30">'

    if (msg.mail != user.Mail)
        type = "chat ml-2";
    else
        type = "bg-white mr-2"
    str = '<div class="d-flex flex-row p-3">' + imageSrc + '<div class="' + type + ' p-3">' + "<h6><u>" + msg.name + '</u></h3>' + msg.content + '</div>'

    $("#messages").append(str);
    $("#messages").scrollTop($("#messages")[0].scrollHeight);
    $("#msgTB").val("");
}
function listenToNewMessages() {
    ref.on("child_added", snapshot => {
        msg = {
            name: snapshot.val().name,
            content: snapshot.val().msg,
            mail: snapshot.val().mail,
            profileSrc: snapshot.val().profileSrc
        }
        printMessage(msg);
    })
}
function AddMSG() {
    let msg = document.getElementById("msgTB").value;
    let name = user.FirstName;
    let mail = user.Mail;
    let profileSrc = localStorage.profileSrc;
    ref.push().set({ "msg": msg, "name": name, "mail": mail, "profileSrc": profileSrc });
}
function toggleChat() {
    if ($("#chatWindow").css('bottom') == '0px')
        bottomValue = "-350px";
    else
        bottomValue = "0px";
    $("#chatWindow").animate({ bottom: bottomValue });
}
function deleteChat() {
    $("#chatWindow").css("visibility", "hidden");
    chatDetails=""
}

//checking photo for each html img src 

function checkPhotos(photo) {
    if (photo == null || photo=="")
        return errorPng;
    return imagePath + photo;
}

function exitNews(e) {
    $(e.parentElement.parentElement).hide();
    clearInterval(newsInterval);
}