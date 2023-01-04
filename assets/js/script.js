
var input = document.querySelector("#search-bar");
var submitBtn = document.querySelector("#submit-button");

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