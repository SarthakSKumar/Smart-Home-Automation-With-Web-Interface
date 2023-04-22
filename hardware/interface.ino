#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <DHT.h>

// Pin definitions for the DHT11 sensor
#define DHTPIN D4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Pin definitions for soil moisture sensor, reed switch, and relays
#define SOIL_MOISTURE_PIN A0
#define REED_SWITCH_PIN D6
#define RELAY1_PIN D1
#define RELAY2_PIN D2

// Create an instance of the ESP8266WebServer class
ESP8266WebServer server(8888);

// Variables to store the values of soil moisture, reed switch state, and relay states
int soilMoistureValue = 0;
int reedSwitchState = LOW;
int relay1State = LOW;
int relay2State = LOW;

// String to store data to be sent to the client
String data;

// WiFi network credentials
const char* ssid = "Vinya";
const char* password = "03052003";

// Handles OPTIONS request for CORS preflight
void handleOptions() {
  // Send Access-Control-Allow-Origin header to allow cross-origin requests
  server.sendHeader("Access-Control-Allow-Origin", "*");
  // Send Access-Control-Allow-Methods header to specify allowed methods
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  // Send Access-Control-Allow-Headers header to specify allowed headers
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
  // Send Access-Control-Max-Age header to cache the preflight response
  server.sendHeader("Access-Control-Max-Age", "86400");
  // Send 204 No Content status code
  server.send(204);
}

// Turns on the specified relay and sends a response to the client
void handleRelayOn(String relayName, int relayPin, int& relayState) {
  // Turn on the relay
  digitalWrite(relayPin, HIGH);
  // Update the relay state
  relayState = HIGH;
  // Send Access-Control-Allow-Origin header to allow cross-origin requests
  server.sendHeader("Access-Control-Allow-Origin", "*");
  // Send a text/plain response with the relay name and status
  server.send(200, "text/plain", relayName + " turned on");
  // Print the relay name and status to the serial console
  Serial.println(relayName + " turned on");
}

// Turns off the specified relay and sends a response to the client
void handleRelayOff(String relayName, int relayPin, int& relayState) {
  // Turn off the relay
  digitalWrite(relayPin, LOW);
  // Update the relay state
  relayState = LOW;
  // Send Access-Control-Allow-Origin header to allow cross-origin requests
  server.sendHeader("Access-Control-Allow-Origin", "*");
  // Send a text/plain response with the relay name and status
server.send(200, "text/plain", relayName + " turned off");
// Print the relay name and status to the serial console
Serial.println(relayName + " turned off");
}

// Handles POST request to turn on relay 1
void handleRelay1On() {
handleRelayOn("Relay 1", RELAY1_PIN, relay1State);
}

// Handles POST request to turn off relay 1
void handleRelay1Off() {
handleRelayOff("Relay 1", RELAY1_PIN, relay1State);
}

// Handles POST request to turn on relay 2
void handleRelay2On() {
handleRelayOn("Relay 2", RELAY2_PIN, relay2State);
}

// Handles POST request to turn off relay 2
void handleRelay2Off() {
handleRelayOff("Relay 2", RELAY2_PIN, relay2State);
}

void setup() {
// Start the serial communication
Serial.begin(115200);
// Connect to the WiFi network
WiFi.begin(ssid, password);
// Wait until the connection is established
while (WiFi.status() != WL_CONNECTED) {
delay(1000);
Serial.println("Connecting to WiFi...");
}
// Print the IP address of the ESP8266
Serial.println("WiFi connected");
Serial.println("IP address: ");
Serial.println(WiFi.localIP());

// Start the DHT11 sensor
dht.begin();

// Set the modes for the soil moisture sensor, reed switch, and relays
pinMode(SOIL_MOISTURE_PIN, INPUT);
pinMode(REED_SWITCH_PIN, INPUT);
pinMode(RELAY1_PIN, OUTPUT);
pinMode(RELAY2_PIN, OUTPUT);

// Set up CORS preflight response for all routes
server.on("/data", HTTP_OPTIONS, handleOptions);
server.on("/relay1/on", HTTP_OPTIONS, handleOptions);
server.on("/relay1/off", HTTP_OPTIONS, handleOptions);
server.on("/relay2/on", HTTP_OPTIONS, handleOptions);
server.on("/relay2/off", HTTP_OPTIONS, handleOptions);
server.on("/", HTTP_OPTIONS, handleOptions);

// Set up response for GET request to /data route
server.on("/data", HTTP_GET, {
server.sendHeader("Access-Control-Allow-Origin", "*");
server.send(200, "application/json", data);
});

// Set up response for POST request to /relay1/on route
server.on("/relay1/on", HTTP_POST, handleRelay1On);

// Set up response for POST request to /relay1/off route
server.on("/relay1/off", HTTP_POST, handleRelay1Off);

// Set up response for POST request to /relay2/on route
server.on("/relay2/on",HTTP_POST, handleRelay2On);

// Set up response for POST request to /relay2/off route
server.on("/relay2/off", HTTP_POST, handleRelay2Off);

// Start the web server
server.begin();
}

void loop() {
// Handle incoming client requests
server.handleClient();

// Read the temperature and humidity from the DHT11 sensor
float temperature = dht.readTemperature();
float humidity = dht.readHumidity();

// Read the soil moisture value from the soil moisture sensor
soilMoistureValue = 100 - map(analogRead(SOIL_MOISTURE_PIN), 10, 990, 0, 100);

// Read the state of the reed switch
reedSwitchState = digitalRead(REED_SWITCH_PIN);

// Format the data as a JSON string
data = "{"temperature":" + String(temperature) + ","humidity":" + String(humidity) + ","soil_moisture":" + String(soilMoistureValue) + ","reed_switch_state":" + String(reedSwitchState) + ","relay1_state":" + String(relay1State) + ","relay2_state":" + String(relay2State) + "}";

// Print the temperature, humidity, soil moisture, and reed switch state to the serial console
if (isnan(dht.readTemperature()) || isnan(dht.readHumidity())) {
Serial.println("Failed to read from DHT sensor!");
} else {
Serial.print("Temperature: ");
Serial.print(dht.readTemperature());
Serial.print(" *C, Humidity: ");
Serial.print(dht.readHumidity());
Serial.println(" %");
}

Serial.print("Soil Moisture (in %): ");
Serial.println(soilMoistureValue);

Serial.print("Reed Switch: ");
Serial.println(reedSwitchState);

// Delay for 1.5 seconds
delay(1500);
}