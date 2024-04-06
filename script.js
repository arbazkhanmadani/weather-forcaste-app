const weather = document.querySelector('.weather');
const searchBtn = document.querySelector('button[role="search"]');
const cityField = document.querySelector('input[type="search"]');
const forecastRow = document.querySelector('.forecast > .row');
const dateElement = document.querySelector('.header__date');
const geolocateIcons = document.querySelectorAll('.header__geolocate');

const icons = {
  '01d': 'wi-day-sunny',
  '02d': 'wi-day-cloudy',
  '03d': 'wi-cloud',
  '04d': 'wi-cloudy',
  '09d': 'wi-showers',
  '10d': 'wi-rain',
  '11d': 'wi-thunderstorm',
  '13d': 'wi-snow',
  '50d': 'wi-fog',
  '01n': 'wi-night-clear',
  '02n': 'wi-night-alt-cloudy',
  '03n': 'wi-cloud',
  '04n': 'wi-night-cloudy',
  '09n': 'wi-night-showers',
  '10n': 'wi-night-rain',
  '11n': 'wi-night-thunderstorm',
  '13n': 'wi-night-alt-snow',
  '50n': 'wi-night-fog',
};


function printTodayDate() {
  const today = new Date();
  const options = {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  };
  dateElement.insertAdjacentText('afterbegin', today.toLocaleString('en-us', options));
}



function getWeekDay(date) {
  
  /*const options = { weekday: 'long' };
  return date.toLocaleString('en-us', options);
  */
 
  
}

/*function getDayName(dateStr, locale)
{
    var date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: 'long' });        
}*/



function removeChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}



let dayArr =  ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"]
function renderForecast(forecast) {
  removeChildren(forecastRow);
  console.log(forecast)

  forecast.forEach((weatherData,i) => {
    
    const markup = `

    <div class="forecast__day">
      <ul>
        <li ><h3 class="forecast__date"> ${dayArr[i++]} </h3></li>
        <i class='wi ${icons[weatherData.weather[0].icon]} forecast__icon'></i>
        <li>
          <p class="forecast__temp">${Math.floor(weatherData.main.temp)}°C</p>
          <p class="forecast__desc">${weatherData.weather[0].main}</p>
        </li>
      </ul>

    </div>`;

    forecastRow.insertAdjacentHTML('beforeend', markup);
  });
}



function getForecast(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      
      let Only7DaysArray = data.list.slice(0,7)
      renderForecast(Only7DaysArray);
    });
}



function getCityWeather(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const markup = `<h1 class="location">${data.name}, ${data.sys.country}</h1>
 <div class="weather__summary">
    <p><i class="wi ${icons[data.weather[0].icon]} weather-icon"></i> <span class="weather__celsius-value">${Math.floor(data.main.temp)}°C</span></p>
    <p>${data.weather[0].main}</p>
    <ul class="weather__miscellaneous">
    <li><i class="wi wi-humidity"></i> Humidity  <span>${data.main.humidity}%</span></li>
    <li><i class="wi wi-small-craft-advisory"></i> Wind Speed <span>${data.wind.speed} m/s</span></li>
    </ul>
 </div>
 `;
      removeChildren(weather);
      weather.insertAdjacentHTML('beforeend', markup);
    })
    .catch((error) => {
      console.log(error);
    });
}



function getWeatherByCoordinates(latitude, longitude) {
  getCityWeather(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=35b1f1d45a7b4378cf2430ae601816be&units=metric`);
}

function getForecastByCoordinates(latitude, longitude) {
  getForecast(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&APPID=35b1f1d45a7b4378cf2430ae601816be&units=metric`);
}

function getWeatherByCity(city) {
  getCityWeather(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=35b1f1d45a7b4378cf2430ae601816be&units=metric`);
}

function getForecastByCity(city) {
  getForecast(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=35b1f1d45a7b4378cf2430ae601816be&units=metric`);
}


function geosuccess(position) {
  const { latitude, longitude } = position.coords;
  getWeatherByCoordinates(latitude, longitude);
  getForecastByCoordinates(latitude, longitude);
}



printTodayDate();
searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  getWeatherByCity(cityField.value);
  getForecastByCity(cityField.value);
});


geolocateIcons.forEach((icon) => {
  icon.addEventListener('click', (e) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(geosuccess);
    } else {
      alert('Your browser does not support geolocation.');
    }
  });
});
