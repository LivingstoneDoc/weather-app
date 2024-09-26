export function saveCurrentLocation(currentLocation) {
    return localStorage.setItem('savedCurrentLocation', JSON.stringify(currentLocation));
}

export function loadCurrentLocation() {
    return JSON.parse(localStorage.getItem('savedCurrentLocation'));
}

export function saveFavouriteList(favouriteList) {
    return localStorage.setItem('savedFavouriteList', JSON.stringify([...favouriteList]));
}

export function loadFavouriteList() {
    return JSON.parse(localStorage.getItem('savedFavouriteList'));
}
// loadFavouriteList();