var cityInputEl = document.querySelector('#city');
var apiKey = 'd3ea098c07dab4f64c000489e765860c';
var searchBtn = $('#searchBtn');
var latlon = [];
var apiUrl;
function pullDayWeather(e) {
    e.preventDefault();
    var cityName = cityInputEl.value.trim();
    getCity(cityName);
    console.log(apiUrl);
    

}

function getCity (cityName) {
    fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=5&appid=' + apiKey).then(function (response) {
        return response.json();
    }).then(function(data){
        lat = data[0].lat;
        lon = data[0].lon
        latlon.push(lat, lon);
        console.log(latlon);
        apiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latlon[0] + '&lon=' + latlon[1] + '&exclude=daily&appid='+ apiKey;
        // console.log(apiUrl);

    })
    
}

searchBtn.on('click', pullDayWeather);
