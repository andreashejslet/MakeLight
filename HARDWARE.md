# Hardware Guide - Shopping List & Wiring

Alt hvad du behøver for at bygge Make Light DMX controller.

## 🛒 Shopping List

### Nødvendige Komponenter

| Komponent | Pris (ca.) | Link Eksempel |
|-----------|-----------|---------------|
| **ESP8266 NodeMCU** | 30-50 kr | [AliExpress](https://www.aliexpress.com/), [Amazon](https://www.amazon.com/) |
| **MAX485 TTL to RS485 Module** | 10-20 kr | [AliExpress](https://www.aliexpress.com/) |
| **XLR 3-pin Male Connector** | 15-30 kr | [Thomann](https://www.thomann.de/), lokal musikbutik |
| **Breadboard Jumper Wires** | 20-40 kr | [AliExpress](https://www.aliexpress.com/) |
| **USB Cable (Micro USB)** | 15-30 kr | Genbruges fra gammel telefon |
| **Power Supply 5V** | 20-40 kr | USB adapter eller power bank |

**Total: ~110-210 kr** 💰

### Anbefalede Ekstra Komponenter

| Komponent | Pris (ca.) | Hvorfor? |
|-----------|-----------|----------|
| **Case/Box** | 30-50 kr | Beskytter elektronik |
| **LED indicator** | 5-10 kr | Viser DMX aktivitet |
| **120Ω Resistor** | 2-5 kr | DMX terminering |
| **Prototype PCB** | 15-30 kr | Permanent montering |

---

## 🔌 Wiring Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      ESP8266 NodeMCU                        │
│                                                             │
│  [3.3V]────────────────────────┐                           │
│                                 │                           │
│  [GND]─────────────────────┐   │                           │
│                             │   │                           │
│  [GPIO2/D4]────────────┐   │   │                           │
│                         │   │   │                           │
└─────────────────────────┼───┼───┼───────────────────────────┘
                          │   │   │
                          │   │   │
                   ┌──────▼───▼───▼────────┐
                   │    MAX485 Module      │
                   │                       │
                   │  DI ◄── GPIO2         │
                   │  GND ◄── GND          │
                   │  VCC ◄── 3.3V         │
                   │  DE/RE ◄── 3.3V       │
                   │                       │
                   │  A ──────┐            │
                   │  B ──────┼───┐        │
                   └──────────┼───┼────────┘
                              │   │
                              │   │
                   ┌──────────▼───▼────────┐
                   │   XLR 3-pin Male      │
                   │                       │
                   │  Pin 1 ── GND         │
                   │  Pin 2 ── Data- (B)   │
                   │  Pin 3 ── Data+ (A)   │
                   │                       │
                   │  (Shield to Pin 1)    │
                   └───────────────────────┘
                              │
                              │ DMX Cable
                              │
                    ┌─────────▼──────────┐
                    │   DMX Fixtures     │
                    └────────────────────┘
```

---

## 🔧 Step-by-Step Assembly

### 1. Forbered Komponenter
- Læg alle dele frem
- Check at ESP8266 virker (tilslut USB, LED skal lyse)
- Identificer pins på MAX485 modul

### 2. Tilslut MAX485 til ESP8266

**På breadboard:**

1. Sæt ESP8266 og MAX485 på breadboard
2. Forbind pins med jumper wires:

```
ESP8266         →    MAX485
────────────────────────────
3.3V (3V3)      →    VCC
GND             →    GND
GPIO2 (D4)      →    DI (Data Input)
3.3V (3V3)      →    DE (Driver Enable)
3.3V (3V3)      →    RE (Receiver Enable)
```

> **💡 Tip:** Brug farvede wires:
> - Rød: 3.3V
> - Sort: GND
> - Gul/Grøn: Data

### 3. Forbered XLR Connector

**Lodning:**

1. Strip ca. 5cm af skærmen på DMX kabel
2. Eksponer 3 ledninger: Shield (skærm), Data+, Data-
3. Tin ledningerne
4. Lod til XLR pins:
   - Pin 1: Shield/GND
   - Pin 2: Data- (forbind til MAX485 B)
   - Pin 3: Data+ (forbind til MAX485 A)

**Husk:** DMX bruger 120Ω terminering på sidste fixture i kæden!

### 4. Final Assembly

```
MAX485 A (Data+)  →  XLR Pin 3 (rød/hvid ledning typisk)
MAX485 B (Data-)  →  XLR Pin 2 (sort/grøn ledning typisk)
GND               →  XLR Pin 1 (shield/skærm)
```

### 5. Strømforsyning

**Option 1: USB Power**
- Tilslut ESP8266 til USB adapter (5V, min. 500mA)
- Simpelt og nemt til test

**Option 2: Ekstern Power**
- Brug 5V regulator hvis du har højere spænding
- ESP8266 har indbygget voltage regulator (5V → 3.3V)

---

## ⚡ Power Considerations

| Scenarie | Strømforbrug | Anbefaling |
|----------|--------------|------------|
| Kun ESP8266 | ~80mA | USB phone charger (500mA+) |
| ESP8266 + MAX485 | ~100mA | USB adapter (1A) |
| Med LED indicators | ~120mA | USB adapter (1A) |

**ESP8266 kan forsyne MAX485** da strømforbruget er lavt (kun sender, ingen DMX-lamper drives direkte).

---

## 🧪 Testing

### Test 1: Basis Connectivity
```arduino
void setup() {
  Serial.begin(115200);
  pinMode(2, OUTPUT);
}
void loop() {
  digitalWrite(2, HIGH);
  Serial.println("HIGH");
  delay(500);
  digitalWrite(2, LOW);
  Serial.println("LOW");
  delay(500);
}
```
Upload til ESP8266. LED på GPIO2 skal blinke.

### Test 2: MAX485 Output
- Mål spænding mellem A og B på MAX485
- Skulle være ~2-5V når DMX sendes
- Brug multimeter på AC voltage mode

### Test 3: DMX Signal
- Tilslut til en DMX lampe
- Send test kommando fra webapp
- Lampen skal reagere

---

## 🔒 Case/Enclosure

### DIY Option:
- Lille plastikboks (10x6x3cm ca.)
- Bor huller til:
  - USB kabel (strøm)
  - XLR connector (DMX out)
  - Status LED (optional)

### 3D Print Option:
- Design i Tinkercad eller Fusion 360
- Print i PLA eller PETG
- Mount points til ESP8266 og MAX485

---

## ⚠️ Troubleshooting

### Intet DMX Signal
✅ Check at MAX485 får strøm (3.3V på VCC)
✅ Verificer GPIO2 er forbundet til DI
✅ Mål spænding mellem A og B (skal være 2-5V)
✅ Check at DE og RE er forbundet til 3.3V (transmit mode)

### Lamper reagerer ikke
✅ Verificer DMX kabel er korrekt forbundet
✅ Check lampe DMX adresser matcher din konfiguration
✅ Test med kommerciel DMX controller først
✅ Tilføj 120Ω resistor mellem A og B på sidste lampe (terminering)

### ESP8266 Crasher
✅ Reducer DMX refresh rate i koden
✅ Check strømforsyning er stabil (min 500mA)
✅ Brug kortere DMX kabel til test
✅ Verificer ingen kortslutninger

### DMX Flicker
✅ Tilføj terminerings-resistor (120Ω mellem A og B)
✅ Brug twisted pair DMX kabel
✅ Reducer kabellængde hvis over 100m
✅ Check for elektrisk støj fra andre enheder

---

## 📐 Advanced: PCB Design

Hvis du vil lave en permanent løsning:

1. Design PCB i KiCad eller EasyEDA
2. Inkluder:
   - ESP8266 footprint
   - MAX485 footprint
   - XLR connector footprint
   - USB power input
   - Status LEDs
   - Mounting holes
3. Bestil fra JLCPCB eller PCBWay (~50-100kr for 5 stk)

---

## 📦 Complete Kit Recommendation

Hvis du vil købe et komplet kit i stedet for at samle selv:

**Alternative: Kommercielle DMX USB Interfaces**
- ENTTEC DMX USB Pro (~600kr)
- Freestyler (~400kr)

Disse kan også bruges med Make Light, men kræver driver integration i stedet for ESP8266.

---

## 🎓 Lær Mere

- [DMX512 Protocol Basics](https://en.wikipedia.org/wiki/DMX512)
- [ESP8266 Documentation](https://arduino-esp8266.readthedocs.io/)
- [RS485 Explained](https://en.wikipedia.org/wiki/RS-485)

---

**Held og lykke med byggeriet! 🔨**

Spørgsmål? Åbn en issue på GitHub!
