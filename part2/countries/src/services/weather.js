import axios from "axios";

const url = "https://api.openweathermap.org/data/2.5/weather?units=metric&";
const appid = import.meta.env.VITE_APPID;

const getWeather = (lat, lon) =>
  axios
    .get(`${url}lat=${lat}&lon=${lon}&appid=${appid}`)
    .then((response) => response.data);

export default { getWeather };
