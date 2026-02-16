# ✅ GitHub Upload Checklist

Før du uploader til GitHub, check følgende:

## 📋 Pre-Upload Checklist

### Filer at uploade:
- [ ] `index.html` - Landing page (redirecter til make-light.html)
- [ ] `make-light.html` - Main webapp
- [ ] `make-light-dmx.ino` - ESP8266 firmware
- [ ] `dmx-config.json` - DMX fixture konfiguration
- [ ] `README.md` - Hovedguide
- [ ] `LICENSE` - MIT License
- [ ] `.gitignore` - Beskytter sensitive filer
- [ ] `package.json` - Project metadata
- [ ] `CONTRIBUTING.md` - Contribution guide
- [ ] `DEPLOYMENT.md` - GitHub Pages deployment guide
- [ ] `HARDWARE.md` - Hardware shopping list & wiring

### ⚠️ VIGTIGE SIKKERHEDSCHECKS:

- [ ] **Verificer at `make-light-dmx.ino` IKKE indeholder dine rigtige WiFi credentials**
  - Skal være: `YOUR_WIFI_SSID` og `YOUR_WIFI_PASSWORD`
  
- [ ] **Check at ingen API keys er hardcoded i `make-light.html`**
  - API key skal KUN gemmes i browser LocalStorage, ikke i koden
  
- [ ] **Review `.gitignore` filen**
  - Beskytter `config.local.json` og `.env` filer

### 🔄 Før første commit:

1. **Åbn `package.json` og ret:**
   ```json
   "repository": {
     "url": "https://github.com/DIT_BRUGERNAVN/make-light.git"
   }
   "author": "Dit Navn"
   ```

2. **Test appen lokalt:**
   ```bash
   # Start lokal server
   python3 -m http.server 8000
   # Eller
   npx http-server
   ```
   Åbn http://localhost:8000

3. **Verificer alle filer er inkluderet:**
   ```bash
   ls -la
   ```
   Du skal kunne se alle 11 filer ovenfor.

### 📤 Upload Steps:

```bash
# 1. Initialize git
git init

# 2. Add alle filer
git add .

# 3. Check hvad der bliver committed (VIGTIG!)
git status

# 4. Første commit
git commit -m "Initial commit: Make Light v1.0"

# 5. Tilføj remote (ret DIT_BRUGERNAVN)
git remote add origin https://github.com/DIT_BRUGERNAVN/make-light.git

# 6. Push til GitHub
git branch -M main
git push -u origin main
```

### 🌐 Efter Upload:

- [ ] Gå til repository Settings → Pages
- [ ] Vælg `main` branch, root folder
- [ ] Vent 2 minutter
- [ ] Test live URL: `https://DIT_BRUGERNAVN.github.io/MakeLight/`

### 🔧 Konfigurer Live App:

1. Åbn live URL
2. Klik ⚙️ settings
3. Indtast Claude API key (fra https://console.anthropic.com/)
4. Indtast ESP8266 IP adresse
5. Gem

---

## 🎉 Success Criteria:

✅ Alle filer uploadet uden fejl
✅ GitHub Pages deployment lykkedes
✅ Live webapp loader korrekt
✅ Kan indtaste API key og settings
✅ Ingen private data er committed

---

## 🆘 Hvis noget går galt:

### "Git is not recognized"
Download og installer Git: https://git-scm.com/

### "Remote already exists"
```bash
git remote remove origin
git remote add origin https://github.com/DIT_BRUGERNAVN/make-light.git
```

### "Permission denied"
Sikr du er logget ind på GitHub i browser og har adgang til repository.

### "GitHub Pages not working"
- Vent 3-5 minutter efter første push
- Check Settings → Pages status
- Verificer `index.html` findes i root

---

## 📞 Næste Steps:

1. **Hardware Setup** - Følg `HARDWARE.md` guide
2. **ESP8266 Upload** - Åbn `make-light-dmx.ino` i Arduino IDE
3. **Test DMX Output** - Tilslut en lampe og test
4. **Lav første lysdesign!** 🎭

---

**Klar til upload!** 🚀

Når alt er tjekket af, kør upload kommandoerne ovenfor.
