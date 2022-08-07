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

let toCelsius = document.querySelector("#toCelsius");
let toFahrenheit = document.querySelector("#toFahrenheit");
let isCelcius = true;

function convertToCelcius(event) {
    event.preventDefault();
    if (!isCelcius) {
        let tempText = document.querySelector("#cur-temperature");
        let temp = tempText.innerHTML;
        let tempUnit = document.querySelector("#temp-unit");
        tempText.innerHTML = Math.round(((temp - 32) * 5) / 9);
        tempUnit.innerHTML = "℃";
        isCelcius = true;
    }
}

function convertToFahrenheit(event) {
    event.preventDefault();
    if (isCelcius) {
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

for (let i = 1; i <= 6; i++) {
    let nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + i);

    let nextDayDiv = document.querySelector(`#day-${i}`);
    let nextDateDiv = document.querySelector(`#date-${i}`);

    let nextDayOfWeek = days[nextDay.getDay()].toLocaleLowerCase();
    let nextDate = nextDay.getDate();
    let nextDayMonths = months[nextDay.getMonth()].toLocaleLowerCase();
    nextDayDiv.innerHTML = nextDayOfWeek;
    nextDateDiv.innerHTML = `${nextDate} ${nextDayMonths}`;
}

function setCountry(response) {
    let countryDiv = document.querySelector("#country-name");
    countryDiv.innerHTML = response.data.sys.country;
}

function setMinMaxTemp(response) {
    //i have no access to those in openweather api
    let minTempDiv = document.querySelector("#min-temp");
    let maxTempDiv = document.querySelector("#max-temp");
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

function setWeather(response) {
    console.log(response);
    setTemp(response);
    setCity(response);
    setMinMaxTemp(response);
    setCountry(response);
    setWindSpeed(response);
    setHumidity(response);
}

function findCityСurWeather(city) {
    let apiKey = `fb33ec4fa16d64739386bd7d1318cf96`;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    axios.get(apiUrl).then(setWeather);
}

//here I found out that I had no access to daily forecast :(

// function setForecast(response) {
//   console.log(response);
// }

// function findCityWeatherForecast(city) {
//   let apiKey = `fb33ec4fa16d64739386bd7d1318cf96`;
//   let apiUrl = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&units=metric&appid=${apiKey}`;
//   axios.get(apiUrl).then(setForecast);
// }

findCityСurWeather("Kyiv");
//findCityWeatherForecast("Kyiv");

function search(event) {
    event.preventDefault();
    let cityInput = document.querySelector("#input-city");
    if (cityInput.value) {
        findCityСurWeather(cityInput.value);
        // findCityWeatherForecast(cityInput.value);
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