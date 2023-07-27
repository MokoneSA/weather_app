import { useState, useEffect } from "react";
import Search from "../src/components/search/Search";
import CurrentWeather from "../src/components/current-weather/CurrentWeather";
import Forecast from "../src/components/forecast/Forecast";
import { WEATHER_API_URL, WEATHER_API_KEY } from "./api";
import "./App.css";
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel
} from 'react-accessible-accordion';
import NewsGrid from "./components/News/NewsGrid";

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function App() {

  const dayInAWeek = new Date().getDay();
  const forecastDays = WEEK_DAYS.slice(dayInAWeek, WEEK_DAYS.legnth).concat(WEEK_DAYS.slice(0, dayInAWeek));

  const [currentWeather, setCurrentWeather] = useState(null);
  const [currentForecast, setCurrentForecast] = useState(null);
  const [searchedWeather, setSearchedWeather] = useState();
  const [searchedForecast, setSearchedForecast] = useState();
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(1);
  const [category, setCategory] = useState('general');
  // const [lati, setLati] = useState();
  // const [long, setLong] = useState();
  // const [localData, setLocalData] = useState();
  // const [loData, setLocalData] = useState();


  // Handles search functionality
  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ");

    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
    );
    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
    );

    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forcastResponse = await response[1].json();

        setSearchedWeather({ city: searchData.label, ...weatherResponse });
        setSearchedForecast({ city: searchData.label, ...forcastResponse });
      })
      .catch(console.log)
    console.log(currentWeather)
    console.log(currentForecast)
  };



  useEffect(() => {

    const fetchData = async () => {
      try {
        let localLat, localLong;

        // Wrap getCurrentPosition() method in a Promise that resolves with location data
        const getPosition = () => {
          return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
        }

        // Await Promise to complete and assign location data to variables
        const position = await getPosition();
        localLat = position.coords.latitude;
        localLong = position.coords.longitude;

        // Use location data to construct API URL and fetch weather information
        await fetch(`${WEATHER_API_URL}/weather/?lat=${localLat}&lon=${localLong}&APPID=${WEATHER_API_KEY}`)
          .then(res => res.json())
          .then(result => {
            let localWeather = result;
            setCurrentWeather(localWeather);
            console.log("checking", localWeather);
          });
        await fetch(`${WEATHER_API_URL}/forecast?lat=${localLat}&lon=${localLong}&appid=${WEATHER_API_KEY}`)
          .then(res => res.json())
          .then(result => {
            let localForecast = result;
            setCurrentForecast(localForecast);
            console.log("checking", localForecast);
          });
      } catch (err) {
        console.log(err)
      }
    }

    fetchData();

  }, [])



  // useEffect(() => {
  //   fetch(`https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=b31433a3fbcc4089a3d505d1ebcec18a`)
  //     .then(res => res.json())
  //     .then(data => setItems(data.articles))
  // }, [category])


  return (
    <div className="container">
      <div className="search-section">
        <Search onSearchChange={handleOnSearchChange} />
      </div>
      <div>
        {searchedWeather && <CurrentWeather data={searchedWeather} />}
        {searchedForecast && <Forecast data={searchedForecast} />}
      </div>
      {currentWeather && <div className="weather local">
        <div className="top">
          <div>
            <p className="city">{currentWeather.name}</p>
            <p className="weather-description">{currentWeather.weather[0].description}</p>
          </div>
          <img src={`icons/${currentWeather.weather[0].icon}.png`} alt="" className="weather-icon" />
        </div>
        <div className="bottom">
          <p className="temperature">{Math.round(currentWeather.main.temp)}°C</p>
          <div className="details">
            <div className="parameter-row">
              <span className="parameter-label">Details</span>
            </div>
            <div className="parameter-row">
              <span className="parameter-label">Feels like </span>
              <span className="parameter-value">{currentWeather.main.feels_like}°C</span>
            </div>
            <div className="parameter-row">
              <span className="parameter-label">Wind </span>
              <span className="parameter-value">{currentWeather.wind.speed}</span>
            </div>
            <div className="parameter-row">
              <span className="parameter-label">Humidity </span>
              <span className="parameter-value">{currentWeather.main.humidity}</span>
            </div>
            <div className="parameter-row">
              <span className="parameter-label">Pressure </span>
              <span className="parameter-value">{currentWeather.main.pressure}</span>
            </div>
          </div>
        </div>
      </div>}
      <div className="local-forecast">
        <label className="local-title">Daily</label>
        {currentForecast && <Accordion allowZeroExpanded>
          {currentForecast.list.splice(0, 7).map((item, index) => (
            <AccordionItem key={index}>
              <AccordionItemHeading>
                <AccordionItemButton>
                  <div className="daily-item">
                    <img alt="weather" className="icon-small" src={`icons/${item.weather[0].icon}.png`} />
                    <label className="day">{forecastDays[index]}</label>
                    <label className="day">{item.weather[0].description}</label>
                    <label className="day">{Math.round(item.main.temp_min)}°C / {Math.round(item.main.temp_max)}°C</label>
                    <label className="day"></label>
                  </div>
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <div className="daily-details-grid">
                  <div className="daily-details-grid">
                    <label>Pressure:</label>
                    <label>{item.main.pressure}</label>
                  </div>
                  <div className="daily-details-grid-item">
                    <label>Humidity:</label>
                    <label>{item.main.humidity}</label>
                  </div>
                  <div className="daily-details-grid-item">
                    <label>Clouds:</label>
                    <label>{item.clouds.all}%</label>
                  </div>
                  <div className="daily-details-grid-item">
                    <label>Wind speed:</label>
                    <label>{item.wind.speed} m/s</label>
                  </div>
                  <div className="daily-details-grid-item">
                    <label>Sea level:</label>
                    <label>{item.main.sea_level}m</label>
                  </div>
                  <div className="daily-details-grid-item">
                    <label>Feels like:</label>
                    <label>{item.main.feels_like}°C</label>
                  </div>
                </div>
              </AccordionItemPanel>
            </AccordionItem>
          ))}
        </Accordion>}
      </div>
      <div>
        <h4>News</h4>
        <NewsGrid items={items}/>
      </div>
    </div>
  );
}

export default App;