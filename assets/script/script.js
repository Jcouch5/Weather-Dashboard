var cityInputEl = document.querySelector('#city');
var apiKey = 'd3ea098c07dab4f64c000489e765860c';
var searchBtnEl = $('#searchBtn');
var dashboardEl = $('#dashboard');
var fiveDayEl = $('#fiveDay');
// populates the current weather by pulling the data from openweather api 
function populateCurrentWeather(cords) {
    
    fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + cords.lat + '&lon=' + cords.lon + '&units=imperial&appid='+ apiKey)
    .then(response => response.json())
        .then(data => {

            var cityName = data.name;
            var cityDate = $('<h1>');
            var icon = $('<img>')
            var temp = $('<p>');
            var humidity = $('<p>');
            var windSpeed = $('<p>');
            var date = data.dt;
            var fDate = moment.unix(date).format('MM/DD/YYYY');

            cityDate.text(cityName + ' ' + '('+ fDate + ')');
            icon.attr("src", ("https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"))
            cityDate.append(icon);
            dashboardEl.append(cityDate);

            temp.text('Temperature: ' + data.main.temp + '°F')
            dashboardEl.append(temp);

            humidity.text('Humidity: ' + data.main.humidity + '%');
            dashboardEl.append(humidity);

            windSpeed.text('Wind speed: ' + data.wind.speed + " MPH");
            dashboardEl.append(windSpeed);

            
        })

}

// populates the weather for the next 5 days by pulling the data from openweather api 
function populateFiveDay(cords){
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+cords.lat+'&lon='+cords.lon+'&exclude=hourly,minutely,current&units=imperial&appid=' + apiKey)
    .then(response => response.json())
        .then(data => {

            for (let i = 1; i < data.daily.length-2; i++) {
                var cardEl = $('<div>');
                var cardBodyEl = $('<div>')
                var cityDate = $('<h1>');
                var icon = $('<img>')
                var temp = $('<p>');
                var humidity = $('<p>');
                var windSpeed = $('<p>');
                var date = data.daily[i].dt;
                var fDate = moment.unix(date).format('MM/DD/YYYY');
                
                cityDate.text(fDate);
                cityDate.addClass('card-header');
                cardEl.append(cityDate);

                icon.attr("src", ("https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png"))
                cardBodyEl.append(icon);

                temp.text('Temperature: ' + data.daily[i].temp.max + '°F')
                cardBodyEl.append(temp);

                humidity.text('Humidity: ' + data.daily[i].humidity + '%');
                cardBodyEl.append(humidity);

                windSpeed.text('Wind speed: ' + data.daily[i].wind_speed + " MPH");
                cardBodyEl.append(windSpeed);
                cardBodyEl.addClass('card-body');
                cardEl.append(cardBodyEl);
                cardEl.addClass('col-2 card border border-dark')
                fiveDayEl.append(cardEl);
            }
            
    })

}
function getUVI(cords){
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+cords.lat+'&lon='+cords.lon+'&exclude=hourly,minutely,current&appid=' + apiKey)
    .then(response => response.json())
    .then(data => {
        var uviText = $('<p>');
        var uviNum = $('<p>');
        var uv =data.daily[0].uvi;
        uviText.text('UV Index: ');
        dashboardEl.append(uviText);

        uviNum.text(uv);
        dashboardEl.append(uviNum);
        if(uv > 10){
            uviNum.addClass('bg-pink');
        } else if (uv >= 8) {
            uviNum.addClass('bg-danger'); //red
        } else if (uv >= 6) {
            uviNum.addClass('bg-orange'); //orange
        } else if (uv >= 3) {
            uviNum.addClass('bg-warning'); //yellow
        } else {
            uviNum.addClass('bg-success'); //green
        }

    })
}

function getCity(cityName){


    fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=5&appid=' + apiKey)
    .then(response => response.json())
      .then(data => {
          var  cords =  {
              'lat': data[0].lat,
              'lon': data[0].lon
          }

          populateCurrentWeather(cords);
          populateFiveDay(cords);
          getUVI(cords);
        })

      .catch(error => new Error(error));
}

searchBtnEl.on('click', function(e){
     e.preventDefault();
     while (dashboardEl.firstChild) {
        dashboardEl.removeChild(dashboardEl.firstChild)
    }
     var cityName = cityInputEl.value.trim();
     getCity(cityName);
     cityInputEl.value = '';


});
