import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import moment from "moment";
import "moment-timezone";
import {
  FaThermometerHalf,
  FaTint,
  FaSeedling,
  FaDoorClosed,
  FaDoorOpen,
  FaPowerOff,
  FaWater,
} from "react-icons/fa";
import { BiCheckboxSquare, BiCheckbox } from "react-icons/bi";
import Plot from "react-plotly.js";

export default function Dashboard() {
  const [ngrokUrl, setNgrokUrl] = useState("http://localhost:8888");
  const [urlSet, setUrlSet] = useState(false);

  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [soilMoisture, setSoilMoisture] = useState(0);
  const [reedState, setReedState] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  const [relayStates, setRelayStates] = useState({
    relay1: false,
    relay2: false,
  });
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [soilMoistureData, setSoilMoistureData] = useState([]);
  const [timeData, setTimeData] = useState([]);

  const toggleRelay = async (relayNumber, newState) => {
    await axios.post(
      `${ngrokUrl}/relay${relayNumber}/${newState ? "on" : "off"}`
    );
    setRelayStates({ ...relayStates, [`relay${relayNumber}`]: newState });
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (ngrokUrl !== "") {
      setUrlSet(true);
    }
  };

  const getData = async () => {
    await axios.get(`${ngrokUrl}/data`).then((response) => {
      setTemperature(response.data.temperature);
      setHumidity(response.data.humidity);
      setSoilMoisture(response.data.soil_moisture);
      setReedState(response.data.reed_switch_state);
      setCurrentTime(moment().tz("Asia/Kolkata").format("hh:mm:ss A"));

      setTemperatureData((prevData) => [
        ...prevData,
        { x: new Date(), y: response.data.temperature },
      ]);
      setHumidityData((prevData) => [
        ...prevData,
        { x: new Date(), y: response.data.humidity },
      ]);
      setSoilMoistureData((prevData) => [
        ...prevData,
        { x: new Date(), y: response.data.soil_moisture },
      ]);
    });
  };

  useEffect(() => {
    setInterval(getData, 2000);
  }, []);
  return (
    <div className="min-h-screen bg-gray-600 py-6 flex flex-col justify-center sm:py-12">
      {urlSet ? (
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleUrlSubmit}>
            <label
              htmlFor="ngrokUrl"
              className="block text-sm font-medium text-gray-700"
            >
              Enter Ngrok URL
            </label>
            <input
              type="text"
              id="ngrokUrl"
              value={ngrokUrl}
              onChange={(e) => setNgrokUrl(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-indigo-500 text-gray-800 rounded shadow"
            >
              Submit
            </button>
          </form>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mt-4 mb-8">
            <h2 className="text-3xl font-semibold text-gray-100">
              Smart Home Automation Dashboard
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-gray-700 rounded-xl p-4">
              <FaThermometerHalf className="text-3xl text-green-500 mb-2" />
              <h3 className="text-xl font-semibold text-gray-100 mb-2">
                Temperature
              </h3>
              <p className="text-2xl font-semibold text-gray-100">
                {temperature}°C
              </p>
            </div>
            <div className="bg-gray-700 rounded-xl p-4">
              <FaTint className="text-3xl text-blue-500 mb-2" />
              <h3 className="text-xl font-semibold text-gray-100 mb-2">
                Humidity
              </h3>
              <p className="text-2xl font-semibold text-gray-100">
                {humidity}%
              </p>
            </div>
            <div className="bg-gray-700 rounded-xl p-4">
              <FaSeedling className="text-3xl text-yellow-500 mb-2" />
              <h3 className="text-xl font-semibold text-gray-100 mb-2">
                Soil Moisture
              </h3>
              <p className="text-2xl font-semibold text-gray-100">
                {soilMoisture}%
              </p>
            </div>
          </div>{" "}
          <div className="mt-8">
            <div className="bg-gray-800 rounded-xl p-4">
              <h3 className="text-xl font-semibold text-gray-100 mb-2">
                Door State
              </h3>
              <div className="flex items-center">
                {reedState ? (
                  <FaDoorClosed className="text-3xl text-green-500" />
                ) : (
                  <FaDoorOpen className="text-3xl text-red-500" />
                )}
                <p className="text-2xl font-semibold ml-4">
                  {reedState ? "Closed" : "Open"}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-xl p-4">
              <h3 className="text-xl font-semibold text-gray-100 mb-2">
                Relay 1 Control
              </h3>
              <div className="flex">
                <button
                  onClick={() => toggleRelay(1, !relayStates.relay1)}
                  className={`px-3 py-2 mr-2 ${
                    relayStates.relay1 ? "bg-red-500" : "bg-green-500"
                  } text-gray-800 rounded shadow`}
                  disabled={relayStates.relay1}
                >
                  {relayStates.relay1 ? "OFF" : "ON"}
                </button>
                <button
                  onClick={() => toggleRelay(2, !relayStates.relay2)}
                  className={`px-3 py-2 ${
                    relayStates.relay2 ? "bg-red-500" : "bg-green-500"
                  } text-gray-800 rounded shadow`}
                  disabled={relayStates.relay2}
                >
                  {relayStates.relay2 ? "OFF" : "ON"}
                </button>
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4">
              <h3 className="text-xl font-semibold text-gray-100 mb-2">
                Relay 2 Control
              </h3>
              <div className="flex">
                <button
                  onClick={() => toggleRelay(1, !relayStates.relay1)}
                  className={`px-3 py-2 mr-2 ${
                    relayStates.relay1 ? "bg-red-500" : "bg-green-500"
                  } text-gray-800 rounded shadow`}
                  disabled={relayStates.relay1}
                >
                  {relayStates.relay1 ? "OFF" : "ON"}
                </button>
                <button
                  onClick={() => toggleRelay(2, !relayStates.relay2)}
                  className={`px-3 py-2 ${
                    relayStates.relay2 ? "bg-red-500" : "bg-green-500"
                  } text-gray-800 rounded shadow`}
                  disabled={relayStates.relay2}
                >
                  {relayStates.relay2 ? "OFF" : "ON"}
                </button>
              </div>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-100 mb-4">
                Temperature Trend
              </h4>
              <Plot
                className="overflow-hidden w-full h-[350px] flex-auto"
                data={[
                  {
                    x: temperatureData.map((data) => data.x),
                    y: temperatureData.map((data) => data.y),
                    type: "scatter",
                    mode: "lines",
                    marker: { color: "red" },
                  },
                ]}
                layout={{
                  width: "100%",
                  height: 350,
                  plot_bgcolor: "#2d3748",
                  paper_bgcolor: "#2d3748",
                  font: {
                    color: "white",
                  },
                  xaxis: {
                    showgrid: false,
                    zeroline: false,
                  },
                  yaxis: {
                    showgrid: false,
                    zeroline: false,
                  },
                }}
              />
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-100 mb-4">
                Humidity Trend
              </h4>
              <Plot
                className="overflow-hidden w-full h-[350px] flex-auto"
                data={[
                  {
                    x: humidityData.map((data) => data.x),
                    y: humidityData.map((data) => data.y),
                    type: "scatter",
                    mode: "lines",
                    marker: { color: "blue" },
                  },
                ]}
                config={{
                  responsive: true,
                  displaylogo: false,
                  modeBarButtonsToRemove: [
                    "zoom2d",
                    "pan2d",
                    "select2d",
                    "lasso2d",
                    "zoomIn2d",
                    "zoomOut2d",
                    "autoScale2d",
                    "resetScale2d",
                    "hoverClosestCartesian",
                    "hoverCompareCartesian",
                    "toggleSpikelines",
                  ],
                }}
                layout={{
                  title: { text: "text" },
                  xaxis: {
                    title: "Time",
                    showgrid: false,
                    showticklabels: true,
                  },
                  yaxis: { title: "ff", showline: false },
                  margin: { t: 50, b: 40, l: 50, r: 20 },
                  autosize: true,
                  showlegend: false,
                  dragmode: false,
                  hovermode: "closest",
                  plot_bgcolor: "#F1F1F1",
                  paper_bgcolor: "#F1F1F1",
                }}
              />
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-100 mb-4 w-fit">
                Soil Moisture Trend
              </h4>
              <Plot
                className="overflow-y-scroll w-inherit h-[300px] flex-auto"
                data={[
                  {
                    x: soilMoistureData.map((data) => data.x),
                    y: soilMoistureData.map((data) => data.y),
                    type: "scatter",
                    mode: "lines",
                    marker: { color: "green" },
                  },
                  {
                    type: "bar",
                    x: soilMoistureData.map((data) => data.x),
                    y: soilMoistureData.map((data) => data.y),
                  },
                ]}
                layout={{
                  width: "100%",
                  height: 350,
                  plot_bgcolor: "#2d3748",
                  paper_bgcolor: "#2d3748",
                  font: {
                    color: "white",
                  },
                  xaxis: {
                    showgrid: false,
                    zeroline: false,
                  },
                  yaxis: {
                    showgrid: false,
                    zeroline: false,
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
