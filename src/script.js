let dateDiv = document.querySelector("#cur-date");
let hourDiv = document.querySelector("#cur-hour");
let minuteDiv = document.querySelector("#cur-minute");

let curDate = new Date();
let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

let day = days[curDate.getDay()].toLocaleUpperCase();

let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "Jule",
    "August",
    "September",
    "October",
    "November",
    "December"
];
let month = months[curDate.getMonth()];

let date = curDate.getDate();
let year = curDate.getFullYear();

let dateSentence = `${day}, ${date} ${month}, ${year}`;
dateDiv.innerHTML = dateSentence;

let hours = curDate.getHours();
let minutes = curDate.getMinutes();

if (hours < 10) {
    hourDiv.innerHTML = `0${hours}`;
} else {
    hourDiv.innerHTML = `${hours}`;
}

if (minutes < 10) {
    minuteDiv.innerHTML = `0${minutes}`;
} else {
    minuteDiv.innerHTML = `${minutes}`;
}

function setForecastDates() {
    let daysArr = [1, 2, 3, 4, 5, 6];
    daysArr.forEach(function (day) {
        let nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + day);

        let nextDayDiv = document.querySelector(`#day-${day}`);
        let nextDateDiv = document.querySelector(`#date-${day}`);

        let nextDayOfWeek = days[nextDay.getDay()].toLocaleLowerCase();
        let nextDate = nextDay.getDate();
        let nextDayMonths = months[nextDay.getMonth()].toLocaleLowerCase();
        nextDayDiv.innerHTML = nextDayOfWeek;
        nextDateDiv.innerHTML = `${nextDate} ${nextDayMonths}`;
    });
}

function displayForecast () {
    let forecastDiv = document.querySelector("#weather-forecast-nextdays");
    let forecastHTML = forecastDiv.innerHTML;
    let daysArr = [1, 2, 3, 4, 5, 6];
    daysArr.forEach(function (day){
        forecastHTML = forecastHTML + `
                <div class="row nextday-forecast">
                    <div class="col-4">
                        <div class="nextdays-weather">
                            <img src="" class="icon-nextdays" id="icon-day-${day}"/>
                            <br/>
                            <span class="nextdays-temperature">
                            <strong>
                                <span id="temp-day-${day}"></span><span id="temp-unit-day-${day}">℃</span>
                            </strong>
                            </span>
                        </div>
                    </div>
                    <div class="col-8">
                        <div class="date">
                            <div class="day-of-week" id="day-${day}"></div>
                            <div class="day" id="date-${day}"></div>
                        </div>
                    </div>
                </div>
                `;
    })
    forecastDiv.innerHTML = forecastHTML;
    setForecastDates();
}

displayForecast();

function setCountry(response) {
    let countryDiv = document.querySelector("#country-name");
    countryDiv.innerHTML = response.data.sys.country;
}

function setWindSpeed(response) {
    let windSpeedDiv = document.querySelector("#wind-speed");
    windSpeedDiv.innerHTML = response.data.wind.speed;
}

function setHumidity(response) {
    let humidityDiv = document.querySelector("#humidity");
    humidityDiv.innerHTML = response.data.main.humidity;
}

function setCity(response) {
    let cityDiv = document.querySelector("#city-name");
    let city = response.data.name;
    cityDiv.innerHTML = `${city},`;
}

function setTemp(response) {
    let tempText = document.querySelector("#cur-temperature");
    tempText.innerHTML = Math.round(response.data.main.temp);
    if (!isCelcius) {
        let tempUnit = document.querySelector("#temp-unit");
        tempUnit.innerHTML = "℃";
        isCelcius = true;
    }
}

function setWeatherIcon(response) {
    let icon = document.querySelector("#icon");
    icon.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
    icon.setAttribute("alt", `${response.data.weather[0].description}`);
}

function setWeather(response) {
    console.log(response);
    setTemp(response);
    setCity(response);
    setCountry(response);
    setWindSpeed(response);
    setHumidity(response);
    setWeatherIcon(response);
    findCityWeatherForecast(response.data.coord);
}

