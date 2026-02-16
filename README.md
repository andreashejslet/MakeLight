# Make Light - AI-Powered DMX Light Control

> Kreativ lysdesign drevet af AI. Design, gem og afspil DMX lysshows med Claude AI.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made with Claude](https://img.shields.io/badge/Made%20with-Claude-orange.svg)](https://www.anthropic.com/claude)

![Make Light Interface](https://via.placeholder.com/800x400/0a0a0a/ffcc00?text=Make+Light+-+AI+DMX+Control)

## ✨ Features

- **AI Lysdesign**: Claude AI laver kreative lysdesigns baseret på sangtitel og stemning
- **Interaktiv Kontrol**: Swipe mellem sangdele og aktiver lys i real-time
- **Song Library**: Gem og organiser lysdesigns som en setliste
- **6-Zone System**: Kontroller lys i front/mid/back på højre og venstre side
- **DMX Output**: Send direkte til DMX-fixtures via ESP8266

## 📋 Indhold

- [Quick Start](#-quick-start)
- [Installation](#installation)
  - [Web App Setup](#1-web-app-setup)
  - [ESP8266 Setup](#2-esp8266-setup)
  - [Claude API Setup](#3-claude-api-setup)
- [Brugervejledning](#-brugervejledning)
- [DMX Mapping](#-dmx-mapping)
- [Troubleshooting](#-troubleshooting)
- [Bidrag](#-bidrag)

---

## 🚀 Quick Start

### 1. Web App Setup

#### Hosting på GitHub Pages:

1. **Opret GitHub Repository**
   ```bash
   git init
   git add make-light.html
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/DIT_BRUGERNAVN/make-light.git
   git push -u origin main
   ```

2. **Aktiver GitHub Pages**
   - Gå til repository Settings
   - Vælg "Pages" i sidepanelet
   - Under "Source", vælg "main" branch
   - Gem og vent på deployment
   - Din app vil være tilgængelig på: `https://DIT_BRUGERNAVN.github.io/MakeLight/make-light.html`

3. **Alternativ: Lokal Hosting**
   ```bash
   # Start en simpel HTTP server
   python3 -m http.server 8000
   # Eller med Node.js
   npx http-server
   ```

### 2. ESP8266 Setup

#### Hardware:
- ESP8266 (NodeMCU eller Wemos D1 Mini)
- RS485 to TTL Converter module (MAX485 eller lignende)
- DMX-stik (XLR 3-pin eller 5-pin)

#### Kabling:
```
ESP8266 GPIO2 → MAX485 DI (Data Input)
ESP8266 GND   → MAX485 GND
ESP8266 3.3V  → MAX485 VCC
MAX485 DE/RE  → 3.3V (always transmitting)
MAX485 A      → DMX Pin 3 (Data+)
MAX485 B      → DMX Pin 2 (Data-)
DMX Pin 1     → GND
```

#### Software Installation:

1. **Install Arduino IDE**
   - Download fra https://www.arduino.cc/en/software

2. **Setup ESP8266 Board**
   - I Arduino IDE: File → Preferences
   - Under "Additional Board Manager URLs", tilføj:
     ```
     http://arduino.esp8266.com/stable/package_esp8266com_index.json
     ```
   - Tools → Board → Board Manager
   - Søg efter "esp8266" og installer

3. **Install Libraries**
   - Tools → Manage Libraries
   - Install: "ArduinoJson" by Benoit Blanchon

4. **Upload Code**
   - Åbn `make-light-dmx.ino`
   - Rediger WiFi credentials:
     ```cpp
     const char* ssid = "DIT_WIFI_NAVN";
     const char* password = "DIT_WIFI_PASSWORD";
     ```
   - Vælg board: "NodeMCU 1.0 (ESP-12E Module)"
   - Vælg port og upload

5. **Find ESP8266 IP Address**
   - Åbn Serial Monitor (115200 baud)
   - Efter boot vil IP-adressen blive vist
   - Gem denne til webapp settings

### 3. Claude API Setup

1. **Få API Key**
   - Gå til https://console.anthropic.com/
   - Opret en konto eller log ind
   - Gå til "API Keys"
   - Opret en ny nøgle
   - Kopier nøglen (den starter med `sk-ant-`)

2. **Tilføj til App**
   - Åbn Make Light webapp
   - Klik på ⚙ (settings)
   - Indsæt din Claude API key
   - Indsæt ESP8266 IP address
   - Gem indstillinger

## 📖 Brugervejledning

### Opret Lysdesign:

1. **Start App**
   - Klik "Make Light"
   
2. **Indtast Song**
   - Skriv sangtitel og kunstner (f.eks. "Human - Rag & Bone Man")
   - Tryk Enter eller vent på AI-spørgsmål

3. **Besvar Spørgsmål**
   - AI vil spørge om stemning, farvetemperatur, osv.
   - Vælg muligheder eller klik "Skip"
   - Klik "Generate Light"

4. **Test og Juster**
   - Se visualisering af de 6 zoner
   - Klik "Test Light" for at sende til lamper
   - Giv feedback og klik "Refine" for at justere
   - Når tilfreds, klik "Save"

### Afspil Lysshow:

1. **Gå til Song Library**
   - Klik "Song Library" fra home screen
   
2. **Vælg Sang**
   - Klik på en sang for at åbne den
   - Sangstrukturen vises (intro, verse, chorus, osv.)

3. **Aktiver Lys**
   - Klik på en del (f.eks. "intro") for at aktivere
   - Lyset sendes automatisk til lamperne

4. **Swipe Kontrol**
   - Swipe til højre = næste del
   - Swipe til venstre = forrige del
   - Hold en del inde i 1 sek. for at hoppe direkte

## 🔧 DMX Mapping

Standard zone-mapping (kan tilpasses i koden):

```javascript
Front Right: Channels 1-7
Front Left:  Channels 8-14
Mid Right:   Channels 15-21
Mid Left:    Channels 22-28
Back Right:  Channels 29-35
Back Left:   Channels 36-42
```

### Typisk 7-kanal RGB Fixture Layout:
1. Red
2. Green
3. Blue
4. Dimmer/Intensity
5. Strobe
6. (Function)
7. (Speed)

### Tilpas til Dine Lamper:

I `make-light.html`, find funktionen `zonesToDMX()` og ret channel-mapping:

```javascript
const zoneChannelMap = {
    'front_right': { start: 1, channels: 7 },   // Start kanal 1, 7 kanaler
    'front_left': { start: 8, channels: 7 },    // Start kanal 8, 7 kanaler
    // Tilføj flere zoner eller ret start-kanaler
};
```

## 🎨 Avancerede Features

### Tilføj Flere Zoner:

1. I `generateLight()` AI-prompt, ret zone-liste
2. I `zonesToDMX()`, tilføj nye zone-mappings
3. I CSS, ret `.dmx-zones` grid for layout

### Custom Lampetyper:

For moving heads, par cans, eller andre fixture-typer:

```javascript
// Eksempel: Moving head med pan/tilt
const movingHeadMapping = {
    pan: dmxChannels[start],
    tilt: dmxChannels[start + 1],
    color: dmxChannels[start + 2],
    dimmer: dmxChannels[start + 3],
    // osv.
};
```

### Live AI Justering:

I fremtidige versioner kan AI lytte med via microphone og justere live:

```javascript
// Eksempel koncept
navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        // Analyser audio
        // Send til Claude med "adjust based on current music"
    });
```

## 🐛 Troubleshooting

### "Cannot reach DMX controller"
- Check ESP8266 er tændt og forbundet til WiFi
- Verificer IP-adresse i settings matcher ESP8266
- Test ESP8266 ved at åbne `http://ESP_IP` i browser

### "Error generating questions"
- Verificer Claude API key er korrekt
- Check internetforbindelse
- Kontroller API quota på Anthropic console

### DMX lys virker ikke
- Mål spænding på DMX-linjen (skal være ~2-5V mellem A og B)
- Check RS485 modul er koblet korrekt
- Verificer DMX-terminering (120Ω resistor mellem A og B på sidste fixture)
- Test med DMX software (QLC+ eller lignende) for at isolere problemet

### ESP8266 crasher
- Reducer DMX refresh rate (øg delay i `loop()`)
- Check strømforsyning (ESP8266 skal have stabil 3.3V)
- Reducer antal aktive DMX-kanaler

## 📚 Teknisk Arkitektur

### Frontend Stack:
- Vanilla HTML/CSS/JavaScript
- Claude API integration
- LocalStorage for persistence
- Touch/Swipe gestures

### Backend (ESP8266):
- ESP8266WebServer for HTTP API
- ArduinoJson for JSON parsing
- Custom DMX implementation (250kbaud UART)
- ~44 Hz DMX refresh rate

### AI Integration:
- Claude Sonnet 4 for creative light design
- Structured JSON output
- Multi-turn refinement
- Context-aware suggestions

## 🔐 Sikkerhed

⚠️ **Vigtige sikkerhedsnoter:**

1. **API Key**: Gem ALDRIG din Claude API key i public repositories
2. **CORS**: Web appen sender requests til ESP8266 - sikr dit netværk
3. **Rate Limiting**: Claude API har rate limits - implementer caching for production

## 📈 Roadmap

### Version 2.0 (Planlagt):
- [ ] Auto-discovery af lamper og kanaler
- [ ] Live audio analysis med AI-justering
- [ ] Multi-user collaboration
- [ ] Cloud backup af lysdesigns
- [ ] Advanced effekter (chase, fade, osv.)
- [ ] MIDI sync for præcis timing
- [ ] Mobile app (iOS/Android)

## 🤝 Bidrag

Dette projekt er open source! Bidrag er velkomne:

1. Fork projektet
2. Opret feature branch (`git checkout -b feature/amazing-feature`)
3. Commit ændringer (`git commit -m 'Add amazing feature'`)
4. Push til branch (`git push origin feature/amazing-feature`)
5. Åbn Pull Request

## 📄 Licens

MIT License - se LICENSE fil for detaljer

## 💡 Credits

- AI-powered by Anthropic Claude
- DMX protocol implementation inspired by ESTA E1.11
- Built with love for lighting designers 🎭

## 📞 Support

Problemer eller spørgsmål? 
- Åbn en issue på GitHub
- Check troubleshooting guide ovenfor
- Test med simpel DMX-kontrol først (QLC+)

---

**Make Light** - Lav lyset med AI ✨
