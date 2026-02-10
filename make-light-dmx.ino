#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ArduinoJson.h>

// WiFi Configuration
// ⚠️ IMPORTANT: Never commit your actual WiFi credentials to GitHub!
// Replace these before uploading to your ESP8266
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// DMX Configuration
#define DMX_TX_PIN 2  // GPIO2 for DMX transmission
#define DMX_CHANNELS 512
#define DMX_BREAK 100  // microseconds
#define DMX_MAB 12     // microseconds

// DMX Data
uint8_t dmxData[DMX_CHANNELS + 1]; // +1 for start code
volatile bool dmxUpdateFlag = false;

// Web Server
ESP8266WebServer server(80);

// Initialize DMX
void setupDMX() {
  // Configure serial for DMX (250kbaud, 8N2)
  Serial.begin(250000, SERIAL_8N2);
  
  // Initialize all channels to 0
  memset(dmxData, 0, sizeof(dmxData));
  dmxData[0] = 0; // DMX start code
  
  pinMode(DMX_TX_PIN, OUTPUT);
  digitalWrite(DMX_TX_PIN, HIGH);
}

// Send DMX frame
void sendDMXFrame() {
  // BREAK
  digitalWrite(DMX_TX_PIN, LOW);
  delayMicroseconds(DMX_BREAK);
  
  // MARK AFTER BREAK
  digitalWrite(DMX_TX_PIN, HIGH);
  delayMicroseconds(DMX_MAB);
  
  // Send start code and channel data
  for (int i = 0; i <= DMX_CHANNELS; i++) {
    Serial.write(dmxData[i]);
  }
}

// Handle incoming DMX data from web app
void handleDMXUpdate() {
  if (server.method() != HTTP_POST) {
    server.send(405, "text/plain", "Method Not Allowed");
    return;
  }

  String body = server.arg("plain");
  
  // Parse JSON
  StaticJsonDocument<8192> doc;
  DeserializationError error = deserializeJson(doc, body);
  
  if (error) {
    server.send(400, "application/json", "{\"error\":\"Invalid JSON\"}");
    return;
  }

  // Update DMX channels
  JsonArray channels = doc["channels"];
  if (channels.isNull()) {
    server.send(400, "application/json", "{\"error\":\"Missing channels array\"}");
    return;
  }

  // Copy channel data (skip index 0 which is start code)
  for (int i = 0; i < channels.size() && i < DMX_CHANNELS; i++) {
    dmxData[i + 1] = channels[i];
  }

  dmxUpdateFlag = true;

  // Send success response
  server.send(200, "application/json", "{\"status\":\"ok\",\"channels_updated\":" + String(channels.size()) + "}");
}

// Handle root endpoint
void handleRoot() {
  String html = R"(
<!DOCTYPE html>
<html>
<head>
  <title>Make Light DMX Controller</title>
  <style>
    body { 
      font-family: monospace; 
      background: #0a0a0a; 
      color: #f5f5f5; 
      padding: 2rem;
      max-width: 600px;
      margin: 0 auto;
    }
    .status { 
      padding: 1rem; 
      background: #141414; 
      border: 1px solid #2a2a2a;
      margin-bottom: 1rem;
    }
    .channel {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem;
      border-bottom: 1px solid #2a2a2a;
    }
    h1 { color: #ffcc00; }
  </style>
</head>
<body>
  <h1>Make Light DMX Controller</h1>
  <div class="status">
    <div>Status: <span id="status">Ready</span></div>
    <div>IP: )" + WiFi.localIP().toString() + R"(</div>
    <div>Free Heap: <span id="heap">)" + String(ESP.getFreeHeap()) + R"(</span> bytes</div>
  </div>
  <h2>Active Channels</h2>
  <div id="channels"></div>
  <script>
    function updateStatus() {
      fetch('/status')
        .then(r => r.json())
        .then(data => {
          document.getElementById('heap').textContent = data.freeHeap;
          let channelHtml = '';
          for (let i = 0; i < data.activeChannels.length; i++) {
            if (data.activeChannels[i] > 0) {
              channelHtml += `<div class="channel"><span>Channel ${i+1}</span><span>${data.activeChannels[i]}</span></div>`;
            }
          }
          document.getElementById('channels').innerHTML = channelHtml || '<div class="channel">No active channels</div>';
        });
    }
    setInterval(updateStatus, 1000);
    updateStatus();
  </script>
</body>
</html>
  )";
  
  server.send(200, "text/html", html);
}

// Handle status endpoint
void handleStatus() {
  StaticJsonDocument<8192> doc;
  doc["freeHeap"] = ESP.getFreeHeap();
  doc["uptime"] = millis();
  
  JsonArray channels = doc.createNestedArray("activeChannels");
  for (int i = 1; i <= DMX_CHANNELS; i++) {
    channels.add(dmxData[i]);
  }
  
  String response;
  serializeJson(doc, response);
  server.send(200, "application/json", response);
}

// Handle blackout (all channels to 0)
void handleBlackout() {
  memset(dmxData + 1, 0, DMX_CHANNELS); // Keep start code at 0
  dmxUpdateFlag = true;
  server.send(200, "application/json", "{\"status\":\"blackout\"}");
}

void setup() {
  // Initialize Serial for debugging
  Serial.begin(115200);
  Serial.println("\n\nMake Light DMX Controller");
  
  // Connect to WiFi
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\nConnected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  
  // Setup DMX
  setupDMX();
  
  // Setup web server
  server.on("/", handleRoot);
  server.on("/dmx", handleDMXUpdate);
  server.on("/status", handleStatus);
  server.on("/blackout", handleBlackout);
  
  // Enable CORS for web app
  server.enableCORS(true);
  
  server.begin();
  Serial.println("Web server started");
  Serial.println("Ready to receive DMX data");
}

void loop() {
  server.handleClient();
  
  // Continuously send DMX frames (44 Hz refresh rate)
  static unsigned long lastDMXSend = 0;
  unsigned long currentMillis = millis();
  
  if (currentMillis - lastDMXSend >= 23) { // ~44 Hz
    sendDMXFrame();
    lastDMXSend = currentMillis;
    
    if (dmxUpdateFlag) {
      dmxUpdateFlag = false;
      Serial.println("DMX data updated");
    }
  }
  
  yield(); // Allow ESP8266 to handle WiFi
}
