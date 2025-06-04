(async function () {
  const UL_ID = 'country-list';

  // ---------- 1. Detect country ----------
  async function detectCountry() {
    try {
      // Free tier: 1000 reqs/day, returns JSON like { country_code: "AO" }
      const res = await fetch('https://ipapi.co/json/');
      if (!res.ok) throw new Error('Geolocation request failed');
      const data = await res.json();
      if (data.country_name) return data.country_name;         // "Angola"
    } catch (err) {
      // Silent fallback to browser locale
      const locale = navigator.language || navigator.userLanguage; // "en-US"
      if (locale && locale.includes('-')) {
        // crude ISO-2 country from locale
        return locale.split('-')[1];                            // "US"
      }
    }
    return null; // Unknown
  }

  // ---------- 2. Reorder the <li> ----------
  function moveCountryToTop(countryName) {
    if (!countryName) return;
    const ul = document.getElementById(UL_ID);
    if (!ul) return;

    const items = ul.querySelectorAll('li[data-country]');
    for (const li of items) {
      // Case-insensitive comparison (handles codes like "AO" OR full names)
      const liCountry = li.getAttribute('data-country');
      if (
        liCountry &&
        liCountry.toLowerCase() === countryName.toLowerCase()
      ) {
        // Put this <li> first
        ul.insertBefore(li, ul.firstChild);
        break;
      }
    }
  }

  // ---------- 3. Wire it all together ----------
  const visitorCountry = await detectCountry(); // e.g. "Angola"
  moveCountryToTop(visitorCountry);
})();
