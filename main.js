import { getWeatherRequest } from "./data-request.js";
import { UI_ELEMENTS } from "./constants.js";

const favouriteArr = [];

function isLocationNameInFavouriteList(locationName) {
    const foundLocation = favouriteArr.find(item => {
        if (item === locationName) {
            UI_ELEMENTS().warningMessage.textContent = `Location "${locationName}" has already been added to Favourite List`;
            return foundLocation;
        }    
    });
}

function addToFavouriteList() {
    try {
        isLocationNameInFavouriteList(UI_ELEMENTS().footerName.textContent);
        favouriteArr.push(UI_ELEMENTS().footerName.textContent);
        //console.log(favouriteArr);
        return favouriteArr;
    } catch {
        UI_ELEMENTS().warningMessage.classList.add('show-warning');
        UI_ELEMENTS().warningMessage.textContent;
    }
}

function deleteFromFavouriteList(locationName) {
    favouriteArr.find((item, i, arr) => {
        if (item === locationName) {
            arr.splice(i, 1);
        }
    });
    //console.log(favouriteArr);
    return favouriteArr;
}

function renderFavouriteList() {
    UI_ELEMENTS().favouriteList.innerHTML = '';
    favouriteArr.forEach(listItem => {
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
            renderLocationForecast(e, listItem);
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

function kelvinToCelcius(kelvinTemp) {
    const celciusTemp = Math.trunc(kelvinTemp - 273.15);
    return celciusTemp;
}

function renderLocationForecast(e, locationName = UI_ELEMENTS().weatherInput.value) {
    e.preventDefault();
    getWeatherRequest(locationName)
        .then(data => {
            UI_ELEMENTS().locationInfo.classList.add('show-location-info');
            UI_ELEMENTS().temperatureIcon.style.background = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png) center center`;
            const celciusTemp = kelvinToCelcius(data.main.temp);
            UI_ELEMENTS().temperatureValue.textContent = celciusTemp;
            UI_ELEMENTS().footerName.textContent = data.name;
            UI_ELEMENTS().warningMessage.classList.remove('show-warning');
        })
        .catch(error => {
            UI_ELEMENTS().warningMessage.classList.add('show-warning');
            UI_ELEMENTS().warningMessage.textContent;
            UI_ELEMENTS().locationInfo.classList.remove('show-location-info');
            console.error(error);
        })
        .finally(() => UI_ELEMENTS().weatherForm.reset())
}
UI_ELEMENTS().weatherForm.addEventListener('submit', renderLocationForecast);