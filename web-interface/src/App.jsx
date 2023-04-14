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

  const getData = async () => {
    await axios
      .options("https://806c-49-37-160-215.ngrok-free.app", {
        mode: "no-cors",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      })
      .then((response) => {
        setTemperature(response.data.temperature);
        setHumidity(response.data.humidity);
        setSoilMoisture(`
          ${
            response.data.soil_moisture < 0 ? 0 : response.data.soil_moisture
          }`);
        setReedState(response.data.reed_switch_state);
        setCurrentTime(moment().tz("Asia/Kolkata").format("hh:mm:ss A"));
        console.log(currentTime);
      });
  };

  useEffect(() => {
    setInterval(getData, 3000);
  }, []);

  return (
    <div className="min-h-screen bg-gray-200 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 max-w-2xl sm:mx-auto">
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
                      <div
                        className={`flex-shrink-0 ${
                          !reedState ? "bg-green-500" : "bg-red-500"
                        } rounded-md p-3`}
                      >
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
                              !reedState ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {reedState ? "Open" : "Closed"}
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
      </div>
    </div>
  );
}
