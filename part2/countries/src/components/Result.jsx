import Country from "./Country";

const Result = ({ countries, keyword, selected, handleSelection }) => {
  if (keyword === "") {
    return null;
  }

  const filteredCountries = countries.filter((c) =>
    c.name.common.toLowerCase().includes(keyword.toLowerCase())
  );

  if (filteredCountries.length === 0) {
    return <div>no match</div>;
  }

  if (filteredCountries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  }

  if (filteredCountries.length > 1) {
    if (selected) {
      return <Country country={selected} />;
    }

    return (
      <div>
        {filteredCountries.map((c) => (
          <div key={c.name.common}>
            {c.name.common}{" "}
            <button onClick={() => handleSelection(c)}>show</button>
          </div>
        ))}
      </div>
    );
  }

  return <Country country={filteredCountries[0]} />;
};

export default Result;
