
var input = document.querySelector("#search-bar");
var submitBtn = document.querySelector("#submit-button");

submitBtn.addEventListener('click', function() {
    localStorage.setItem('Searched-City', input.value);

    if (input.value.length !== 0 ) {
        location.href="./cityDisplay.html"
    }
})
