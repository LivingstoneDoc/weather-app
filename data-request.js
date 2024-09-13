import { UI_ELEMENTS } from "./constants.js";

export function getWeatherRequest(locationName, serverRequest) {
    // const serverUrl = 'https://api.openweathermap.org/data/2.5/weather?';
    const serverUrl = 'https://api.openweathermap.org/data/2.5/';
    const apiKey = 'e5874bb9450e5b527cfe8a7798a9f4af';
    const url = `${serverUrl}${serverRequest}?q=${locationName}&cnt=3&appid=${apiKey}`;
    
    return fetch(url)
        .then(response => {
            if (response.status === 400) {
                UI_ELEMENTS().warningMessage.textContent = 'Bad requiest';
            }
            if (response.status === 401) {
                UI_ELEMENTS().warningMessage.textContent = `Something wrong with authorization. 
                                Please, check your api key or try to turn on your VPN, 
                                reload this page and type a location again`;
            }
            if (response.status === 404) {
                UI_ELEMENTS().warningMessage.textContent = 'Location is not found. Please, check a location name';
            }
            if (response.status === 500) {
                UI_ELEMENTS().warningMessage.textContent = 'Server error. Please, try later';
            }
            return response.json();
        })  
}