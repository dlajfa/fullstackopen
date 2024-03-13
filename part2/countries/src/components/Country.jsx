import Weather from "./Weather";

const Country = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>
        <div>capital {country.capital}</div>
        <div>area {country.area}</div>
      </div>
      <div>
        <h3>languages:</h3>
        <ul>
          {Object.values(country.languages).map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </div>
      <div>
        <img src={country.flags.svg} alt={country.flags.alt} width="150px" />
      </div>
      <h3>Weather in {country.capital}</h3>
      <Weather position={country.capitalInfo.latlng} />
    </div>
  );
};

export default Country;
