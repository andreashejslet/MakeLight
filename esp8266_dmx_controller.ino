/*
 * Make Light - ESP8266 DMX Controller
 * 
 * Hardware setup:
 * - ESP8266 (NodeMCU, Wemos D1 Mini, etc.)
 * - RS485 to DMX converter (MAX485 chip)
 * - GPIO2 (D4) connected to RS485 TX/DI
 * 
 * This code receives DMX data from the Make Light app via WiFi
 * and outputs DMX512 signals to control your church lighting
 */

#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ArduinoJson.h>

// ============================================================================
// CONFIGURATION - Update these with your network settings
// ============================================================================

const char* ssid = "YOUR_WIFI_SSID";           // Replace with your WiFi name
const char* password = "YOUR_WIFI_PASSWORD";   // Replace with your WiFi password

// Static IP configuration (optional, but recommended for reliability)
IPAddress local_IP(192, 168, 1, 100);  // This should match the IP in the app
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);

// ============================================================================
// DMX CONFIGURATION
// ============================================================================

#define DMX_TX_PIN 2           // GPIO2 (D4 on NodeMCU) - connected to RS485 TX
#define DMX_CHANNELS 512       // Standard DMX universe has 512 channels
#define DMX_BREAK_US 100       // Break time in microseconds
#define DMX_MAB_US 12          // Mark After Break time
#define DMX_BAUD_RATE 250000   // DMX baud rate is 250kbps

// DMX buffer to store channel values
uint8_t dmxBuffer[DMX_CHANNELS + 1];  // +1 for start code

// Web server on port 80
ESP8266WebServer server(80);

// ============================================================================
// DMX FUNCTIONS
// ============================================================================

void dmxInit() {
  // Initialize DMX buffer with zeros
  memset(dmxBuffer, 0, sizeof(dmxBuffer));
  dmxBuffer[0] = 0;  // Start code is always 0
  
  // Configure serial port for DMX output
  Serial1.begin(DMX_BAUD_RATE, SERIAL_8N2);  // 8 data bits, no parity, 2 stop bits
  pinMode(DMX_TX_PIN, OUTPUT);
  digitalWrite(DMX_TX_PIN, HIGH);
}

void dmxSendBreak() {
  // Send BREAK signal (logic LOW for minimum 88us, we use 100us)
  digitalWrite(DMX_TX_PIN, LOW);
  delayMicroseconds(DMX_BREAK_US);
}

void dmxSendMAB() {
  // Send Mark After Break (logic HIGH for minimum 8us, we use 12us)
  digitalWrite(DMX_TX_PIN, HIGH);
  delayMicroseconds(DMX_MAB_US);
}

void dmxSendPacket() {
  // Disable interrupts for timing accuracy
  noInterrupts();
  
  // Send BREAK signal
  dmxSendBreak();
  
  // Send Mark After Break
  dmxSendMAB();
  
  // Re-enable interrupts
  interrupts();
  
  // Send start code and all 512 channels
  for (int i = 0; i <= DMX_CHANNELS; i++) {
    Serial1.write(dmxBuffer[i]);
  }
}

void dmxSetChannel(int channel, uint8_t value) {
  if (channel >= 1 && channel <= DMX_CHANNELS) {
    dmxBuffer[channel] = value;
  }
}

uint8_t dmxGetChannel(int channel) {
  if (channel >= 1 && channel <= DMX_CHANNELS) {
    return dmxBuffer[channel];
  }
  return 0;
}

void dmxBlackout() {
  for (int i = 1; i <= DMX_CHANNELS; i++) {
    dmxBuffer[i] = 0;
  }
  dmxSendPacket();
}

// ============================================================================
// WEB SERVER HANDLERS
// ============================================================================

void handleRoot() {
  String html = "<!DOCTYPE html><html><head><title>Make Light DMX</title>";
  html += "<style>body{font-family:Arial;max-width:600px;margin:50px auto;padding:20px;}";
  html += "h1{color:#ff8c42;}table{width:100%;border-collapse:collapse;}";
  html += "td,th{border:1px solid #ddd;padding:8px;text-align:left;}";
  html += "th{background:#ff8c42;color:white;}</style></head><body>";
  html += "<h1>Make Light DMX Controller</h1>";
  html += "<p>Status: <strong style='color:green;'>Online</strong></p>";
  html += "<p>IP Address: " + WiFi.localIP().toString() + "</p>";
  html += "<p>Active Channels: <strong>" + String(countActiveChannels()) + " / 512</strong></p>";
  html += "<h2>Recent Channel Values</h2><table><tr><th>Channel</th><th>Value</th></tr>";
  
  // Show first 20 non-zero channels
  int count = 0;
  for (int i = 1; i <= DMX_CHANNELS && count < 20; i++) {
    if (dmxBuffer[i] > 0) {
      html += "<tr><td>" + String(i) + "</td><td>" + String(dmxBuffer[i]) + "</td></tr>";
      count++;
    }
  }
  
  html += "</table></body></html>";
  server.send(200, "text/html", html);
}

