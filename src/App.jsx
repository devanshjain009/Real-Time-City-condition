import React from "react";

import { useEffect, useState } from "react";

const App = () => {
  const [data, setData] = useState(null);
  const [city, setCity] = useState("Delhi");
  const [search, setSearch] = useState("");
  const[err , setError] = useState("");


  // let search = "delhi";


  useEffect(() => {
    async function getWeather(city) {
      try {
        setError("");
      const apiKey = "72c114d33e4d9abf3761d1f13aeda2f0"; // Replace with your key
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

      const response = await fetch(url);
      const data = await response.json();

      setData(data);
    }
    catch (error) {
      setError(error.message);

    }
    }

    getWeather(city);
  }, [city]);

  return (
    <div className="text-white">
      {(!err && city && data  )  ? (
        <>
          <h1 className="text-white flex justify-center text-center text-2xl">
            Wind Speed: {data.wind.speed}
          </h1>
          <h2 className="text-center ">temperature : {data.main.temp}</h2>
          <h2 className="text-center ">
            Weather : Main : {data.weather[0].main} Description :{" "}
            {data.weather[0].description}{" "}
          </h2>
          <h2 className="text-center ">Rain. : {data.main.temp}</h2>
          <h2></h2>
          <h2></h2>
          <h1>Eenter the city name</h1>
          <input
            type="text"
            onChange={(e) => {
              setSearch(e.target.value);
            }}  
          />
          <button onClick={()=> setCity(search)}>Search</button>
        </>
      ) : 
      err ? (
        <>
          <h1>{err}</h1>
        </>
      ):(
        <>
          <h1>Loading...</h1>
        </>
      )
      }
    </div>
  );
};

export default App;
