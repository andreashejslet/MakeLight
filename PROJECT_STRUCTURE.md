# Make Light - Project Structure

## 📁 Alle Filer (Klar til GitHub)

```
make-light/
│
├── 📄 index.html                  # Landing page (redirects til make-light.html)
├── 🎨 make-light.html             # Main webapp (AI + DMX control)
├── ⚙️  make-light-dmx.ino          # ESP8266 firmware (Arduino)
├── 🔧 dmx-config.json             # DMX fixture konfiguration
│
├── 📖 README.md                   # Hovedguide med installation & brug
├── 📋 CHECKLIST.md                # Pre-upload checklist
├── 🚀 DEPLOYMENT.md               # GitHub Pages deployment guide
├── 🔨 HARDWARE.md                 # Shopping list & wiring guide
├── 🤝 CONTRIBUTING.md             # Contribution guidelines
│
├── 📜 LICENSE                     # MIT License
├── 🙈 .gitignore                  # Git ignore fil (beskytter secrets)
└── 📦 package.json                # Project metadata
```

**Total: 12 filer** ✨

---

## 🎯 Fil Oversigt

### Core Files (Applikationen)

#### `index.html` (1.3 KB)
- Simple landing page
- Redirecter automatisk til `make-light.html`
- Viser loading spinner

#### `make-light.html` (42 KB) ⭐ HOVEDFIL
**Komplet webapp med:**
- ✅ AI integration (Claude API)
- ✅ 3 screens: Home, Create, Song Library
- ✅ DMX zone visualization (6 zoner)
- ✅ Real-time lysdesign
- ✅ Touch/swipe kontrol
- ✅ LocalStorage persistence
- ✅ Settings panel
- ✅ Minimalistisk design

**Features:**
- "Make Light" button → AI questions → Generate design
- Song library med setlist funktionalitet
- Live refinement med AI feedback
- Swipe mellem song parts
- DMX HTTP API integration

#### `make-light-dmx.ino` (5.8 KB) ⭐ HARDWARE
**ESP8266 firmware med:**
- ✅ WiFi HTTP server
- ✅ DMX512 output (250kbaud UART)
- ✅ 44 Hz refresh rate
- ✅ JSON API endpoints
- ✅ CORS enabled
- ✅ Status monitoring

**API Endpoints:**
- `POST /dmx` - Send DMX data
- `GET /status` - Current status
- `POST /blackout` - All lights off
- `GET /` - Web interface

#### `dmx-config.json` (3.9 KB)
**Konfigurerer:**
- 6 zone layout (front/mid/back L/R)
- Fixture types (RGB PAR, moving heads, etc.)
- Channel mappings
- AI mood presets
- Network settings

---

### Documentation Files

#### `README.md` (8.8 KB)
**Hovedguide med:**
- Feature oversigt
- Quick start guide
- Installation (Web + ESP8266 + API)
- Brugervejledning
- DMX mapping
- Troubleshooting
- Roadmap

#### `DEPLOYMENT.md` (3.9 KB)
**GitHub Pages specifik guide:**
- Step-by-step repository setup
- GitHub Pages aktivering
- CORS og sikkerhed
- Custom domain setup
- Fejlfinding

#### `HARDWARE.md` (8.5 KB)
**Komplet hardware guide:**
- 🛒 Shopping list (~110-210kr)
- 🔌 Wiring diagram (ASCII art)
- 🔧 Assembly steps
- ⚡ Power considerations
- 🧪 Testing procedures
- ⚠️ Troubleshooting
- 📐 PCB design tips

#### `CONTRIBUTING.md` (1.8 KB)
**For contributors:**
- Bug reports
- Feature requests
- Code style
- Pull request process

#### `CHECKLIST.md` (3.3 KB)
**Pre-upload checklist:**
- ✅ File verification
- ⚠️ Security checks
- 📤 Upload steps
- 🌐 Post-upload verification

---

### Meta Files

#### `LICENSE` (1.1 KB)
MIT License - Open source, fri brug

#### `.gitignore` (218 bytes)
Beskytter:
- Sensitive configs (`config.local.json`)
- Environment variables (`.env`)
- IDE files
- System files

#### `package.json` (749 bytes)
Project metadata:
- Name, version, description
- Scripts (local server)
- Keywords for søgning
- Repository links

