# Make Light - Project Structure

```
make-light-app/
│
├── 📱 Frontend (React Web App)
│   ├── index.html              # HTML entry point
│   ├── main.jsx                # React app bootstrap
│   ├── make-light-app.jsx      # Main app component
│   ├── vite.config.js          # Vite build configuration
│   └── package.json            # NPM dependencies
│
├── 🔌 Hardware (ESP8266)
│   └── esp8266_dmx_controller.ino  # Arduino code for DMX output
│
├── 📚 Documentation
│   ├── README.md               # Main documentation
│   ├── ADVANCED_GUIDE.md       # Advanced usage & tips
│   ├── CONTRIBUTING.md         # Contribution guidelines
│   └── PROJECT_STRUCTURE.md    # This file
│
├── ⚙️ Configuration
│   ├── .gitignore              # Git ignore rules
│   └── LICENSE                 # MIT License
│
└── 🚀 Future Additions (Roadmap)
    ├── /mobile/                # React Native iOS/Android app
    ├── /api/                   # Optional cloud backend
    ├── /presets/               # Community lighting presets
    └── /docs/                  # Extended documentation
```

## Key Components

### Frontend App (`make-light-app.jsx`)

**Main Sections:**
- `DMX_CONFIG` - Lighting fixture configuration
- `DMXEngine` - Converts AI commands to DMX signals
- `LightingAI` - Claude API integration for lighting design
- `MakeLightApp` - Main React component with screens:
  - Home: Initial "Make Light" interface
  - Create: AI dialog and lighting generation
  - Setlist: Song management and live control

**Key Features:**
- AI-powered lighting design
- Real-time DMX control via WiFi
- Song structure management (intro, verse, chorus, etc.)
- Swipe navigation between sections
- Feedback loop for AI refinement

### ESP8266 Controller (`esp8266_dmx_controller.ino`)

**Main Functions:**
- `dmxInit()` - Initialize DMX output on GPIO2
- `dmxSendPacket()` - Send 512-channel DMX packet
- `handleDMX()` - Receive lighting commands from app
- `dmxBlackout()` - Emergency all-lights-off

**Web API Endpoints:**
- `GET /` - Status dashboard
- `POST /dmx` - Update DMX channels
- `GET /status` - JSON status info
- `POST /blackout` - All lights off

## Data Flow

```
User Input (Song request)
    ↓
AI Analysis (Claude API)
    ↓
Lighting Design (JSON with sections)
    ↓
User Feedback Loop (Refinement)
    ↓
DMX Commands (e.g., "front_right wash blue 80")
    ↓
DMX Engine (Parsing & channel mapping)
    ↓
WiFi → ESP8266 (HTTP POST)
    ↓
DMX512 Signal (RS485)
    ↓
Physical Lights
```

## Configuration Files

### Lighting Fixture Setup

Edit `DMX_CONFIG` in `make-light-app.jsx`:

```javascript
const DMX_CONFIG = {
  fixtures: {
    fixture_name: {
      name: "Display Name",
      type: "par|moving_head|battery|white_par",
      startChannel: 1,
      zone: "front_right|front_left|mid_center|...",
      channels: { dim: 0, r: 1, g: 2, b: 3 },
      target: "choir_ceiling|wall|vault|..."
    }
  }
}
```

### ESP8266 Network

Edit `esp8266_dmx_controller.ino`:

```cpp
const char* ssid = "YOUR_WIFI";
const char* password = "YOUR_PASSWORD";
IPAddress local_IP(192, 168, 1, 100);
```

## Development Workflow

### Local Development

1. **Start ESP8266**: Upload Arduino code, note IP address
2. **Start App**: `npm run dev` (opens http://localhost:3000)
3. **Configure**: Set ESP8266 IP in app settings
4. **Test**: Create lights and verify DMX output

### Building for Production

```bash
npm run build
# Creates /dist folder with optimized files
```

### Deployment Options

- **Web Hosting**: Upload `/dist` to any static host
- **Local Network**: Run on local server/Raspberry Pi
- **Native App**: Convert to React Native for iOS/Android

## Extending the System

### Add New Fixture Types

1. Add fixture definition to `DMX_CONFIG`
2. Extend `DMXEngine.setFixture()` with channel mapping
3. Update AI system prompt with new capabilities

### Improve AI Prompts

Edit the `system` prompt in `LightingAI.analyzeRequest()`:
- Add genre-specific knowledge
- Include color theory guidance
- Define church-specific vocabulary

### Add Music Integration

Future integration points:
- Spotify API (song metadata, BPM, energy)
- Web Audio API (real-time audio analysis)
- MusicBrainz (song structure detection)

## Testing

### Manual Testing Checklist

- [ ] WiFi connection (ESP8266 → Router)
- [ ] HTTP communication (App → ESP8266)
- [ ] DMX output (ESP8266 → Lights)
- [ ] AI responses (prompt quality)
- [ ] UI interactions (swipe, save, load)
- [ ] Error handling (connection loss, etc.)

### Hardware Testing

- [ ] Single fixture control
- [ ] Multi-fixture synchronization
- [ ] Full universe (512 channels)
- [ ] Refresh rate (no flicker)
- [ ] Long-duration stability

## Future Enhancements

See [ADVANCED_GUIDE.md](ADVANCED_GUIDE.md) for roadmap details.

---

Questions? Check [README.md](README.md) or create an [Issue](../../issues)!
