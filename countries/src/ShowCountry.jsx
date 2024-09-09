const ShowCountry = ({ name, capital, area, wind, weatherEmoji, totalCountries, temperature, languages, flag, handleShow }) => {
    const usedLanguages = Object.values(languages).map(language => <li key={language}>{language}</li>);
  
    if (totalCountries < 10 && totalCountries > 1) {
      return (
        <div>
          {name} <button onClick={handleShow}>show</button>
        </div>
      );
    } else {
      return (
        <div>
          <h2>{name}</h2>
          <p>Capital {capital}</p>
          <p>Area {area}</p>
          <h3>Languages</h3>
          <ul>{usedLanguages}</ul>
          <img src={flag} alt={`Flag of ${name}`} />
          {totalCountries === 1 && (
            <>
              <h2>Weather in {capital}</h2>
              <p>Temperature {temperature} Celsius</p>
              <img src={weatherEmoji} alt="Weather condition" />
              <p>Wind {wind} km/h</p>
            </>
          )}
        </div>
      );
    }
  };

export default ShowCountry