---

## 🔐 Sikkerhed

### ✅ Hvad der GEM­MES lokalt (sikkert):
- Claude API key → Browser LocalStorage
- ESP8266 IP → Browser LocalStorage
- Lysdesigns → Browser LocalStorage

### ❌ Hvad der ALDRIG committes:
- Din rigtige Claude API key
- WiFi credentials
- Personlige konfigurationer

### 🛡️ Beskyttelsesmekanismer:
- `.gitignore` blokerer sensitive filer
- Placeholders i kode (`YOUR_WIFI_SSID`)
- CHECKLIST.md reminder før upload

---

## 📊 Kode Statistik

| Type | Lines of Code | Kommentar |
|------|---------------|-----------|
| HTML/CSS/JS | ~1,100 lines | Single-file webapp |
| Arduino C++ | ~250 lines | ESP8266 firmware |
| JSON Config | ~100 lines | DMX mapping |
| Documentation | ~800 lines | 5 guide filer |
| **Total** | **~2,250 lines** | Production-ready |

---

## 🎨 Design Features

### Webapp Aesthetic:
- **Font**: Space Mono (monospace) + Cormorant Garamond (serif)
- **Color scheme**: Dark (#0a0a0a) med amber accent (#ffcc00)
- **Layout**: Minimalistisk, focus on content
- **Animations**: Subtle fade-ins, smooth transitions
- **Mobile**: Touch-optimized, swipe gestures

### UX Flow:
```
Home Screen
    ↓ "Make Light"
Create Screen
    ↓ Input song → AI questions → Generate
Light Preview
    ↓ Test → Refine → Save
Song Library
    ↓ Select song → Activate parts
Live Control
    ↓ Swipe between parts
```

---

## 🚀 Deployment Options

### Option 1: GitHub Pages (Anbefalet) ⭐
**Fordele:**
- ✅ Gratis hosting
- ✅ HTTPS automatisk
- ✅ Global CDN
- ✅ Auto-deploy ved push

**Steps:** Se `DEPLOYMENT.md`

### Option 2: Lokal Server
```bash
python3 -m http.server 8000
# eller
npx http-server
```

### Option 3: Netlify/Vercel
- Drop alle filer i deres web interface
- Automatisk HTTPS og custom domain

---

## 🎓 Tech Stack

### Frontend:
- Vanilla JavaScript (no frameworks)
- CSS3 (animations, grid, flexbox)
- LocalStorage API
- Fetch API
- Touch Events API

### AI:
- Claude Sonnet 4 API
- JSON structured outputs
- Multi-turn conversations

### Hardware:
- ESP8266 (NodeMCU)
- RS485 (MAX485 module)
- DMX512 protocol
- UART serial communication

### Protocols:
- HTTP/REST API
- DMX512-A (ESTA E1.11)
- JSON over HTTP

---

## 📈 Upgrade Path

### Version 1.0 (Nuværende):
✅ AI light design
✅ Manual control
✅ 6-zone system
✅ Song library

### Version 2.0 (Planlagt):
- [ ] Audio analysis (live AI adjustment)
- [ ] Auto-discovery af fixtures
- [ ] MIDI sync
- [ ] Multi-user collaboration
- [ ] Cloud backup
- [ ] Mobile app (React Native)
- [ ] Advanced effects (chase, fade, etc.)

---

## 🎯 Quick Start (TL;DR)

1. **Upload til GitHub** (følg `CHECKLIST.md`)
2. **Aktiver GitHub Pages**
3. **Byg hardware** (følg `HARDWARE.md` - ~150kr)
4. **Upload ESP8266 firmware**
5. **Konfigurer webapp** (API key + ESP IP)
6. **Lav dit første lysdesign!** 🎭

---

## 🏆 Credits

**Built with:**
- 🤖 Claude Sonnet 4 (Anthropic)
- 💡 DMX512-A protocol
- 🔧 ESP8266 community
- 🎨 Open source design principles

**Made for:**
- 🎭 Lighting designers
- 🎵 Musicians
- 🎪 Event producers
- 💡 Anyone who loves creative lighting!

---

**Make Light - Lav lyset med AI** ✨

Version 1.0 | MIT License | 2026
