// Declaring empty array to populate with city names from local storage
var myCities = [];
var listEl = document.getElementById("my-cities-list");

function getMyCities(){
    for (var i = 0; i < localStorage.length; ++i) {

        var key = localStorage.key(i)

// Checks local storage for keys starting in "SavedCity" then gets the value,
// being the city name and pushes the value to the array declared above.
        if (key.substring(0, 9) === "SavedCity"){
            var cityValue = JSON.parse(localStorage.getItem(key));
            myCities.push(cityValue);
        }
    }
}

getMyCities();

myCities.forEach(element => {
    var listItem = document.createElement("li");
    listItem.setAttribute("class", "list-group-item");
    listEl.appendChild(listItem);
    var cityButton = document.createElement("button");
    cityButton.setAttribute("id", "cityBtn");
    cityButton.textContent = element;
    listItem.appendChild(cityButton);

    cityButton.addEventListener("click", function(){
        localStorage.setItem("clicked-city", cityButton.textContent);
        location.replace("./cityDisplay.html");
    })
})


