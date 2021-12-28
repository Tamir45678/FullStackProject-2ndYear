const nav = document.createElement('div');
nav.innerHTML = `<div class="nav">
    <div class="logo" onclick=""><i class="fa fa-film"></i>The movie DB </div>
    <div>
        <img id="userProfilePh" src="../Images/userPng.jpeg" />
        <div id="welcomeDiv"></div>
    </div>
    <div id="searchDiv" class="ui-widget">
        <input type="text" id="tvShowName" placeholder="Look for Tv Show/Movie/Person" />
        <button id="getTV"><i class="fa fa-search"></i></button>
    </div>
    <button id="openMenuBtn"><i class="fa fa-bars"> </i></button>
</div >`;


