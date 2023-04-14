import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import moment from "moment";
import "moment-timezone";

export default function App() {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [soilMoisture, setSoilMoisture] = useState(0);
  const [reedState, setReedState] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const relay1 = 0,
    relay2 = 0,
    relay3 = 0,
    handleRefresh = 0,
    getCurrentTime = 0,
    reedSwitchState = 0;
  useEffect(() => {
    const intervalId = setInterval(() => {
      axios.get("https://your-ngrok-url.ngrok.io/sensors").then((response) => {
        const lines = response.data.split("\n");
        const tempLine = lines[0].split(":");
        const humidLine = lines[1].split(":");
        const soilLine = lines[2].split(":");
        const reedLine = lines[3].split(":");
        setTemperature(parseFloat(tempLine[1].trim()));
        setHumidity(parseFloat(humidLine[1].trim()));
        setSoilMoisture(parseInt(soilLine[1].trim()));
        setReedState(parseInt(reedLine[1].trim()) === 1);
      });
    }, 10000);

    const timerId = setInterval(() => {
      setCurrentTime(moment().tz("Asia/Kolkata").format("hh:mm:ss A"));
    }, 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(timerId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-200 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <img
                src="vite.svg"
                alt="Smart Home Automation"
                className="h-16 mx-auto"
              />
              <h2 className="text-center text-3xl font-extrabold text-gray-900 mt-4 mb-8">
                Smart Home Automation Dashboard
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                        <img
                          src="vite.svg"
                          alt="Temperature"
                          className="h-6 w-6"
                        />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Temperature
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {temperature}°C
                          </div>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                        <img
                          src="vite.svg"
                          alt="Humidity"
                          className="h-6 w-6"
                        />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Humidity
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {humidity}%
                          </div>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                        <img
                          src="vite.svg"
                          alt="Soil Moisture"
                          className="h-6 w-6"
                        />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Soil Moisture
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {soilMoisture}%
                          </div>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                        <img
                          src="vite.svg"
                          alt="Door State"
                          className="h-6 w-6"
                        />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Door State
                        </dt>
                        <dd className="flex items-baseline">
                          <div
                            className={`text-2xl font-semibold ${
                              reedState ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {reedState ? "Open" : "Closed"}
                          </div>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-gray-500 rounded-md p-3">
                        <svg
                          className="h-6 w-6 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6l4 2m-4"
                          ></path>
                        </svg>
                        <div className="grid grid-cols-4 gap-4">
                          <div className="col-span-4 sm:col-span-2 bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                                    <img
                                      src="vite.svg"
                                      alt="Light Control"
                                      className="h-6 w-6"
                                    />
                                  </div>
                                  <div className="ml-5 w-0 flex-1">
                                    <dt className="text-lg font-medium text-gray-500 truncate">
                                      Light Control
                                    </dt>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <button
                                    onClick={() => handleRelayToggle(1)}
                                    className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                                      relay1
                                        ? "bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        : "bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                    }`}
                                  >
                                    {relay1 ? "On" : "Off"}
                                  </button>
                                  <button
                                    onClick={() => handleRelayToggle(2)}
                                    className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ml-3 ${
                                      relay2
                                        ? "bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        : "bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                    }`}
                                  >
                                    {relay2 ? "On" : "Off"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-4 sm:col-span-2 bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                                    <img
                                      src="vite.svg"
                                      alt="Fan Control"
                                      className="h-6 w-6"
                                    />
                                  </div>
                                  <div className="ml-5 w-0 flex-1">
                                    <dt className="text-lg font-medium text-gray-500 truncate">
                                      Fan Control
                                    </dt>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <button
                                    onClick={() => handleRelayToggle(3)}
                                    className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                                      relay3
                                        ? "bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        : "bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                    }`}
                                  >
                                    {relay3 ? "On" : "Off"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-2 bg-white overflow-hidden shadow rounded-lg">
                            <div className="px"></div>
                            <dt className="text-lg font-medium text-gray-500 truncate">
                              Temperature
                            </dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">
                              {temperature} &deg;C
                            </dd>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-4 sm:px-6">
                          <div className="text-sm">
                            <a
                              href="#"
                              className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                              View all
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    View all
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
