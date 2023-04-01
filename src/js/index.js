import '../css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
    inputField: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

refs.inputField.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));


function onSearch(e) {
  e.preventDefault();
  clearRendered();

  const countryName = refs.inputField.value.trim();

  if (!countryName) {
    return;
  }

  fetchCountries(countryName).then(countriesRender)
}

function countriesRender(country) {

  if (country.length > 10) {
    return Notify.info("Too many matches found. Please enter a more specific name.")
  }

  if (country.length > 2 || country.length <= 10) {
    const markupList = country.map(({ name, flags }) => {
      return `<li class="country-list__item">
        <img class="country-list__image" src="${flags.svg}" width = "80" alt="${flags.alt}">
        <h2 class="country-list__title">${name.official}</h2>
        </li>`
    })
      .join('');
    refs.countryList.insertAdjacentHTML('beforeend', markupList)
  }

  if (country.length === 1) {
    const markup = country.map(({ name, capital, population, flags, languages }) => {
      return `<div class="country-info__heading">
            <img class="country-info__image" src="${flags.svg}" width ="80" alt="${flags.alt}">
            <h2>${name.official}</h2>
        </div>
        <div>
            <p><b>Capital:</b> ${capital}</p>
            <p><b>Population:</b> ${population}</p>
            <p><b>Languages:</b> ${Object.values(languages).join(', ')}</p>
        </div>`
    })
    clearRendered();
    refs.countryInfo.insertAdjacentHTML('beforeend', markup)
  }

  if (!country.length) {
    return Notify.failure('Oops, there is no country with that name');
  };
}

function clearRendered() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

