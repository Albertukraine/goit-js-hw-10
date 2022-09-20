import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const refs = {
  formEl: document.querySelector('#search-box'),
  listEl: document.querySelector('.country-list'),
  listItemEl: document.querySelector('.country-info'),
};

// console.log(refs);

function onInput(event) {
  let country = event.target.value;
  let normalizedCountry = country.trim();
  if (normalizedCountry.length === 0) {
    // console.log("clear window");
    refs.listItemEl.innerHTML = '';
    refs.listEl.innerHTML = '';
    return;
  } else {
    // console.log(normalizedCountry);
    fetchCountries(normalizedCountry)
      .then(response => {
        return response.json();
      })
      .then(countries => renderHTML(countries))
      .catch(error =>
        Notify.failure('Oops, there is no country with that name')
      );
  }
}

function renderHTML(countries) {
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }
  for (const country of countries) {
    const langTypes = [];
    for (const lang of country.languages) {
      langTypes.push(lang.name);
    }
    // console.log(langTypes);
    if ((countries.length <= 10) & (countries.length > 1)) {
      //   console.log("RENDER LIST ITEM");

      const listMarkup = countries.map(country => {
        return `<li> <img src = "${country.flags.svg}" height = "20px">${country.name}</li>`;
      });
      refs.listItemEl.innerHTML = ' ';
      refs.listEl.innerHTML = listMarkup;
    } else if (countries.length === 1) {
      const countryCard = `<div>  
<h2><img src = "${country.flags.svg}" height = "30px"> ${country.name}</h2>
<p><b>Capital:</b> ${country.capital}</p>
<p><b>Population:</b> ${country.population}</p>
<p><b>Languages:</b> ${langTypes.join(', ')}</p>
</div>`;
      //   console.log("RENDER CARD");
      refs.listEl.innerHTML = ' ';
      refs.listItemEl.innerHTML = countryCard;
    }
  }
}

refs.formEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
