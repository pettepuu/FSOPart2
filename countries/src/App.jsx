import { useState, useEffect } from 'react';
import countryService from './countryService';
import ShowCountry from './ShowCountry'

function App() {
  const [newCountry, setNewCountry] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    countryService
      .getAll()
      .then(availableCountries => {
        setCountries(availableCountries.data);
      })
      .catch(error => console.error('Error fetching countries:', error));
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      countryService
        .getWeather(selectedCountry.capital[0])
        .then(weather => {
          setWeatherData(weather.data);
        })
    }
  }, [selectedCountry]);

  const countriesToShow = newCountry
    ? countries.filter(country => country.name.common.toLowerCase().includes(newCountry.toLowerCase()))
    : countries;

  const handleCountryChange = (event) => {
    setNewCountry(event.target.value);
    setSelectedCountry(null);
  };

  const handleShowCountry = (country) => {
    setSelectedCountry(country);
    countryService
      .getWeather(country.capital[0])
      .then(weather => {
        setWeatherData(weather.data);
      })
  };

  useEffect(() => {
    if (countriesToShow.length === 1) {
      const country = countriesToShow[0];
      handleShowCountry(country);
      setSelectedCountry(country);
    }
  }, [countriesToShow]);

  return (
    <div>
      <p>
        find countries <input value={newCountry} onChange={handleCountryChange} />
      </p>
      {countriesToShow.length > 10 && <p>Too many matches, specify another filter</p>}
      {countriesToShow.length <= 10 && countriesToShow.length > 1 && countriesToShow.map(country =>
        <ShowCountry
          key={country.ccn3}
          name={country.name.common}
          capital={country.capital}
          area={country.area}
          languages={country.languages}
          totalCountries={countriesToShow.length}
          flag={country.flags.png}
          handleShow={() => handleShowCountry(country)}
        />
      )}
      {selectedCountry && weatherData && (
        <ShowCountry
          name={selectedCountry.name.common}
          capital={selectedCountry.capital}
          area={selectedCountry.area}
          languages={selectedCountry.languages}
          totalCountries={1}
          flag={selectedCountry.flags.png}
          temperature={weatherData.current.temp_c}
          weatherEmoji={weatherData.current.condition.icon}
          wind={weatherData.current.wind_kph}
        />
      )}
    </div>
  );
}

export default App;
