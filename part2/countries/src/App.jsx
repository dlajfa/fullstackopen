import { useState, useEffect } from "react";
import countryService from "./services/countries";
import Result from "./components/Result";

const App = () => {
  const [countries, setCountries] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    countryService.getAll().then((countries) => {
      setCountries(countries);
    });
  }, []);

  const handleFilterChange = (event) => {
    setKeyword(event.target.value);
    setSelected(null);
  };

  const handleSelection = (country) => {
    setSelected(country);
  };

  if (!countries) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <label>
          find countries <input value={keyword} onChange={handleFilterChange} />
        </label>
      </div>
      <Result
        countries={countries}
        keyword={keyword}
        selected={selected}
        handleSelection={handleSelection}
      />
    </div>
  );
};

export default App;
