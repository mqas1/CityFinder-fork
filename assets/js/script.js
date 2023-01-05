var input = document.querySelector("#search-bar");
var submitBtn = document.querySelector("#submit-button");

// Date&Time on NavBar//
var time = document.querySelector("#Time")
function displayTime(){
    time.textContent=moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
}

displayTime();
setInterval(displayTime, 1000);


submitBtn.addEventListener('click', function(event) {
    event.preventDefault()
    if (input.value.trim().length !== 0 ) {
        localStorage.setItem('Searched-City', input.value);
        location.href="./cityDisplay.html"
    }
})

//Navbar title + 'search' link
var navtitle = document.querySelector(".navtitle")
navtitle.addEventListener("click", function(event){
    event.preventDefault()
    location.replace("./index.html")
})

var searchnav = document.querySelector("#searchnav")
searchnav.addEventListener("click", function(event){
    event.preventDefault()
    location.replace("./index.html")
})

//Navbar 'my cities' link
var mycitieslink = document.querySelector("#mycities")
mycitieslink.addEventListener("click", function(event){
    event.preventDefault()
    location.replace("./mycities.html")
})