# Make Light - Avanceret Guide

## 🎨 Lysdesign Best Practices

### AI Prompting Tips

**Specifikke beskrivelser giver bedre resultater:**

❌ Dårligt: "Make light for sang"
✅ Godt: "Make light for Human by Rag & Bone Man - powerful, hopeful, building energy"

❌ Dårligt: "Lav noget lys til gudstjeneste"
✅ Godt: "Make light for worship intro - peaceful, warm white, subtle blues"

### Effektive Spørgsmål fra AI

AI'en kan stille spørgsmål som:

1. **Stemning** (Mood)
   - Dystert / Dark
   - Håbefuldt / Hopeful  
   - Energisk / Energetic
   - Fredfuldt / Peaceful
   - Dramatisk / Dramatic
   - Festligt / Celebratory

2. **Farvetemperatur**
   - Kolde farver (blå, cyan, lilla)
   - Varme farver (orange, gul, rød)
   - Blandede / Mixed
   - Neutral hvid

3. **Intensitet**
   - Lav (20-40%)
   - Mellem (50-70%)
   - Høj (80-100%)
   - Dynamisk (varierer gennem sangen)

### Feedback-sprog

AI forstår feedback som:

- **Farver**: "mere blåt", "mindre rødt", "tilføj lilla", "kun varme farver"
- **Intensitet**: "for kraftigt", "dæmp det ned", "gør det lysere"
- **Zoner**: "mere baggrundslys", "fokuser på koret", "brug moving heads"
- **Timing**: "langsommere fade", "hurtigere skift", "smoothere overgange"

## 🎼 Sangstruktur Tips

### Typisk Sangstruktur

De fleste sange følger dette mønster:

```
INTRO → VERSE 1 → CHORUS → VERSE 2 → CHORUS → BRIDGE → CHORUS → OUTRO
```

### Lysdesign per Sektion

**INTRO** (Introduktion)
- Start stille og opbyggende
- Ofte mørke eller neutrale farver
- Brug subtile accenter
- Sæt stemningen for sangen

Eksempel: "front_right wash blue 30, mid_center spot warm_white 40"

**VERSE** (Vers)
- Moderat intensitet
- Fokus på fortælleren/sangeren
- Simpelt design der ikke distraherer
- Opbyg gradvist

Eksempel: "front_right wash blue 60, front_left wash purple 50, mid_center spot warm_white 70"

**CHORUS** (Omkvæd)
- Højeste intensitet
- Fuldt spektrum af farver
- Alle zoner aktiveret
- Emotionel klimaks

Eksempel: "front_right wash orange 100, front_left wash yellow 100, mid_center spot warm_white 100, back_right wash amber 80"

**BRIDGE** (Bro)
- Kontrast til chorus
- Ofte køligere farver eller dramatisk skift
- Skaber spænding før finalt chorus
- Eksperimentel

Eksempel: "front_right wash cyan 70, front_left wash blue 90, mid_center spot cold_white 85"

**OUTRO** (Afslutning)
- Fade ud gradvist
- Tilbage til intro-følelse
- Stille og reflekterende
- Lad rummet "ånde"

Eksempel: "front_right wash blue 20, mid_center spot warm_white 30"

## 🔧 Avancerede DMX Teknikker

### Custom Farver

AI forstår disse farve-navne:

- **Primære**: red, green, blue, white
- **Sekundære**: orange, yellow, cyan, magenta, purple
- **Nuancer**: warm_white, cold_white, amber, uv
- **Kombinationer**: "warm orange", "deep blue", "soft purple"

### Zones og Targeting

**Zones** beskriver lampens fysiske placering:
- front_right, front_left
- mid_right, mid_left, mid_center
- back_right, back_left

**Targets** beskriver hvad lampen lyser på:
- choir_ceiling (kor og loft)
- vault (hvælving)
- wall (væg)
- choir_band_front (direkte front lys)

### Moving Head Tricks

Moving heads kan bruges til:

1. **Spotlights**: Fokuseret lys på solister
2. **Ceiling washes**: Farver på loftet
3. **Dynamic movement**: (kræver pan/tilt programmering)

Eksempel kommando:
```
"moving_head_left spot white 100 pan:127 tilt:90, moving_head_right spot white 100 pan:127 tilt:90"
```

## 🎭 Scenarier og Eksempler

### Scenario 1: Stille Lovsang

**Sang**: "10,000 Reasons (Bless The Lord)" - Matt Redman

**AI Prompt**: 
"Make light for 10,000 Reasons by Matt Redman - peaceful worship, warm and intimate"

**Forventet Output**:
```json
{
  "intro": "front_right wash warm_white 40, front_left wash amber 35",
  "verse": "front_right wash warm_white 60, front_left wash amber 55, mid_center spot warm_white 50",
  "chorus": "front_right wash warm_white 80, front_left wash amber 75, mid_center spot warm_white 90, back_right wash warm_white 40",
  "bridge": "front_right wash orange 70, front_left wash yellow 65, mid_center spot warm_white 85",
  "outro": "front_right wash warm_white 30, mid_center spot warm_white 35"
}
```

### Scenario 2: Kraftfuld Anthem

**Sang**: "What a Beautiful Name" - Hillsong Worship

**AI Prompt**:
"Make light for What a Beautiful Name - powerful, building energy, hopeful"