void handleDMX() {
  if (server.method() != HTTP_POST) {
    server.send(405, "text/plain", "Method Not Allowed");
    return;
  }
  
  // Parse JSON payload
  StaticJsonDocument<8192> doc;
  DeserializationError error = deserializeJson(doc, server.arg("plain"));
  
  if (error) {
    server.send(400, "application/json", "{\"error\":\"Invalid JSON\"}");
    return;
  }
  
  // Update DMX channels from JSON array
  JsonArray channels = doc["channels"];
  if (channels) {
    for (int i = 0; i < channels.size() && i < DMX_CHANNELS; i++) {
      dmxBuffer[i + 1] = channels[i];  // +1 because DMX channels start at 1
    }
    
    // Send updated DMX packet
    dmxSendPacket();
    
    server.send(200, "application/json", "{\"status\":\"ok\",\"channels\":" + String(channels.size()) + "}");
  } else {
    server.send(400, "application/json", "{\"error\":\"Missing channels array\"}");
  }
}

void handleBlackout() {
  dmxBlackout();
  server.send(200, "application/json", "{\"status\":\"blackout\"}");
}

void handleStatus() {
  String json = "{";
  json += "\"ip\":\"" + WiFi.localIP().toString() + "\",";
  json += "\"ssid\":\"" + String(ssid) + "\",";
  json += "\"rssi\":" + String(WiFi.RSSI()) + ",";
  json += "\"activeChannels\":" + String(countActiveChannels()) + ",";
  json += "\"uptime\":" + String(millis() / 1000);
  json += "}";
  server.send(200, "application/json", json);
}

void handleNotFound() {
  server.send(404, "text/plain", "Not Found");
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

int countActiveChannels() {
  int count = 0;
  for (int i = 1; i <= DMX_CHANNELS; i++) {
    if (dmxBuffer[i] > 0) count++;
  }
  return count;
}

// ============================================================================
// SETUP
// ============================================================================

void setup() {
  // Initialize serial for debugging
  Serial.begin(115200);
  delay(100);
  
  Serial.println("\n\n=================================");
  Serial.println("Make Light DMX Controller");
  Serial.println("=================================\n");
  
  // Initialize DMX
  dmxInit();
  Serial.println("[DMX] Initialized on GPIO2");
  
  // Configure static IP (optional)
  if (!WiFi.config(local_IP, gateway, subnet)) {
    Serial.println("[WiFi] Static IP configuration failed!");
  }
  
  // Connect to WiFi
  Serial.print("[WiFi] Connecting to ");
  Serial.print(ssid);
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[WiFi] Connected!");
    Serial.print("[WiFi] IP Address: ");
    Serial.println(WiFi.localIP());
    Serial.print("[WiFi] Signal Strength: ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
  } else {
    Serial.println("\n[WiFi] Connection failed!");
    Serial.println("[WiFi] Restarting...");
    delay(3000);
    ESP.restart();
  }
  
  // Configure web server routes
  server.on("/", handleRoot);
  server.on("/dmx", handleDMX);
  server.on("/blackout", handleBlackout);
  server.on("/status", handleStatus);
  server.onNotFound(handleNotFound);
  
  // Enable CORS for web app access
  server.enableCORS(true);
  
  // Start web server
  server.begin();
  Serial.println("[HTTP] Server started on port 80");
  
  Serial.println("\n=================================");
  Serial.println("Ready to receive DMX commands!");
  Serial.println("=================================\n");
  
  // Send initial blackout
  dmxBlackout();
}

// ============================================================================
// MAIN LOOP
// ============================================================================

void loop() {
  // Handle incoming HTTP requests
  server.handleClient();
  
  // Continuously send DMX packets (refresh rate ~44Hz)
  static unsigned long lastDmxSend = 0;
  unsigned long now = millis();
  
  if (now - lastDmxSend >= 23) {  // ~44Hz refresh rate
    dmxSendPacket();
    lastDmxSend = now;
  }
  
  // Reconnect WiFi if disconnected
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[WiFi] Connection lost! Reconnecting...");
    WiFi.reconnect();
    delay(5000);
  }
}
