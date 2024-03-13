import { useEffect, useState } from "react";
import weatherService from "../services/weather";

const Weather = ({ position }) => {
  const [weather, setWeather] = useState(null);
  const [lat, lon] = position;

  useEffect(() => {
    weatherService.getWeather(lat, lon).then((response) => {
      setWeather(response);
    });
  }, [lat, lon]);

  if (weather) {
    const iconId = weather.weather[0].icon;
    let iconUrl = `https://openweathermap.org/img/wn/${iconId}@2x.png`;

    return (
      <div>
        <div>temperature {weather.main.temp} Celsius</div>
        <div>
          <img src={iconUrl} alt="" height="100px" />
        </div>
        <div>wind {weather.wind.speed} m/s</div>
      </div>
    );
  }
};

export default Weather;
