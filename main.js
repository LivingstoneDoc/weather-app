import { getWeatherRequest } from "./data-request.js";
import { UI_ELEMENTS } from "./constants.js";
import {  saveCurrentLocation, loadCurrentLocation, saveFavouriteList, loadFavouriteList } from './storage.js';

let favouriteSet = new Set();

function showSavedLocation() {
    let savedLocation = loadCurrentLocation();
    if (savedLocation) {
        renderLocationForecast(savedLocation);
    } 
loadCurrentLocation();
}
showSavedLocation();

function showSavedFavouriteList() {
    let savedFavouriteArr = loadFavouriteList();
    if (savedFavouriteArr) {
        for (let i = 0; i < savedFavouriteArr.length; i++) {
            favouriteSet.add(savedFavouriteArr[i]);
        }
        // console.log('favouriteSetSaved', favouriteSet);
        renderFavouriteList();
    }
loadFavouriteList();
}
showSavedFavouriteList();

function isLocationNameInFavouriteList(locationName) {
        if (favouriteSet.has(locationName)) {
            UI_ELEMENTS().warningMessage.textContent = `Location "${locationName}" has already been added to Favourite List`;
            throw new Error(UI_ELEMENTS().warningMessage.textContent);
        }
        return favouriteSet.has(locationName);
}

function addToFavouriteList() {
    try {
        isLocationNameInFavouriteList(UI_ELEMENTS().headerName.textContent);
        favouriteSet.add(UI_ELEMENTS().headerName.textContent);
        // console.log('favouriteSet', favouriteSet);
        saveFavouriteList(favouriteSet);
        // console.log('favouriteSet', favouriteSet);
        return favouriteSet;
    } catch {
        UI_ELEMENTS().warningMessage.classList.add('show-warning');
        UI_ELEMENTS().warningMessage.textContent;
        // console.log('Location has been added');
    }
}

function deleteFromFavouriteList(locationName) {
    favouriteSet.forEach(value => {
        if (value === locationName) {
            favouriteSet.delete(value);
        }
        saveFavouriteList(favouriteSet);
    })
    // console.log('favouriteArr', favouriteArr);
    // console.log('favouriteSet', favouriteSet);
    return favouriteSet;
}

function renderFavouriteList() {
    UI_ELEMENTS().favouriteList.innerHTML = '';
    favouriteSet.forEach(listItem => {
            const favouriteItemWrapper = document.createElement('div');
            favouriteItemWrapper.classList.add('favourite-item-wrapper');
            const favouriteItem = document.createElement('li');
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            favouriteItem.textContent = listItem;
            favouriteItem.style.cursor = 'pointer';
            favouriteItemWrapper.append(favouriteItem);
            favouriteItemWrapper.append(deleteBtn);
            UI_ELEMENTS().favouriteList.append(favouriteItemWrapper);

        function handleDeleteBtn(e) {
            e.preventDefault();
            deleteFromFavouriteList(listItem);
            renderFavouriteList();
        }
        deleteBtn.addEventListener('click', handleDeleteBtn);

        function handleLocationItem(e) {
            e.preventDefault();
            saveCurrentLocation(listItem);
            renderLocationForecast(listItem);
        }
        favouriteItem.addEventListener('click', handleLocationItem);
        return UI_ELEMENTS().favouriteList;
    })
}

function handleFavouriteBtn(e) {
        e.preventDefault();
        addToFavouriteList();
        renderFavouriteList();
}
UI_ELEMENTS().favouriteBtn.addEventListener('click', handleFavouriteBtn);

function getTime(timestamp) {
    const milliseconds = new Date(timestamp * 1000);
    let options = {
        hour: '2-digit',
        minute: '2-digit',
    }
    const time = new Intl.DateTimeFormat('ru-RU', options).format(milliseconds);
    return time;
}

