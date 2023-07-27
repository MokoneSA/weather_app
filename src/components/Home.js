import './App.css';
// import CurrentWeather from './components/current-weather/CurrentWeather';
import Search from './components/search/Search';
import { WEATHER_API_KEY, WEATHER_API_URL } from './api';
import { useState } from 'react';
import '../current-weather/CurrentWeather.css'
// import Forecast from './components/forecast/Forecast';


function App() {


    const [lat, setLat] = useState([])
    const [long, setLong] = useState([])
    const [data, setData] = useState([])
    const [currentWeather, setCurrentWeather] = useState(null)
    const [forecast, setForecast] = useState(null)


    // Handles search function
    // const handleOnSearchChange = (searchData) => {
    //     const [lat, lon] = searchData.value.split(" ")

    //     const CurrentWeatherFetch = fetch(
    //         `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
    //     );
    //     const forecastFetch = fetch(
    //         `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
    //     )

    //     Promise.all([CurrentWeatherFetch, forecastFetch])
    //         .then(async (response) => {
    //             const weatherResponse = await response[0].json();
    //             const forecastResponse = await response[1].json();

    //             setCurrentWeather({ city: searchData.label, ...weatherResponse });
    //             setForecast({ city: searchData.label, ...forecastResponse });
    //         })
    //         .catch((err) => console.log(err));
    //     console.log(searchData)
    // }

    console.log(currentWeather);
    console.log(forecast)

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

                    setCurrentWeather({ city: searchData.label, ...weatherResponse });
                    setForecast({ city: searchData.label, ...forecastResponse });
                })
                .catch((err) => console.log(err));
        }

        fetchData();

    }, [lat, long])

    return (
        <div className="container">
            <Search onSearchCharge={handleOnSearchChange} />
            <div className="weather">
                <div className="top">
                    <div>
                        <p className="city">{data.city}</p>
                        <p className="weather-description">{data.weather[0].description}</p>
                    </div>
                    <img src={`icons/${data.weather[0].icon}.png`} alt="" className="weather-icon" />
                </div>
                <div className="bottom">
                    <p className="temperature">{Math.round(data.main.temp)}°C</p>
                    <div className="details">
                        <div className="parameter-row">
                            <span className="parameter-label">Details</span>
                        </div>
                        <div className="parameter-row">
                            <span className="parameter-label">Feels like </span>
                            <span className="parameter-value">{data.main.feels_like}°C</span>
                        </div>
                        <div className="parameter-row">
                            <span className="parameter-label">Wind </span>
                            <span className="parameter-value">{data.wind.speed}</span>
                        </div>
                        <div className="parameter-row">
                            <span className="parameter-label">Humidity </span>
                            <span className="parameter-value">{data.main.humidity}</span>
                        </div>
                        <div className="parameter-row">
                            <span className="parameter-label">Pressure </span>
                            <span className="parameter-value">{data.main.pressure}</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* {currentWeather && <CurrentWeather data={currentWeather} />}
      {forecast && <Forecast data={forecast} />} */}
        </div>
    );
}

export default App;
