# Smart Home Automation integrated with Web Interface and ESP8266 Module

## Table of Contents

- [Description](#description)
- [Components Used](#components-used)
- [Screenshots](#screenshots)
- [Team Members](#team-members)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Description

The Smart Home Automation project is designed to create an efficient, user-friendly, and cost-effective system for controlling and monitoring various home appliances and environmental parameters. By integrating a web interface and ESP8266 module, users can remotely access and control their home devices, ensuring convenience and energy conservation.

## Components Used

- Arduino Uno: A microcontroller board based on the ATmega328P, used as the central processing unit for the system.
- ESP8266: A low-cost Wi-Fi module that enables wireless communication and remote access to the system.
- 4 Channel Relay Module: An interface that allows the Arduino to control high-voltage appliances safely.
- Water Level Sensor: A sensor that detects the water level in a container, providing feedback for water management.
- Magnetic Reed Switch: A switch that detects the opening and closing of doors or windows, enhancing home security.
- DHT11 Temperature/Humidity Sensor: A sensor that measures ambient temperature and humidity, providing data for climate control.

## Screenshots

![Smart Home Automation-1](/Images/screenshot-0.jpg)

![Smart Home Automation-2](/Images/screenshot-1.png)

![Smart Home Automation-3](/Images/screenshot-2.png)

![Smart Home Automation-4](/Images/screenshot-3.png)

![Smart Home Automation-5](/Images/screenshot-4.png)

## Team Members

- Sarthak S Kumar (PES2UG21CS482)
- Sathish Kumar G (PES2UG21CS484)
- Satyam Kumar (PES2UG21CS486)
- Sanath Kumar R (PES2UG21CS474)

## Installation

To set up the system, follow these steps:

1. Install Python 3 and the Pyngrok library by running `pip install pyngrok`.
2. Install Node.js and NPM (Node Package Manager).
3. Clone the repository to your local machine.
4. Navigate to the backend directory and run `npm install` to install the required dependencies.
5. Run `npm i`in the web interface directory.
6. In a new terminal window, navigate to the frontend directory and run `npm install` to install the required dependencies.
7. Run `python start.py` to start the frontend server.
8. Open the Arduino IDE and upload the Arduino sketch file to your Arduino Uno board.
9. Connect the Arduino Uno board to the 4 Channel Relay Module, Water level sensor, magnetic reed switch, and DHT11 temperature/humidity sensor based on the wiring diagram provided in the Arduino sketch file.

## Usage

To use the system, follow these steps:

1. Open a web browser and go to http://localhost:3000 to access the web interface.
2. Enter your Wi-Fi network credentials and click on the "Connect" button to connect the ESP8266 module to your Wi-Fi network.
3. Once connected, you should see the status of the various sensors and appliances displayed on the web interface.
4. You can control the appliances by clicking on the corresponding buttons on the web interface.
5. The Water level sensor, magnetic reed switch, and DHT11 temperature/humidity sensor data can be monitored on the web interface in real-time.
6. You can also remotely access and control the system from any device connected to the same Wi-Fi network by going to the IP address of the ESP8266 module followed by port 3000, e.g., http://192.168.1.100:3000. You can find the IP address of the ESP8266 module by checking the serial monitor in the Arduino IDE or by using the Pyngrok library to create a public URL for your local server.

## Contributing

Contributions are welcome! Please create a pull request to contribute to this project.

## License

This project is licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0).