async function renderLocationForecast(locationName = UI_ELEMENTS().weatherInput.value) {
    try {
        let locationWeatherData = await (getWeatherRequest(locationName, 'weather'));

        UI_ELEMENTS().locationInfoDetails.innerHTML = '';
        UI_ELEMENTS().temperatureIcon.style.background = `url(https://openweathermap.org/img/wn/${locationWeatherData.weather[0].icon}@2x.png) center center`;
        UI_ELEMENTS().temperatureValue.textContent = Math.trunc(locationWeatherData.main.temp);
        UI_ELEMENTS().headerName.textContent = locationWeatherData.name;
    
        const temperatureFeelsLike = document.createElement('div');
        temperatureFeelsLike.classList.add('details-item', 'feels-like');
        temperatureFeelsLike.textContent = 'Feels like: ';
    
        const feelsLikeTempValue = document.createElement('span');
        feelsLikeTempValue.textContent = Math.trunc(locationWeatherData.main.feels_like);
        temperatureFeelsLike.append(feelsLikeTempValue);
    
        const sunriseTime = document.createElement('div');
        sunriseTime.classList.add('details-item', 'sunrise');
        sunriseTime.textContent = 'Sunrise: ';
    
        const sunriseTimeValue = document.createElement('span');
        sunriseTimeValue.textContent = getTime(locationWeatherData.sys.sunrise)
        sunriseTime.append(sunriseTimeValue);
    
        const sunsetTime = document.createElement('div');
        sunsetTime.classList.add('details-item', 'sunset');
        sunsetTime.textContent = 'Sunset: ';
    
        const sunsetTimeValue = document.createElement('span');
        sunsetTimeValue.textContent = getTime(locationWeatherData.sys.sunset);
        sunsetTime.append(sunsetTimeValue);
    
        UI_ELEMENTS().locationInfoDetails.append(temperatureFeelsLike);
        UI_ELEMENTS().locationInfoDetails.append(sunriseTime);
        UI_ELEMENTS().locationInfoDetails.append(sunsetTime);
        UI_ELEMENTS().warningMessage.classList.remove('show-warning');
        UI_ELEMENTS().locationInfo.classList.add('show-location-info');
        saveCurrentLocation(locationName);

        let locationForecastData = await (getWeatherRequest(locationName, 'forecast'));

        UI_ELEMENTS().locationForecast.innerText = '';
        locationForecastData.list.forEach((item, i) => {
                const forecastItem = document.createElement('div');
                forecastItem.classList.add('location-forecast-item');

                const forecastTime = document.createElement('div');
                forecastTime.classList.add('forecast-time');
                forecastTime.textContent = getTime(locationForecastData.list[i].dt);

                const tempAndIcon = document.createElement('div');
                tempAndIcon.classList.add('forecast-temperature-and-icon');

                const temperatureWrapper = document.createElement('div');
                temperatureWrapper.classList.add('forecast-temperature-wrapper');

                const forecastTemperature = document.createElement('div');
                forecastTemperature.classList.add('forecast-temperature');
                forecastTemperature.textContent = 'Temperature: ';

                const forecastTemperatureValue = document.createElement('span');
                forecastTemperatureValue.textContent = Math.trunc(locationForecastData.list[i].main.temp);
                forecastTemperature.append(forecastTemperatureValue);

                const forecastFeelsLike = document.createElement('div');
                forecastFeelsLike.classList.add('forecast-feels-like');
                forecastFeelsLike.textContent = 'Feels like: '

                const forecastFeelsLikeValue = document.createElement('span');
                forecastFeelsLikeValue.textContent = Math.trunc(locationForecastData.list[i].main.feels_like);

                forecastFeelsLike.append(forecastFeelsLikeValue);
                temperatureWrapper.append(forecastTemperature);
                temperatureWrapper.append(forecastFeelsLike);

                const forecastIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                forecastIcon.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
                forecastIcon.classList.add('forecast-icon');
                forecastIcon.setAttribute('width', '50px');
                forecastIcon.setAttribute('height', '50px');
                forecastIcon.style.background = `url(https://openweathermap.org/img/wn/${locationForecastData.list[i].weather[0].icon}.png) center center`;
                
                tempAndIcon.append(temperatureWrapper);
                tempAndIcon.append(forecastIcon);
                forecastItem.append(forecastTime);
                forecastItem.append(tempAndIcon);
                UI_ELEMENTS().locationForecast.append(forecastItem);
                UI_ELEMENTS().locationInfo.classList.add('show-location-info');
                saveCurrentLocation(locationName);
            })
    } catch(error) {
        UI_ELEMENTS().warningMessage.classList.add('show-warning');
        UI_ELEMENTS().warningMessage.textContent;
        UI_ELEMENTS().locationInfo.classList.remove('show-location-info');
        console.error(error);
    } finally {
        UI_ELEMENTS().weatherForm.reset();
    }
}
UI_ELEMENTS().weatherForm.addEventListener('submit', function(e) {
    e.preventDefault();
    renderLocationForecast(UI_ELEMENTS().weatherInput.value);
});