function findCityСurWeather(city) {
    let apiKey = `fb33ec4fa16d64739386bd7d1318cf96`;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    axios.get(apiUrl).then(setWeather);
}

function setMinMaxTempToday(response) {
    let minTempDiv = document.querySelector("#min-temp");
    let maxTempDiv = document.querySelector("#max-temp");
    minTempDiv.innerHTML = Math.round(response.data.daily[0].temp.min);
    maxTempDiv.innerHTML = Math.round(response.data.daily[0].temp.max);
}

function setForecast(response) {
    setMinMaxTempToday(response);
    console.log(response);
    let daysArr = [1, 2, 3, 4, 5, 6];
    daysArr.forEach(function (day){
       let tempDivNextDay =  document.querySelector(`#temp-day-${day}`);
       let iconNextDay = document.querySelector(`#icon-day-${day}`);
       iconNextDay.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.daily[day].weather[0].icon}@2x.png`);
       iconNextDay.setAttribute("alt", `${response.data.daily[day].description}`);
       tempDivNextDay.innerHTML = Math.round(response.data.daily[day].temp.day);
    });
}

function findCityWeatherForecast(coord) {
  let apiKey = `a43564c91a6c605aeb564c9ed02e3858`;
  let apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(setForecast);
}

findCityСurWeather("Kyiv");
findCityWeatherForecast("Kyiv");

function search(event) {
    event.preventDefault();
    let cityInput = document.querySelector("#input-city");
    if (cityInput.value) {
        findCityСurWeather(cityInput.value);
        findCityWeatherForecast(cityInput.value);
    }
    cityInput.value = "";
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", search);

function findWeatherByPosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let apiKey = `fb33ec4fa16d64739386bd7d1318cf96`;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lon=${lon}&lat=${lat}&units=metric&appid=${apiKey}`;
    axios.get(apiUrl).then(setWeather);
}

function searchLocation() {
    navigator.geolocation.getCurrentPosition(findWeatherByPosition);
}

let geolocationButton = document.querySelector("#geolocation-button");
geolocationButton.addEventListener("click", searchLocation);

let toCelsius = document.querySelector("#toCelsius");
let toFahrenheit = document.querySelector("#toFahrenheit");
let isCelcius = true;

function convertToCelcius(event) {
    event.preventDefault();
    if (!isCelcius) {
        let daysArr = [1, 2, 3, 4, 5, 6];
        daysArr.forEach(function (day){
            let tempDivNextDay = document.querySelector(`#temp-day-${day}`);
            let tempUnitNextDay = document.querySelector(`#temp-unit-day-${day}`);
            let tempNextDay = tempDivNextDay.innerHTML
            tempDivNextDay.innerHTML = Math.round(((tempNextDay - 32) * 5) / 9);
            tempUnitNextDay.innerHTML = "℃";
        });
        let tempText = document.querySelector("#cur-temperature");
        let tempUnit = document.querySelector("#temp-unit");
        let temp = tempText.innerHTML;
        tempText.innerHTML = Math.round(((temp - 32) * 5) / 9);
        tempUnit.innerHTML = "℃";
        isCelcius = true;
    }
}

function convertToFahrenheit(event) {
    event.preventDefault();
    if (isCelcius) {
        let daysArr = [1, 2, 3, 4, 5, 6];
        daysArr.forEach(function (day){
            let tempDivNextDay = document.querySelector(`#temp-day-${day}`);
            let tempUnitNextDay = document.querySelector(`#temp-unit-day-${day}`);
            let tempNextDay = tempDivNextDay.innerHTML;
            tempDivNextDay.innerHTML = Math.round((tempNextDay * 9) / 5 + 32);
            tempUnitNextDay.innerHTML = "℉";
        });
        let tempText = document.querySelector("#cur-temperature");
        let temp = tempText.innerHTML;
        let tempUnit = document.querySelector("#temp-unit");
        tempText.innerHTML = Math.round((temp * 9) / 5 + 32);
        tempUnit.innerHTML = "℉";
        isCelcius = false;
    }
}

toCelsius.addEventListener("click", convertToCelcius);
toFahrenheit.addEventListener("click", convertToFahrenheit);