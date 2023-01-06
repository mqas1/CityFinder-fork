// Date&Time on NavBar//
var time = document.querySelector("#Time")
function displayTime(){
    time.textContent=moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
}

displayTime();
setInterval(displayTime, 1000);

// Select searchbar input box + searchbar button
var searchtext = document.querySelector(".searchtext")
var clicksearch = document.querySelector(".clicksearch")

//Event listener which feeds user input into API from searchbar
clicksearch.addEventListener("click", function(event){
    event.preventDefault()
    getcity(searchtext.value)
})   

//Event listeners for navbar links
    //landing page redirect
var searchnav = document.querySelector("#searchnav")
searchnav.addEventListener("click", function(event){
    event.preventDefault()
    location.replace("./index.html")
})

var navtitle = document.querySelector(".navtitle")
navtitle.addEventListener("click", function(event){
    event.preventDefault()
    location.replace("./index.html")
})
    //'my cities' page redirect
var mycitieslink = document.querySelector("#mycities")
mycitieslink.addEventListener("click", function(event){
    event.preventDefault()
    location.replace("./mycities.html")
})
    
var getcity = function(cityname){   
    // clear dom by deleting its elements (which are all inside of the #cityInfoDisplay div)
    var bodydiv = document.querySelector("#cityInfoDisplay")
    
    var childrenNum = bodydiv.childElementCount
    for (var i=0 ; i < childrenNum ; i++){
        bodydiv.removeChild(bodydiv.firstElementChild)
    }

    // Clear previous weather input from DOM each time function is called, if any exists
    var clearWeather = document.querySelector(".weatherContainer")
    if(clearWeather !== null){
        clearWeather.remove()
    }
    
    //Append inputted cityname to API link
    var apiurl = "https://api.api-ninjas.com/v1/city?name=" + cityname

    //Fetch API data
    fetch(apiurl, {
        method: 'GET',
        headers: {'X-Api-Key': "hGbiYHle2lOLEK6bjC5+fA==NYlqZK9CJMmznECu"},
    })
    .then(function(response){
        return response.json()
    })
    .then(function(data){      
        // Check for existing bad input message, delete it if it exists
        var badinputcheck = document.querySelector(".badinput")
        if (badinputcheck !== null){
            badinputcheck.remove()   
        }

        //DISPLAY COUNTRY INFO
        //creates ul element
        var citylist = document.createElement("ul")
        citylist.className = "list-group"
        // citylist.setAttribute("style", "margin-top: 1%")
        bodydiv.appendChild(citylist)

        //creates li elements from API data        
        for (var prop in data[0]){
            var cityinfo = document.createElement("li")
            cityinfo.className = "list-group-item"

            //modify capital city list item
            if(prop === "is_capital"){
                //modify string returned by API from 'iscapital' to 'Capital city'
                cityinfo.textContent = `Capital city: ${data[0][prop]}`
                // append to ul
                citylist.appendChild(cityinfo)
            }
            //modify country name list item
            else if (prop === "name"){                
                //set name li item to 'active' (gives background colour), add text content
                cityinfo.textContent = `City ${prop[0].toUpperCase() + prop.slice(1)}: ${data[0][prop]}`
                cityinfo.classList.add("active", "currentcity")
                cityinfo.setAttribute("style", "font-weight: bold ; font-size: large")
                
                //create save-city button
                var savebtn = document.createElement("button")
                savebtn.textContent = "Save City"
                savebtn.classList.add("btn", "btn-success", "save-btn")

                //create div, append div to ul
                var cityNameElement = document.createElement("li")
                cityNameElement.classList.add("d-flex", "list-group-item", "active", "justify-content-between", "align-items-center")
                citylist.appendChild(cityNameElement)

                // append li and button that div
                cityNameElement.appendChild(cityinfo)
                cityNameElement.appendChild(savebtn)
            }
            else{
                // add text content to li item without modification, append to ul
                cityinfo.textContent = `${prop[0].toUpperCase() + prop.slice(1)}: ${data[0][prop]}`
                citylist.appendChild(cityinfo)
            }
        }

        // MANAGING 'SAVE CITY'
        // Add event listener to 'save-city' button which adds the current city to local storage (without creating duplicates)
        var savebtn = document.querySelector(".save-btn")
        savebtn.addEventListener("click", function(){
            // Check if any cities have been saved already. If not, add this city on click.
            var SavedCity = JSON.parse(localStorage.getItem("SavedCity1"))
            if (SavedCity === null){
                localStorage.setItem("SavedCity1", JSON.stringify(data[0].name))
            }
            
            // If cities are already saved, addCitytoStorage function checks they are not already present in localStorage.
            // Function returns a number if the city is not present in localStorage. Otherwise it returns 'true'
            var num = addCityToStorage(data[0].name)

            // If city is not already present, add it to localstorage upon click
            if (typeof(num) === "number"){ 
                localStorage.setItem(`SavedCity${num}`, JSON.stringify(data[0].name))
            }
            // Update button to show that city has been saved
            savebtn.textContent = "Saved!"

            //Disable save-city button
            savebtn.disabled = true          
        })

        //Disable event listener on 'save' button if current city is already saved in localStorage
        if (typeof(addCityToStorage(data[0].name)) === "boolean"){
            savebtn.disabled = true 
            savebtn.textContent = "Saved!"
        }

        // return latitude and longitude for weather API
        return [data[0].latitude, data[0].longitude]
    })
    .then(function(coordinates){
        var lat = coordinates[0]
        var lon = coordinates[1]
        getweather(lat,lon)
    })
    //Invalid input handling
    .catch(function() {   
        // Check for existing bad input message, delete it if it exists (this stops the message appearing multiple times)
        var badinputcheck = document.querySelector(".badinput")
        if (badinputcheck !== null){
            badinputcheck.remove()   
        }

        // Create bad input message
        var badinput = document.createElement("h4")
        badinput.textContent = "City not found!"
        badinput.setAttribute("style", "margin: 0 ; padding: 0 ; padding-left: 20px ; font-style: italic ; display: inline-block")
        badinput.classList.add("badinput")

        // Append bad input message to searchbar div
        document.body.appendChild(badinput)
    })
}

