const UI_ELEMENTS = {
    weatherForm: document.querySelector('.weather-form'),
    weatherInput: document.querySelector('.weather-input'),
    locationInfo: document.querySelector('.location-info'),
    footerName: document.querySelector('.footer-name'),
    temperatureValue: document.querySelector('.temperature'),
    temperatureIcon: document.querySelector('.temperature-icon'),
    warningMessage: document.querySelector('.warning'),
    loadingMessage: document.querySelector('.loading-message'),
}

function getWeatherRequest(locationName) {
    const serverUrl = 'https://api.openweathermap.org/data/2.5/weather?';
    const apiKey = 'e5874bb9450e5b527cfe8a7798a9f4af';
    const url = `${serverUrl}q=${locationName}&appid=${apiKey}`;
    
    return fetch(url)
        .then(response => {
            if (response.status === 400) {
                UI_ELEMENTS.warningMessage.textContent = 'Bad requiest';
            }
            if (response.status === 401) {
                UI_ELEMENTS.warningMessage.textContent = `Something wrong with authorization. 
                                Please, check your api key or try to turn on your VPN, 
                                reload this page and type a location again`;
            }
            if (response.status === 404) {
                UI_ELEMENTS.warningMessage.textContent = 'Location is not found. Please, check a location name';
            }
            if (response.status === 500) {
                UI_ELEMENTS.warningMessage.textContent = 'Server error. Please, try later';
            }
            return response.json();
        })  
}

function kelvinToCelcius(kelvinTemp) {
    const celciusTemp = Math.trunc(kelvinTemp - 273.15);
    return celciusTemp;
}

function renderLocationForecast(e, locationName = UI_ELEMENTS.weatherInput.value) {
    e.preventDefault();
    getWeatherRequest(locationName)
        .then(data => {
            UI_ELEMENTS.locationInfo.classList.add('show-location-info');
            UI_ELEMENTS.temperatureIcon.style.background = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png) center center`;
            const celciusTemp = kelvinToCelcius(data.main.temp);
            UI_ELEMENTS.temperatureValue.textContent = celciusTemp;
            UI_ELEMENTS.footerName.textContent = data.name;
            UI_ELEMENTS.warningMessage.classList.remove('show-warning');
        })
        .catch(error => {
            UI_ELEMENTS.warningMessage.classList.add('show-warning');
            UI_ELEMENTS.warningMessage.textContent;
            UI_ELEMENTS.locationInfo.classList.remove('show-location-info');
            console.error(error);
        })
        .finally(() => UI_ELEMENTS.weatherForm.reset())
}
UI_ELEMENTS.weatherForm.addEventListener('submit', renderLocationForecast);