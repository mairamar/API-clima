import React, { useState, useEffect } from 'react';
import './App.css';

const API_KEY = '30d38b26954359266708f92e1317dac0';
/*
const datoInicio = {
  name: 'fotoInicio',
  country: 'inicio',
  icon: 'inicio',
  temp: 'inicio',
  temp_min: 'inicio',
  temp_max: 'inicio',
  humidity: 'inicio',
};
*/

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [ciudadSelec, setCiudadSelec] = useState('');
  const [buscarInput, setBuscarInput] = useState('');

  const fetchWeatherData = async (city) => {
    if (!city) return;
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data: ', error);
    }
  };

  const saveSearchHistory = async (city) => {
    try {
      const response = await fetch('http://localhost:5000/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city }),
      });
      if (!response.ok) {
        throw new Error('Failed to save search');
      }
    } catch (error) {
      console.error('Error saving search history: ', error);
    }
  };

  useEffect(() => {
    fetchWeatherData(ciudadSelec);
  }, [ciudadSelec]);


  const handleSearchInputChange = (event) => {
    setBuscarInput(event.target.value);
  };

  const handleSearch = () => {
    if (buscarInput.trim() === '') {
      return;
    }
    setCiudadSelec(buscarInput);
    saveSearchHistory(buscarInput);
    setBuscarInput('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <nav>
        <ul>
          <li className="li-clima">
            <strong>CLIMA</strong>
          </li>
        </ul>
      </nav>
      <input
        type="search"
        name="search"
        placeholder="Search"
        aria-label="Search"
        value={buscarInput}
        onChange={handleSearchInputChange}
        onKeyDown={handleKeyDown}
      />
        <article> 
        {( weatherData && (
          <div>
            <p className="p-nombre">
              {weatherData.name + ', ' + weatherData.sys.country}
            </p>
            <div className="icono">
              <img
                src={`${import.meta.env.BASE_URL}src/iconos/openweathermap/${weatherData.weather[0].icon}.svg`}
                alt="weather icon"
              />
            </div>
            <p className="p-temperatura">
              Temperatura: {weatherData.main.temp}°C
            </p>
            <p className="p-min-max">
              Mínima: {weatherData.main.temp_min}°C / Máxima: {weatherData.main.temp_max}°C
            </p>
            <p className="p-humedad">Humedad: {weatherData.main.humidity}%</p>
          </div>
        ))
        ||(
          <article>
          <img className='Inicio' src="https://i.pinimg.com/736x/b7/77/ac/b777ac3e9d8974cd03688caeef3e3609.jpg" alt="" />
        </article>
        )}
      </article>
    </>
  );
};

export default App;