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
  const [ngrokUrl, setNgrokUrl] = useState("http://0.tcp.in.ngrok.io:15416");
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
    console.log(ngrokUrl);
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
    setInterval(getData, 3000);
  }, []);
  return (
    <div className="min-h-screen bg-gray-800 py-6 flex flex-col justify-center sm:py-10">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-start mt-4 mb-8">
          <h2 className="text-3xl font-semibold text-gray-100">
            Smart Home Dashboard
          </h2>
          <h2 className="text-sm text-gray-400">
            Connecting...
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-6 w-full">
          <div className="bg-gray-700 rounded-xl p-4 border-4 border-green-500">
            <FaThermometerHalf className="text-3xl text-green-500 mb-2" />
            <h3 className="text-xl font-semibold text-gray-100 mb-2">
              Temperature
            </h3>
            <p className="text-2xl font-semibold text-gray-100">
              {temperature}°C
            </p>
          </div>
          <div className="bg-gray-700 rounded-xl p-4 border-4 border-blue-500">
            <FaTint className="text-3xl text-blue-500 mb-2" />
            <h3 className="text-xl font-semibold text-gray-100 mb-2">
              Humidity
            </h3>
            <p className="text-2xl font-semibold text-gray-100">{humidity}%</p>
          </div>
          <div className="bg-gray-700 rounded-xl p-4 border-4 border-yellow-500">
            <FaSeedling className="text-3xl text-yellow-500 mb-2" />
            <h3 className="text-xl font-semibold text-gray-100 mb-2">
              Soil Moisture
            </h3>
            <p className="text-2xl font-semibold text-gray-100">
              {soilMoisture}%
            </p>
          </div>
        </div>{" "}
        <div className="grid grid-cols-3 gap-6 w-full mt-8">
          <div className="bg-gray-700 rounded-xl p-4">
            <h3 className="text-xl font-semibold text-gray-100 mb-2">
              Door State
            </h3>
            <div className="flex items-center">
              {reedState ? (
                <FaDoorClosed className="text-3xl text-green-500" />
              ) : (
                <FaDoorOpen className="text-3xl text-red-500" />
              )}
              <p
                className={`text-2xl font-semibold ml-4 ${
                  reedState ? "text-green-500" : "text-red-500"
                }`}
              >
                {reedState ? "Closed" : "Open"}
              </p>
            </div>
          </div>
          <div className="bg-gray-700 rounded-xl p-4">
            <h3 className="text-xl font-semibold text-gray-100 mb-2">
              Appliance 1 Control
            </h3>
            <div className="flex">
              <button
                onClick={() => toggleRelay(1, !relayStates.relay1)}
                className={`px-3 py-2 mr-2 ${
                  relayStates.relay1 ? "bg-red-500" : "bg-green-500"
                } text-gray-800 rounded shadow`}
              >
                {relayStates.relay1 ? "OFF" : "ON"}
              </button>
            </div>
          </div>
          <div className="bg-gray-700 rounded-xl p-4">
            <h3 className="text-xl font-semibold text-gray-100 mb-2">
              Appliance 2 Control
            </h3>
            <div className="flex">
              <button
                onClick={() => toggleRelay(2, !relayStates.relay2)}
                className={`px-3 py-2 ${
                  relayStates.relay2 ? "bg-red-500" : "bg-green-500"
                } text-gray-800 rounded shadow`}
              >
                {relayStates.relay2 ? "OFF" : "ON"}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-700 p-4 border-4 border-green-500 rounded-lg">
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
                  marker: { color: "#00ff00" },
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
                title: { text: "Temperature" },
                xaxis: {
                  title: "Time",
                  showgrid: false,
                  showticklabels: true,
                },
                yaxis: { title: "Value in C", showline: false },
                margin: { t: 50, b: 40, l: 50, r: 20 },
                autosize: true,
                showlegend: false,
                dragmode: false,
                hovermode: "closest",
                plot_bgcolor: "#2d3748",
                paper_bgcolor: "#2d3748",
              }}
            />
          </div>
          <div className="bg-gray-700 p-4 border-4 border-blue-500 rounded-lg">
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
                  marker: { color: "#19a7ce" },
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
                title: { text: "Humidity" },
                xaxis: {
                  title: "Time",
                  showgrid: false,
                  showticklabels: true,
                },
                yaxis: { title: "Value in %", showline: false },
                margin: { t: 50, b: 40, l: 50, r: 20 },
                autosize: true,
                showlegend: false,
                dragmode: false,
                hovermode: "closest",
                plot_bgcolor: "#2d3748",
                paper_bgcolor: "#2d3748",
              }}
            />
          </div>
          <div className="bg-gray-700 p-4 border-4 border-yellow-500 rounded-lg">
            <h4 className="text-lg font-medium text-gray-100 mb-4">
              Soil Moisture Trend
            </h4>
            <Plot
              className="overflow-hidden w-full h-[350px] flex-auto"
              data={[
                {
                  x: soilMoistureData.map((data) => data.x),
                  y: soilMoistureData.map((data) => data.y),
                  type: "scatter",
                  mode: "lines",
                  marker: { color: "#feff86" },
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
                title: { text: "Soil Moisture" },
                xaxis: {
                  title: "Time",
                  showgrid: false,
                  showticklabels: true,
                },
                yaxis: { title: "Value in %", showline: false },
                margin: { t: 50, b: 40, l: 50, r: 20 },
                autosize: true,
                showlegend: false,
                dragmode: false,
                hovermode: "closest",
                plot_bgcolor: "#2d3748",
                paper_bgcolor: "#2d3748",
              }}
            />
          </div>
        </div>
        <div className="text-center mt-8">
          <h2 className="text-sm  text-gray-400">
            Sarthak S Kumar | Sathish Kumar G | Satyam Kumar | Sanath Kumar
          </h2>
          <h2 className="text-sm  text-gray-500">MPCA + CN Project 2023</h2>
        </div>
      </div>
    </div>
  );
}
