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
  FaFillDrip,
} from "react-icons/fa";
import { BiCheckboxSquare, BiCheckbox } from "react-icons/bi";

export default function App() {
  const [ngrokUrl, setNgrokUrl] = useState("http://0.tcp.in.ngrok.io:16664");
  const [urlSet, setUrlSet] = useState(false);

  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [soilMoisture, setSoilMoisture] = useState(0);
  const [reedState, setReedState] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const toggleRelay = async (relayNumber, newState) => {
    await axios.post(
      `${ngrokUrl}/relay${relayNumber}/${newState ? "on" : "off"}`
    );
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
      console.log(currentTime);
    });
  };

  useEffect(() => {
    setInterval(getData, 1000);
  });

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
        <div className="h-fit bg-gray-600 px-6">
          <div className="w-full sm:mx-auto">
            <div className="relative py-8 bg-gray-800 shadow-lg sm:rounded-3xl sm:p-20">
              <div className="w-full mx-auto">
                <div>
                  <img
                    src="vite.svg"
                    alt="Smart Home Automation"
                    className="h-16 mx-auto"
                  />
                  <h2 className="text-center text-3xl font-bold text-gray-100 mt-4 mb-8">
                    Smart Home Automation Dashboard
                  </h2>
                  <div className="flex w-full flex-wrap flex-row-reverse">
                    <div className="flex flex-wrap w-1/2 border-2"></div>
                    <div className="flex flex-wrap w-1/2 border-2">
                      <div className="w-full grid grid-cols-3">
                        <div className="flex items-center h-fit bg-gray-700 px-2 py-5 rounded-xl mx-4">
                          <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                            <FaThermometerHalf />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dt className="text-sm font-medium text-gray-400 truncate">
                              Temperature
                            </dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-gray-100">
                                {temperature}°C
                              </div>
                            </dd>
                          </div>
                        </div>
                        <div className="flex items-center h-fit bg-gray-700 px-4 py-5 rounded-xl mx-4">
                          <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                            <FaWater />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dt className="text-sm font-medium text-gray-400 truncate">
                              Humidity
                            </dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-gray-100">
                                {humidity}%
                              </div>
                            </dd>
                          </div>
                        </div>
                        <div className="flex items-center h-fit bg-gray-700 px-4 py-5 rounded-xl mx-4">
                          <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                            <FaSeedling />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dt className="text-sm font-medium text-gray-400 truncate">
                              Soil Moisture
                            </dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-gray-100">
                                {soilMoisture}%
                              </div>
                            </dd>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex items-center">
                            <div
                              className={`flex-shrink-0 ${
                                reedState ? "bg-green-500" : "bg-red-500"
                              } rounded-md p-3`}
                            >
                              {reedState ? <FaDoorClosed /> : <FaDoorOpen />}
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dt className="text-sm font-medium text-gray-400 truncate">
                                Door State
                              </dt>
                              <dd className="flex items-baseline">
                                <div
                                  className={`text-2xl font-semibold ${
                                    reedState
                                      ? "text-green-500"
                                      : "text-red-500"
                                  }`}
                                >
                                  {!reedState ? "Open" : "Closed"}
                                </div>
                              </dd>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                        <FaPowerOff className="h-6 w-6 text-gray-800" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dt className="text-sm font-medium text-gray-400 truncate">
                          Relay 1 Control
                        </dt>
                        <dd className="flex items-center">
                          <button
                            onClick={() => toggleRelay(1, true)}
                            className="px-3 py-2 mr-2 bg-green-500 text-gray-800 rounded shadow"
                          >
                            ON
                          </button>
                          <button
                            onClick={() => toggleRelay(1, false)}
                            className="px-3 py-2 bg-red-500 text-gray-800 rounded shadow"
                          >
                            OFF
                          </button>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                        <FaPowerOff className="h-6 w-6 text-gray-800" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dt className="text-sm font-medium text-gray-400 truncate">
                          Relay 2 Control
                        </dt>
                        <dd className="flex items-center">
                          <button
                            onClick={() => toggleRelay(2, true)}
                            className="px-3 py-2 mr-2 bg-green-500 text-gray-800 rounded shadow"
                          >
                            ON
                          </button>
                          <button
                            onClick={() => toggleRelay(2, false)}
                            className="px-3 py-2 bg-red-500 text-gray-800 rounded shadow"
                          >
                            OFF
                          </button>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
