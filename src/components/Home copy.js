import '../components/Home.css';
import CurrentWeather from './components/current-weather/CurrentWeather';
import Search from './components/search/Search';
import { WEATHER_API_KEY, WEATHER_API_URL } from './api';
import { useState } from 'react';
import Forecast from './components/forecast/Forecast';


function App() {

  const [lat, setLat] = useState([])
  const [long, setLong] = useState([])
  const [data, setData] = useState([])
  const [currentWeather, setCurrentWeather] = useState();
  const [forecast, setForecast] = useState()
  const [searchedWeather, setSearchWeather] = useState()
  const [searchedForecast, setSearchedForecast] = useState()


  // Handles search function
  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ")

    const CurrentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
      );
    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
      )

    Promise.all([CurrentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        setSearchWeather({ city: searchData.label, ...weatherResponse });
        setSearchedForecast({ city: searchData.label, ...forecastResponse });
      })
      .catch((err) => console.log(err));
    console.log(searchData)
  }


  console.log(currentWeather);
  console.log(forecast)

  // Handles useEffect Hook
  useEffect(() => {

    const fetchData = async () => {
      navigator.geolocation.getCurrentPosition(function (position) {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      });


      const currentLocalWeatherFetch = fetch(
        `${WEATHER_API_URL}/weather?lat=${lat}&lon=${long}&appid=${WEATHER_API_KEY}`
      );
      const localForecastFetch = fetch(
        `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${long}&appid=${WEATHER_API_KEY}`
      )

      Promise.all([currentLocalWeatherFetch, localForecastFetch])
        .then(async (response) => {
          const weatherResponse = await response[0].json();
          const forecastResponse = await response[1].json();

          setSearchedWeather({ city: searchData.label, ...weatherResponse });
          setSearchedForecast({ city: searchData.label, ...forecastResponse });
        })
        .catch((err) => console.log(err));
    }

    fetchData();

  }, [])



  return (
    <div className="container">
      <Search onSearchCharge={handleOnSearchChange} />
      {currentWeather && <CurrentWeather data={currentWeather} />}
      {forecast && <Forecast data={forecast} />}
    </div>
  );
}

export default App;