**Forventet Output**:
```json
{
  "intro": "front_right wash blue 50, front_left wash cyan 45, mid_center spot cold_white 40",
  "verse": "front_right wash blue 70, front_left wash purple 65, mid_center spot warm_white 75",
  "chorus": "front_right wash orange 100, front_left wash yellow 100, mid_center spot warm_white 100, back_right wash amber 90, back_left wash orange 85",
  "bridge": "front_right wash cyan 85, front_left wash blue 90, mid_center spot cold_white 95, back_right wash blue 70",
  "outro": "front_right wash blue 40, front_left wash cyan 35, mid_center spot warm_white 50"
}
```

### Scenario 3: Moderne Worship

**Sang**: "Graves Into Gardens" - Elevation Worship

**AI Prompt**:
"Make light for Graves Into Gardens - dramatic, hope rising from darkness"

**Forventet Output**:
```json
{
  "intro": "front_right wash blue 20, mid_center spot cold_white 25",
  "verse": "front_right wash purple 40, front_left wash blue 35, mid_center spot warm_white 50",
  "chorus": "front_right wash orange 90, front_left wash yellow 85, mid_center spot warm_white 95, back_right wash amber 75",
  "bridge": "front_right wash cyan 80, front_left wash blue 85, moving_head_left spot white 90, moving_head_right spot white 90",
  "outro": "front_right wash warm_white 70, front_left wash amber 65, mid_center spot warm_white 80"
}
```

## 📊 Performance Optimization

### DMX Refresh Rate

ESP8266 sender DMX pakker ~44 gange per sekund (44Hz). Dette er tilstrækkeligt for:
- Smooth fades
- Color changes
- Basic effects

For mere avancerede effekter (hurtige strobes, chase patterns), overvej:
- ESP32 (hurtigere processor)
- Dedikeret DMX interface (ArtNet, sACN)

### WiFi Stabilitet

**Tips til bedre forbindelse:**

1. Brug 2.4GHz WiFi (ikke 5GHz)
2. Placer ESP8266 centralt
3. Undgå metal-indkapsling
4. Brug static IP (færre DNS lookups)
5. Dedikeret WiFi netværk til lys (hvis muligt)

### App Performance

**Browser-baseret app:**
- Fungerer bedst i Chrome/Edge
- Minimal latency (~50-200ms)
- Kan køre på tablet ved siden af lyspult

**Fremtidig Native App:**
- Lavere latency
- Offline funktionalitet
- Bedre touch gestures
- Push notifications

## 🎓 Lær AI'en

### Feedback Loop

Jo mere du bruger appen, jo bedre bliver AI'en til at forstå dine præferencer:

1. **Første gang**: AI gætter baseret på sang-titel og genre
2. **Efter feedback**: AI justerer baseret på dine kommentarer
3. **Gentagne sange**: AI husker tidligere designs (fremtidig feature)
4. **Personlig stil**: AI lærer din kirkes æstetik

### Træn AI med Specifikke Eksempler

Hvis du vil have et bestemt look, vær meget specifik:

"Make light for [sang] - EXACTLY like this: front lights warm amber 80%, moving heads focused on soloist with soft white, background vault lights deep blue 40%, no red colors"

### Gem Custom Presets

I fremtidige versioner kan du gemme:
- Farve-paletter ("Christmas colors", "Easter pastels")
- Intensitets-profiler ("Intimate worship", "High energy")
- Zone-konfigurationer ("Focus on choir", "Full church")

## 🔮 Fremtidige Features

### AI Song Learning

AI vil kunne:
- Analysere MP3 filer for BPM, key, energy
- Auto-detektere sang-struktur
- Foreslå lys baseret på lignende sange
- Synkronisere til beat i real-time

### Advanced Effects Engine

Kommende effekter:
- **Fades**: Gradvis overgang mellem farver
- **Chases**: Sekvenser af lys der "løber"
- **Strobes**: Pulserender til beats
- **Patterns**: Geometriske mønstre på loft/vægge

### Cloud Integration

- Backup alle designs til cloud
- Del designs med andre kirker
- Download populære "packs" (Christmas, Easter, etc.)
- Sync mellem multiple devices

### Physical Controllers

Integration med:
- MIDI controllers (faders, knobs, pads)
- DMX lightboards (hybrid control)
- Foot switches (handsfree section changes)
- Stream Deck (custom buttons)

## 💡 Pro Tips

### Live Performance

1. **Test før gudstjeneste**: Kør hele setlisten igennem dagen før
2. **Backup plan**: Hav en "safe" preset til hver sang
3. **Fade times**: Lav længere fades for langsom musik (3-5 sek), kortere for uptempo (1-2 sek)
4. **Section markers**: Markér sektioner i dine noder så du ved hvornår du skal swipe

### Collaboration

1. **Lystekniker + Worship Leader**: Tag noter sammen om ønsket feel
2. **Dokumenter**: Skriv noter til hver sang ("mere blue i bridge næste gang")
3. **Video**: Optag gudstjenesten for at review lyset bagefter

### Eksperimenter Trygt

Fordi alt er software-baseret:
- Test vilde ideer i rehearsal
- Gem multiple versioner af samme sang
- Ingen risiko for at ødelægge hardware
- Nemt at gå tilbage til tidligere version

---

**Husk**: Make Light er et værktøj til at forstærke worship, ikke erstatte den. Det bedste lys opstår når teknologi og ånd arbejder sammen! 🙏✨
