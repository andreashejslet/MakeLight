# GitHub Pages Deployment Guide

Følg denne guide for at deploye Make Light til GitHub Pages.

## Før du starter

✅ Du skal have:
- En GitHub konto
- Git installeret på din computer
- Claude API nøgle (får du på https://console.anthropic.com/)

## Step-by-Step Deployment

### 1. Opret GitHub Repository

1. Gå til https://github.com/new
2. Repository navn: `make-light` (eller vælg dit eget)
3. Vælg **Public** (nødvendigt for gratis GitHub Pages)
4. **IKKE** initialize with README (du har allerede en)
5. Klik "Create repository"

### 2. Upload til GitHub

Åbn terminal/command prompt i projektmappen:

```bash
# Initialize git repository
git init

# Add alle filer
git add .

# Første commit
git commit -m "Initial commit: Make Light v1.0"

# Tilføj remote (erstat YOUR_USERNAME med dit GitHub brugernavn)
git remote add origin https://github.com/YOUR_USERNAME/MakeLight.git

# Push til GitHub
git branch -M main
git push -u origin main
```

### 3. Aktiver GitHub Pages

1. Gå til dit repository på GitHub
2. Klik på **Settings** (tandhjul-ikon øverst)
3. I venstre menu, klik **Pages**
4. Under **Source**:
   - Vælg branch: `main`
   - Folder: `/ (root)`
5. Klik **Save**

⏱️ Vent 1-2 minutter mens GitHub bygger dit site.

### 4. Find din Live URL

Din app vil være tilgængelig på:
```
https://YOUR_USERNAME.github.io/make-light/
```

GitHub viser URL'en under Settings → Pages når den er klar.

### 5. Konfigurer Appen

1. Åbn din live app URL
2. Klik på ⚙️ (settings)
3. Indtast din Claude API key
4. Indtast din ESP8266 IP adresse
5. Gem settings

🎉 **Din app er nu live!**

## Opdater Appen

Når du laver ændringer:

```bash
# Add ændringer
git add .

# Commit
git commit -m "Beskrivelse af ændringer"

# Push til GitHub
git push
```

GitHub Pages opdateres automatisk efter 1-2 minutter.

## Sikkerhed og Privacy

⚠️ **Vigtige sikkerhedsnoter:**

### ✅ SIKKERT (data gemmes kun lokalt):
- Claude API key gemmes i browser LocalStorage
- Lysdesigns gemmes i browser LocalStorage
- ESP8266 IP adresse gemmes i browser LocalStorage

### ❌ ALDRIG commit til GitHub:
- Din Claude API key
- WiFi credentials i ESP8266 kode
- Personlige konfigurationer

### 🔒 Best Practices:
1. Gem aldrig API keys i koden
2. Brug `.gitignore` til sensitive filer
3. Review altid hvad du committer med `git status`
4. Overvej private repository hvis du deler sensitive configs

## CORS og ESP8266

Hvis din browser blokerer requests til ESP8266:

### Løsning 1: CORS Headers (allerede implementeret)
ESP8266 koden har CORS enabled:
```cpp
server.enableCORS(true);
```

### Løsning 2: Samme Netværk
Sørg for:
- Din computer og ESP8266 er på samme WiFi
- Firewall tillader lokal netværkstrafik

### Løsning 3: HTTPS (advanced)
For production brug kan du:
- Sætte HTTPS op på ESP8266 (komplekst)
- Bruge en proxy server

## Fejlfinding

### "Permission denied" ved git push
```bash
# Hvis du bruger HTTPS, opdater remote til SSH:
git remote set-url origin git@github.com:YOUR_USERNAME/make-light.git
```

### "GitHub Pages ikke fundet (404)"
- Vent 2-3 minutter efter første deployment
- Check at branch er sat til `main` i Pages settings
- Verificer at `index.html` findes i root

### "API key virker ikke"
- Check at key er korrekt i settings
- Verificer quota på https://console.anthropic.com/
- Åbn browser console (F12) for fejlmeddelelser

## Custom Domain (Optional)

Hvis du har dit eget domæne:

1. I GitHub Pages settings, under "Custom domain", indtast dit domæne
2. Tilføj DNS records hos din domain provider:
   ```
   Type: CNAME
   Name: www (eller subdomain)
   Value: YOUR_USERNAME.github.io
   ```
3. Enable "Enforce HTTPS"

## Næste Skridt

✅ Test appen online
✅ Lav dit første lysdesign
✅ Del URL'en med andre lighting designers!

Problemer? Åbn en issue på GitHub: https://github.com/YOUR_USERNAME/MakeLight/issues
