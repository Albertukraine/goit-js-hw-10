

function fetchCountries(name) {
    return fetch(`https://restcountries.com/v2/name/${name}?fields=capital,population,languages,name,flags
      `);
  };
  export {fetchCountries};