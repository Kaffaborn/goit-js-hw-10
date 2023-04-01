export function fetchCountries(name) {
    const BASE_URL = 'https://restcountries.com/v3.1/name/';
    fetch(BASE_URL + `${name}?fields=name,capital,population,flags,languages`)
        .then(r => r.json())
}
