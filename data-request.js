import { UI_ELEMENTS } from "./constants.js";

function checkResponseStatus(status) {
    if (status === 400) {
        UI_ELEMENTS().warningMessage.textContent = 'Bad requiest';
    }
    if (status === 401) {
        UI_ELEMENTS().warningMessage.textContent = `Something wrong with authorization. 
                        Please, check your api key or try to turn on your VPN, 
                        reload this page and type a location again`;
    }
    if (status === 404) {
        UI_ELEMENTS().warningMessage.textContent = 'Location is not found. Please, check a location name';
    }
    if (status === 500) {
        UI_ELEMENTS().warningMessage.textContent = 'Server error. Please, try later';
    }
    return status;
}

export async function getWeatherRequest(locationName, serverRequest) {
    // const serverUrl = 'https://api.openweathermap.org/data/2.5/weather?';
    const serverUrl = 'https://api.openweathermap.org/data/2.5/';
    const apiKey = 'e5874bb9450e5b527cfe8a7798a9f4af';
    const timestampsLimit = 3;
    const unitsMeasurement = 'metric';
    const url = `${serverUrl}${serverRequest}?q=${locationName}&cnt=${timestampsLimit}&appid=${apiKey}&units=${unitsMeasurement}`;
    
        try {
            let response = await fetch(url);
            checkResponseStatus(response.status)
            return response.json();
        } catch(error) {
            UI_ELEMENTS().warningMessage.classList.add('show-warning');
            UI_ELEMENTS().warningMessage.textContent;
            console.error(error);
        }
}