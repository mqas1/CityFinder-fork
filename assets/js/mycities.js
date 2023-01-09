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
    listItem.setAttribute("class", "list-group-item shadow-lg");
    listEl.appendChild(listItem);

// Creates a Bootstrap spinner to attach to each created list item
// as a way of giving visual feedback for a loading state.

    var spinnerEl = document.createElement("div");
    spinnerEl.setAttribute("class", "spinner-border");
    spinnerEl.setAttribute("role", "status");
    spinnerEl.innerHTML = "<span class='visually-hidden'>Loading...</span>"
    var spinnerDiv = document.createElement("div");
    spinnerDiv.setAttribute("class", "text-center m-5");
    spinnerDiv.setAttribute("id", "spinner");
    spinnerDiv.appendChild(spinnerEl);

    listItem.appendChild(spinnerDiv);
     
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

// Calling the Unsplash.com API to get an image for every list item/city.
// If there is a white space in the string, eg New York, the space is replaced with a hyphen for a more accurate search.
    var queryValue = element.replace(/\s/g, "-").toLowerCase();
    var apiUrl = `https://api.unsplash.com/search/photos?client_id=p7zdoYH1xGlPyGjJsZrp0j6_jSVR0nJqeDFINBI2ks8&query=${queryValue}&page=1&per_page=1&orientation=landscape`;
    fetch(apiUrl, {
        method: "GET"
    })
        .then(function (response) {

// The demo version of the API only allows for 50 calls an hour, returning a HTTP response of 403 if that is exceeded.
// If it is exceeded then the background image of the "li" is set to the landing page hero image,
// otherwise the first result is used as the background image.
// If there is no images for the city name query the image is also set to the landing page hero image.

            if (response.status === 403) {
                spinnerDiv.setAttribute("class", "d-none");
                listItem.setAttribute("style", `background-image: url("./assets/images/Globe\ Hero\ IMage.PNG")`);
                throw response.json(); 
            }

            return response.json();   
        })
        .then(function (data) {
            if (!data.results[0]){
                spinnerDiv.setAttribute("class", "d-none");
                listItem.setAttribute("style", `background-image: url("./assets/images/Globe\ Hero\ IMage.PNG")`);
            } else {

// Hotlinking to the image URL as per the API guidelines, and using the Imgix parameters at the end for browser responsiveness at any size.
// The photographer's name and profile is linked on the image, as well as a hyperlink to unsplash.com as per their API guidelines.
// Hides spinner from the list item once the photo starts to load.

                listItem.setAttribute("style", `background-image: url(${data.results[0].urls.regular}+&dpr=2)`);
                spinnerDiv.setAttribute("class", "d-none");
                var creditEl = document.createElement("p");
                var creditUrl = "?utm_source=city_finder&utm_medium=referral"
                creditEl.innerHTML = `Photo by <a href="${data.results[0].user.links.html}${creditUrl}">${data.results[0].user.name}</a> on <a href="https://www.unsplash.com${creditUrl}">Unsplash</a>`;
                listItem.appendChild(creditEl);
                creditEl.setAttribute("class", "position-absolute bottom-0 end-0 bg-secondary bg-opacity-50 p-2 mx-");
                creditEl.setAttribute("style", "font-size: 11px; color: white");
            }
        })
        .catch(error => {
            console.error(error);
          })
})

// Creates button for clearing items from local storage and therefore clearing the My Cities page.

var clearBtn = document.createElement("button");
var msgEl = document.getElementById("msg");
msgEl.setAttribute("class", "m-3")
clearBtn.textContent = "Clear ✘";
clearBtn.setAttribute("class", "btn btn-danger position-absolute top-0 end-0 mx-3");
msgEl.appendChild(clearBtn);

// Function for displaying the clear button. If there are no list items displayed on the page the clear button
// is hidden and a banner/message is displayed advising the user to save cities. If there are list items/cities saved to local storage
// then the clear button is made visible on the page. 

function displayClearBtn(){
    if (!listEl.innerHTML) {
        clearBtn.setAttribute("style", "visibility: hidden");
        msgEl.innerHTML = "<h1>Save your favourite cities here!<br><br><br><br><br><h6 class='position-absolute bottom-0 end-0 mx-3 my-5'><em>Hint: <a class='text-white' href='./index.html'>Search</a> a city first!</em></h6></h1>";
        msgEl.classList.remove("m-3");
        msgEl.setAttribute("class", "w-100 bg-primary bg-gradient bg-opacity-75 my-5 text-center text-light p-5 shadow-lg");
    } else {
        clearBtn.setAttribute("style", "visibility: visible");
    }
}

displayClearBtn();

// Click event for clearing local storage and refreshing the page.
clearBtn.addEventListener("click", () =>{
    localStorage.clear();
    location.reload();
})