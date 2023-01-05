let weather = {
    "apikey": "c8eb7848d1a8ad1e4c5a664ef80a87b6",
    fetchWeather: function(city) {
        fetch("https://api.openweathermap.org/data/2.5/weather?q="
        + city 
        +"&units=metric&appid=" 
        + this.apikey)
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));
    },

    displayWeather : function(data) {
        const {name} = data;
        const {icon , description} = data.weather[0];
        const {temp , humidity} = data.main;
        const {speed} = data.wind;
        document.querySelector(".city").innerHTML = name;
        document.querySelector(".icon").src = "http://openweathermap.org/img/wn/"+icon+".png";
        document.querySelector(".description").innerHTML = description;
        document.querySelector(".temp").innerHTML = temp + " °C";
        document.querySelector(".humidity").innerHTML = "Humidity : "+  humidity + "%";
        document.querySelector(".wind").innerHTML = "Wind Speed : " + speed + "m/s";
        document.querySelector(".info").classList.remove("loading");
    },

    search : function(){
        this.fetchWeather(document.querySelector(".search-bar").value);
    }

};


let geocode = {
    reverseGeocode : function (latitude,longitude) {
    var api_key = '19b1600ea466481299a3d2f10d1b529a';

    var api_url = 'https://api.opencagedata.com/geocode/v1/json'

    var request_url = api_url
      + '?'
      + 'key=' + api_key
      + '&q=' + encodeURIComponent(latitude + ',' + longitude)
      + '&pretty=1'
      + '&no_annotations=1';

    // see full list of required and optional parameters:
    // https://opencagedata.com/api#forward

    var request = new XMLHttpRequest();
    request.open('GET', request_url, true);

    request.onload = function() {
      // see full list of possible response codes:
      // https://opencagedata.com/api#codes

      if (request.status === 200){
        // Success!
        var data = JSON.parse(request.responseText);
        weather.fetchWeather(data.results[0].components.city);
      } else if (request.status <= 500){
        // We reached our target server, but it returned an error

        console.log("unable to geocode! Response code: " + request.status);
        var data = JSON.parse(request.responseText);
        console.log('error msg: ' + data.status.message);
      } else {
        console.log("server error");
      }
    };

    request.onerror = function() {
      // There was a connection error of some sort
      console.log("unable to connect to server");
    };

    request.send();  // make the request
    },

    getlocation:function(){
        function success(data){
            geocode.reverseGeocode(data.coords.latitude,data.coords.longitude);
        }

        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(success,console.error);
        }else{
            weather.fetchWeather("Mumbai");
        }
    }
}

document.querySelector(".search button").addEventListener("click",function(){
    weather.search();
})

document.querySelector(".search-bar").addEventListener("keyup", function(event) {
    if(event.key == "Enter"){
        weather.search();
    }
})

geocode.getlocation();