 #include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <DHT.h>

#define DHTPIN D4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

#define SOIL_MOISTURE_PIN A0
#define REED_SWITCH_PIN D6
#define RELAY1_PIN D1
#define RELAY2_PIN D2

ESP8266WebServer server(8888);

int soilMoistureValue = 0;
int reedSwitchState = LOW;
int relay1State = LOW;
int relay2State = LOW;

String data;

const char* ssid = "Vinya";
const char* password = "03052003";

void handleOptions() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
  server.sendHeader("Access-Control-Max-Age", "86400");  // Cache CORS preflight response for 24 hours
  server.send(204);  // Send 'No Content' status
}

void handleRelayOn(String relayName, int relayPin, int& relayState) {
  digitalWrite(relayPin, HIGH);
  relayState = HIGH;
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", relayName + " turned on");
  Serial.println(relayName + " turned on");
}

void handleRelayOff(String relayName, int relayPin, int& relayState) {
  digitalWrite(relayPin, LOW);
  relayState = LOW;
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", relayName + " turned off");
  Serial.println(relayName + " turned off");
}

void handleRelay1On() {
  handleRelayOn("Relay 1", RELAY1_PIN, relay1State);
}

void handleRelay1Off() {
  handleRelayOff("Relay 1", RELAY1_PIN, relay1State);
}

void handleRelay2On() {
  handleRelayOn("Relay 2", RELAY2_PIN, relay2State);
}

void handleRelay2Off() {
  handleRelayOff("Relay 2", RELAY2_PIN, relay2State);
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  dht.begin();

  pinMode(SOIL_MOISTURE_PIN, INPUT);
  pinMode(REED_SWITCH_PIN, INPUT);
  pinMode(RELAY1_PIN, OUTPUT);
  pinMode(RELAY2_PIN, OUTPUT);

  server.on("/data", HTTP_OPTIONS, handleOptions);
  server.on("/relay1/on", HTTP_OPTIONS, handleOptions);
  server.on("/relay1/off", HTTP_OPTIONS, handleOptions);
  server.on("/relay2/on", HTTP_OPTIONS, handleOptions);
  server.on("/relay2/off", HTTP_OPTIONS, handleOptions);
  server.on("/", HTTP_OPTIONS, handleOptions);
  server.on("/data", HTTP_GET, []() {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "application/json", data);
  });
  server.on("/relay1/on", HTTP_POST, handleRelay1On);
  server.on("/relay1/off", HTTP_POST, handleRelay1Off);
  server.on("/relay2/on", HTTP_POST, handleRelay2On);
  server.on("/relay2/off", HTTP_POST, handleRelay2Off);

  server.begin();
}

void loop() {
  server.handleClient();
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  soilMoistureValue = 100 - map(analogRead(SOIL_MOISTURE_PIN), 10, 990, 0, 100);
  reedSwitchState = digitalRead(REED_SWITCH_PIN);
  data = "{\"temperature\":" + String(temperature) + ",\"humidity\":" + String(humidity) + ",\"soil_moisture\":" + String(soilMoistureValue) + ",\"reed_switch_state\":" + String(reedSwitchState) + ",\"relay1_state\":" + String(relay1State) + ",\"relay2_state\":" + String(relay2State) + "}";

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

  delay(1500);
}