var getweather = function(lat, lon){
    apiurl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=3c1902a6683a6fc1079fef0612f33630&units=metric`
    fetch(apiurl)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        // Clear previous weather input from DOM each time function is called, if any exists
        var clearWeather = document.querySelector(".weatherContainer")
        if(clearWeather !== null){
            clearWeather.remove()
        }

            // Populate DOM with weather data
        //Container div for weather cards
        var weatherContainer = document.createElement("div")
        weatherContainer.classList.add("weatherContainer")
        weatherContainer.setAttribute("style", "display: flex ; justify-content: space-evenly ; margin-top: 1%; margin-bottom: 1.5%")
        document.body.appendChild(weatherContainer)

        console.log(data)
        //Construct individual weather cards
        for (var i=0; i<5 ; i++){            
            //Create card divs
            var weatherCard = document.createElement("div")
            weatherCard.classList.add("card")
            weatherCard.setAttribute("style", "width: 15rem")
            weatherContainer.appendChild(weatherCard)

            var weatherCardBody = document.createElement("div")
            weatherCardBody.classList.add("card-body", "d-flex", "flex-column", "align-items-start")
            weatherCardBody.setAttribute("style", "padding-bottom: 0 ; margin-bottom: 0")
            weatherCard.appendChild(weatherCardBody)

            //Weather icon element
            var icon = document.createElement("img")
            icon.setAttribute("src", `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`)
            icon.setAttribute("style", "width: 7rem ; align-self: center")
            icon.alt = "weather-icon"
            weatherCardBody.appendChild(icon)

            //Weather heading element
            var weatherDescription = document.createElement("h5")
            weatherDescription.textContent = data.list[0].weather[0].main 
            weatherCardBody.appendChild(weatherDescription)

            //Time element
            var weatherTime = document.createElement("p")
            weatherTime.textContent = data.list[i].dt_txt
            weatherTime.setAttribute("style", "font-style: italic")
            weatherCardBody.appendChild(weatherTime)

            //Weather data elements
            for (prop in data.list[i].main){
                if (prop === "temp"){
                    var weatherinfo = document.createElement("p")
                    weatherinfo.textContent = `Temp: ${data.list[i].main[prop]}°`
                    weatherCardBody.appendChild(weatherinfo)
                }
                if (prop === "feels_like"){
                    var weatherinfo = document.createElement("p")
                    weatherinfo.textContent = `Feels like: ${data.list[i].main[prop]}°`
                    weatherCardBody.appendChild(weatherinfo)
                }
                if (prop === "temp_min"){
                    var weatherinfo = document.createElement("p")
                    weatherinfo.textContent = `Min temp: ${data.list[i].main[prop]}°`
                    weatherCardBody.appendChild(weatherinfo)
                }
                if (prop === "temp_max"){
                    var weatherinfo = document.createElement("p")
                    weatherinfo.textContent = `Max temp: ${data.list[i].main[prop]}°`
                    weatherCardBody.appendChild(weatherinfo)
                }
                if (prop === "humidity"){
                    var weatherinfo = document.createElement("p")
                    weatherinfo.textContent = `Humidity: ${data.list[i].main[prop]}%`
                    weatherCardBody.appendChild(weatherinfo)
                }
            }
        }
    })
}

var addCityToStorage = function(CityName){
    // Cities are saved to localStorage in the format 'SavedCityN', where N is a number of any length

    // This function is running because a 'SavedCity' key already exists in localStorage. It does two things:
    // 1. Checks the current city being saved is not already saved. Exits the function the current city it is already present in localStorage.
    // 2. Checks for the highest value SavedCity (e.g. SavedCity999) in localStorage, so the key for the current city can be +1 of that
    num = 0

    // Iterate through localStorage
    for (var i = 0; i < localStorage.length; ++i) {
        // Get the i'th key from localStorage
        var key = localStorage.key(i)

        //Check if i'th key starts with 'SavedCity' (if it doesn't, it is irrelevant to us)
        if (key.substring(0, 9) === "SavedCity"){
            // If the value of the i'th key is the same as the current city name being saved, exit the function and do nothing. The city is saved already.
            // CityName = JSON.stringify(CityName)               
            if (localStorage[key] === JSON.stringify(CityName)){
                return true
            }
            
        //The following lines of code will update the 'num' variable until it is equal to the highest SavedCity number in localStorage:
            // Get the corresponding number following the 'SavedCity' part of the key.
            key = key.substring(9)
            key = Number(key)

            // If the current SavedCity number exceeds the 'num' variable, update the num variable to equal the given SavedCity number
            if (key > num){
                num = key
            }
        }
        }

        //Increment the highest SavedCity number in localStorage by 1
        num = Number(num) + 1
    return num
}

//Code which checks if user has arrived from landing page or 'my cities' page. Searches for given city (saved to localStorage) if so.
//Landing page
try{
    SearchedVal = localStorage["Searched-City"].trim()

    if (SearchedVal.length > 0){
        getcity(SearchedVal)
        localStorage.removeItem("Searched-City")
    }
}
catch(err){}

//My cities page
try{
    SearchedVal = localStorage["clicked-city"].trim()

    if (SearchedVal.length > 0){
        getcity(SearchedVal)
        localStorage.removeItem("clicked-city")
    }
}
catch(err){}