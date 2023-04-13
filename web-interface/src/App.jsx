import React, { useState, useEffect } from "react";

import "./App.css";

const App = () => {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [soilMoisture, setSoilMoisture] = useState(0);
  const [reedState, setReedState] = useState(false);
  return <div className="home">Heylo Bc</div>;
};

export default App;
