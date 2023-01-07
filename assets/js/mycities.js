//Event listeners for navbar links
    //landing page redirect

    var searchnav = document.querySelector("#searchnav")
    searchnav.addEventListener("click", function(event){
        event.preventDefault();
        location.replace("./index.html");
    })
    
    var navtitle = document.querySelector(".navtitle")
    navtitle.addEventListener("click", function(event){
        event.preventDefault();
        location.replace("./index.html");
    })

// Date&Time on NavBar//

var time = document.querySelector("#Time")
function displayTime(){
    time.textContent=moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
}

displayTime();
setInterval(displayTime, 1000);

// Declaring empty array to populate with city names from local storage

var myCities = [];
var listEl = document.getElementById("my-cities-list");

function getMyCities(){
    for (var i = 0; i < localStorage.length; ++i) {

        var key = localStorage.key(i);

// Checks local storage for keys starting in "SavedCity" then gets the value,
// being the city name and pushes the value to the array declared above.

        if (key.substring(0, 9) === "SavedCity"){
            var cityValue = JSON.parse(localStorage.getItem(key));
            myCities.push(cityValue);
        }
    }
}

getMyCities();

// Loops over the array of items from local storage creating a list item for each one.

myCities.forEach(element => {
    var listItem = document.createElement("li");
    listItem.setAttribute("class", "list-group-item");
    listEl.appendChild(listItem);

// Adds a button with the city name to each list item.

    var cityButton = document.createElement("button");
    cityButton.setAttribute("id", "cityBtn");
    cityButton.setAttribute("class", "btn btn-success");
    cityButton.textContent = element;
    listItem.appendChild(cityButton);

// Event listener for each button to go back to the City Display page with the API calls.

    cityButton.addEventListener("click", function(){
        localStorage.setItem("clicked-city", cityButton.textContent);
        location.replace("./cityDisplay.html");
    })

// Calling the Unsplash.com API to get an image for every list item/city

    var apiUrl = `https://api.unsplash.com/search/photos?client_id=p7zdoYH1xGlPyGjJsZrp0j6_jSVR0nJqeDFINBI2ks8&query=${element}&page=1&per_page=1&orientation=landscape`;
    fetch(apiUrl, {
        method: "GET"
    })
        .then(function (response) {

// The demo version of the API only allows for 50 calls an hour, returning a HTTP response of 403 if that is exceeded.
// If it is exceeded then the background image of the "li" is set to the landing page hero image,
// otherwise the first result is used as the background image.
// If there is no images for the city name query the image is also set to the landing page hero image.

            if (response.status === 403) {
                listItem.setAttribute("style", `background-image: url("./assets/images/Globe\ Hero\ IMage.PNG")`);
            } 
            return response.json();   
        })
        .then(function (data) {
            if (!data.results[0]){
                listItem.setAttribute("style", `background-image: url("./assets/images/Globe\ Hero\ IMage.PNG")`);
            } else {

// Hotlinking to the image URL as per the API guidelines, and using the Imgix parameters at the end for browser responsiveness at any size.

                listItem.setAttribute("style", `background-image: url(${data.results[0].urls.regular}+&dpr=2)`);
            }

// The photographer's name and profile is linked on the image, as well as a hyperlink to unsplash.com as per their API guidelines.

            var creditEl = document.createElement("p");
            creditEl.innerHTML = `Photo by <a href="${data.results[0].user.links.html}">${data.results[0].user.name}</a> on <a href="https://www.unsplash.com">Unsplash</a>.`;
            listItem.appendChild(creditEl);
            creditEl.setAttribute("class", "position-absolute bottom-0 end-0");
            creditEl.setAttribute("style", "font-size: 11px; color: white; padding-right: 1.5rem");
        }) 
})