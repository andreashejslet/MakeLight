# Make Light - AI-Powered DMX Lighting Control

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![ESP8266](https://img.shields.io/badge/ESP8266-Arduino-green.svg)](https://github.com/esp8266/Arduino)

En intelligent app til at styre DMX-lys i kirker med AI-assistance. Appen lader dig beskrive hvad du vil have lys til (f.eks. en bestemt sang), stiller relevante spørgsmål, og genererer smagfuldt, atmosfærisk lys tilpasset til din kirkes setup.

## 🎭 Features

- **AI-drevet lysdesign**: Beskriv hvad du vil med simpel tekst
- **Intelligent dialog**: AI stiller relevante spørgsmål om stemning, farver, intensitet
- **Sang-strukturering**: Lav forskellige lys til intro, vers, omkvæd, bridge, outro
- **Real-time kontrol**: Swipe mellem sangdele under live performance
- **Setlist-system**: Gem og genaktivér sanglys-designs
- **DMX-engine**: Omsætter AI-kommandoer til DMX512-signaler
- **ESP8266 integration**: Trådløs kontrol via WiFi

## 📋 Krav

### Hardware
- ESP8266 (NodeMCU, Wemos D1 Mini, eller lignende)
- RS485 til DMX converter (MAX485 chip)
- DMX-lamper (se lampeopsætning nedenfor)
- WiFi netværk

### Software
- Node.js (v18 eller nyere)
- Arduino IDE (til ESP8266 programmering)
- Moderne webbrowser eller React Native environment

## 🚀 Installation

### Del 1: ESP8266 DMX Controller

1. **Installer Arduino IDE og ESP8266 board support**
   - Download Arduino IDE fra https://www.arduino.cc/en/software
   - Tilføj ESP8266 board manager URL: `http://arduino.esp8266.com/stable/package_esp8266com_index.json`
   - Installer ESP8266 board via Tools > Board > Boards Manager

2. **Installer nødvendige biblioteker**
   - ArduinoJson (via Library Manager)
   - ESP8266WiFi (inkluderet i ESP8266 core)
   - ESP8266WebServer (inkluderet i ESP8266 core)

3. **Hardware forbindelser**
   ```
   ESP8266      →  RS485 Module  →  DMX Connector
   GPIO2 (D4)   →  DI/TX         →  XLR Pin 3 (Data+)
   GND          →  GND           →  XLR Pin 1 (Ground)
   3V3/5V       →  VCC           →  (Ingen forbindelse)
                                  →  XLR Pin 2 (Data-)
   ```

4. **Konfigurer og upload koden**
   - Åbn `esp8266_dmx_controller.ino` i Arduino IDE
   - Rediger WiFi credentials i toppen af filen:
     ```cpp
     const char* ssid = "DIT_WIFI_NAVN";
     const char* password = "DIT_WIFI_PASSWORD";
     ```
   - Rediger IP-adresse hvis nødvendigt:
     ```cpp
     IPAddress local_IP(192, 168, 1, 100);
     ```
   - Vælg dit ESP8266 board under Tools > Board
   - Vælg den korrekte port under Tools > Port
   - Klik Upload

5. **Verificer forbindelse**
   - Åbn Serial Monitor (115200 baud)
   - Du skulle se ESP8266's IP-adresse
   - Besøg IP-adressen i din browser (f.eks. http://192.168.1.100)
   - Du skulle se DMX controller status-siden

### Del 2: Make Light App

1. **Clone/download projektet**
   ```bash
   cd make-light-app
   ```

2. **Installer dependencies**
   ```bash
   npm install
   ```

3. **Konfigurer ESP8266 IP i appen**
   - Når appen starter, klik på ⚙️ i øverste højre hjørne
   - Indtast din ESP8266's IP-adresse

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Åbn appen**
   - Browseren burde åbne automatisk på http://localhost:3000
   - Ellers åbn den manuelt

## 🎨 Lampeopsætning

Din nuværende opsætning (kan opdateres i koden):

### Zoner
- **Front Right**: Frontlys højre side
- **Front Left**: Frontlys venstre side  
- **Mid Right**: Midt højre (moving heads, batterilys)
- **Mid Left**: Midt venstre (moving heads, batterilys)
- **Mid Center**: Centrum/altar område
- **Back Right**: Bagvæg højre
- **Back Left**: Bagvæg venstre

### Lamper

| Type | Navn | DMX Start | Zone | Target |
|------|------|-----------|------|--------|
| Baisun 60 LED Par | Right Mast | 1 | front_right | choir_ceiling |
| Baisun 60 LED Par | Left Mast | 17 | front_left | choir_ceiling |
| Baisun 60 LED Par | Vault 1 | 33 | mid_back | vault |
| Baisun 60 LED Par | Vault 2 | 40 | mid_center | vault_altar |
| Baisun 60 LED Par | Vault 3 | 49 | mid_back | vault |
| Moving Head | Left | 65 | left_mid | ceiling_choir |
| Moving Head | Right | 81 | right_mid | ceiling_choir |
| Battery LED | Left Front | 97 | left_front | side_wall |
| Battery LED | Left Back | 113 | left_back | back_wall |
| Battery LED | Right Back | 129 | right_back | back_wall |
| Battery LED | Right Front | 145 | right_front | side_wall |
| White Par 100W | Right | 161 | right_front | choir_band_front |
| White Par 100W | Left | 177 | left_front | choir_band_front |

## 📱 Brug af Appen

### 1. Opret Ny Sang

1. Klik på **"Make Light"** knappen på startsiden
2. Skriv f.eks. "Make Light for Human - Rag & Bone Man"
3. AI vil enten:
   - Stille afklarende spørgsmål (stemning, farver, intensitet)
   - Eller generere lys direkte hvis sangen er kendt

### 2. Besvar AI Spørgsmål (Valgfrit)

- Svar på spørgsmål som "Hvad stemning?", "Kolde eller varme farver?"
- Eller klik **"Skip"** for at lade AI beslutte

### 3. Test Lyset

- Efter AI har genereret design får du beskeden: **"...and there was light - try it out"**
- Klik **"Test Light"** for at se resultatet
- Giv feedback: "For kraftigt", "Mere blåt", "Perfekt" osv.
- AI vil justere og vise nyt design

### 4. Gem Sangen

- Når du er tilfreds, klik **"Save"**
- Sangen gemmes i din setlist

### 5. Afspil Live

1. Gå til **Setlist**-siden
2. Klik på en sang for at aktivere den
3. Sangens sektioner vises (INTRO, VERSE, CHORUS, etc.)
4. Swipe med **←** og **→** knapperne for at skifte sektion
5. Hold en sektion inde i 1 sekund for at springe tilbage til den

## 🔧 Udvikling og Tilpasning

### Tilføj Flere Lamper

Rediger `DMX_CONFIG` i `make-light-app.jsx`:

```javascript
const DMX_CONFIG = {
  fixtures: {
    my_new_light: {
      name: "My New Light",
      type: "par",  // eller "moving_head", "battery", "white_par"
      startChannel: 193,  // Din lampes start-kanal
      zone: "front_right",  // Hvilken zone
      channels: { dim: 0, r: 1, g: 2, b: 3 },  // Kanal layout
      target: "wall"  // Hvad lampen lyser på
    }
  }
}
```

### Juster AI Prompts

AI'ens system prompt kan tilpasses i `LightingAI.analyzeRequest()` metoden for at:
- Ændre spørgsmålsstil
- Tilføje specifikke farve-preferencer
- Justere intensitets-standarder
- Tilpasse til forskellige musikgenrer

### Tilføj Musikdatabase Integration

Integrer med Spotify API eller MusicBrainz for at:
- Automatisk genkende sange
- Hente BPM og energy levels
- Analysere sangstruktur automatisk

### Real-time Lydstyring

Tilføj Web Audio API til at:
- Synkronisere lys med musik i real-time
- Reagere på beats og frekvenser
- Automatisk skifte sektioner baseret på lydanalyse

## 🎯 Næste Steps (Roadmap)

### Fase 2 Features
- [ ] Forbedret AI der lærer af dine justeringer over tid
- [ ] Musikdatabase integration (Spotify/MusicBrainz)
- [ ] Real-time audio analyse og sync
- [ ] Smoothere overgange mellem sektioner
- [ ] Visualisering af aktivt lys i appen

### Fase 3 Features
- [ ] AI-assisteret lampeopsætning (auto-detect DMX)
- [ ] Avancerede effekter (strobes, fades, chases)
- [ ] Multi-universe DMX support
- [ ] Cloud backup af setlists
- [ ] Mobile app (iOS/Android via React Native)

## 🐛 Troubleshooting

### ESP8266 forbinder ikke til WiFi
- Check SSID og password er korrekte
- Sørg for 2.4GHz WiFi (ESP8266 understøtter ikke 5GHz)
- Prøv at disable static IP configuration
- Check Serial Monitor for fejlbeskeder

### App kan ikke kommunikere med ESP8266
- Verificer ESP8266 IP-adresse er korrekt i app settings
- Sørg for app og ESP8266 er på samme netværk
- Check firewall settings
- Test ved at besøge http://[ESP_IP]/ i browser

### DMX-signaler når ikke lamperne
- Check RS485 forbindelser (især polarity)
- Verificer DMX kabel kvalitet og terminering
- Test med en enkelt lampe først
- Brug en DMX tester hvis muligt

### AI genererer ikke godt lys
- Vær mere specifik i dine beskrivelser
- Besvar AI's spørgsmål i stedet for at skippe
- Giv konstruktiv feedback efter første test
- Prøv forskellige sange/stemninger for at "træne" AI

## 📄 Licens

Dette projekt er open source. Brug det frit til dit kirke-setup!

## 🙏 Bidrag

Pull requests er velkomne! Forslag til forbedringer:
- Bedre AI prompts for specifikke musikgenrer
- Integration med populære kirke-lydsystemer
- Preset lysdesigns til forskellige gudstjeneste-typer
- Oversættelser til andre sprog

## 🤝 Bidrag

Vi modtager gerne bidrag! Se [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Måder at bidrage på:**
- 🐛 Rapportér bugs via [Issues](../../issues)
- 💡 Foreslå nye features
- 🎨 Del dine lysdesigns og presets
- 📝 Forbedre dokumentation
- 🌍 Oversæt til andre sprog

## 📧 Support

Har du spørgsmål eller problemer? 
- 📖 Check [ADVANCED_GUIDE.md](ADVANCED_GUIDE.md) for detaljerede tips
- 💬 Start en diskussion i [Discussions](../../discussions)
- 🐛 Rapportér bugs i [Issues](../../issues)

## 🗺️ Project Structure

Se [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for komplet oversigt over kodebasen.

## 📜 Licens

Dette projekt er licenseret under MIT License - se [LICENSE](LICENSE) filen for detaljer.

---

**Made with ❤️ for the church lighting community**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/make-light-app?style=social)](../../stargazers)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/make-light-app)](../../issues)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
