import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// DMX CONFIGURATION - Church lighting setup
// ============================================================================

const DMX_CONFIG = {
  fixtures: {
    // Baisun 60 LED Par Lights (60x3w) - lys på band/kor eller loft/væg bag kor
    baisun_right_mast: {
      name: "Baisun Right Mast",
      type: "par",
      startChannel: 1,
      zone: "right_front",
      channels: { dim: 0, r: 1, g: 2, b: 3, strobe: 4, effect: 5, strobeSpeed: 6 },
      target: "choir_ceiling"
    },
    baisun_left_mast: {
      name: "Baisun Left Mast", 
      type: "par",
      startChannel: 17,
      zone: "left_front",
      channels: { dim: 0, r: 1, g: 2, b: 3, strobe: 4, effect: 5, strobeSpeed: 6 },
      target: "choir_ceiling"
    },
    baisun_vault_1: {
      name: "Baisun Vault 1",
      type: "par", 
      startChannel: 33,
      zone: "mid_back",
      channels: { dim: 0, r: 1, g: 2, b: 3, strobe: 4, effect: 5, strobeSpeed: 6 },
      target: "vault"
    },
    baisun_vault_2: {
      name: "Baisun Vault 2",
      type: "par",
      startChannel: 40, 
      zone: "mid_center",
      channels: { dim: 0, r: 1, g: 2, b: 3, strobe: 4, effect: 5, strobeSpeed: 6 },
      target: "vault_altar"
    },
    baisun_vault_3: {
      name: "Baisun Vault 3",
      type: "par",
      startChannel: 49,
      zone: "mid_back",
      channels: { dim: 0, r: 1, g: 2, b: 3, strobe: 4, effect: 5, strobeSpeed: 6 },
      target: "vault"
    },
    
    // XpCleoyz moving head 7x12w - lys på loft lige over og bag kor
    moving_head_left: {
      name: "Moving Head Left",
      type: "moving_head",
      startChannel: 65,
      zone: "left_mid",
      channels: { 
        pan: 0, panFine: 1, tilt: 2, tiltFine: 3, motorSpeed: 4, 
        dim: 5, strobe: 6, colorJump: 7, colorJumpSpeed: 8,
        r: 9, g: 10, b: 11, w: 12, reset: 13
      },
      target: "ceiling_choir"
    },
    moving_head_right: {
      name: "Moving Head Right",
      type: "moving_head", 
      startChannel: 81,
      zone: "right_mid",
      channels: {
        pan: 0, panFine: 1, tilt: 2, tiltFine: 3, motorSpeed: 4,
        dim: 5, strobe: 6, colorJump: 7, colorJumpSpeed: 8, 
        r: 9, g: 10, b: 11, w: 12, reset: 13
      },
      target: "ceiling_choir"
    },
    
    // BKing LED battery 4x18w - lys op ad sidevæg og på bagvæg
    battery_left_front: {
      name: "Battery Left Front",
      type: "battery",
      startChannel: 97,
      zone: "left_front",
      channels: { r: 0, g: 1, b: 2, w: 3, a: 4, uv: 5 },
      target: "side_wall"
    },
    battery_left_back: {
      name: "Battery Left Back",
      type: "battery",
      startChannel: 113, 
      zone: "left_back",
      channels: { r: 0, g: 1, b: 2, w: 3, a: 4, uv: 5 },
      target: "back_wall"
    },
    battery_right_back: {
      name: "Battery Right Back",
      type: "battery",
      startChannel: 129,
      zone: "right_back", 
      channels: { r: 0, g: 1, b: 2, w: 3, a: 4, uv: 5 },
      target: "back_wall"
    },
    battery_right_front: {
      name: "Battery Right Front",
      type: "battery",
      startChannel: 145,
      zone: "right_front",
      channels: { r: 0, g: 1, b: 2, w: 3, a: 4, uv: 5 },
      target: "side_wall"
    },
    
    // White Par LED 100w - lys front på kor og band
    white_par_right: {
      name: "White Par Right",
      type: "white_par",
      startChannel: 161,
      zone: "right_front",
      channels: { cold: 0, warm: 1 },
      target: "choir_band_front"
    },
    white_par_left: {
      name: "White Par Left", 
      type: "white_par",
      startChannel: 177,
      zone: "left_front",
      channels: { cold: 0, warm: 1 },
      target: "choir_band_front"
    }
  }
};

// ============================================================================
// DMX ENGINE - Converts AI commands to DMX signals
// ============================================================================

class DMXEngine {
  constructor(esp8266IP) {
    this.ip = esp8266IP;
    this.dmxBuffer = new Array(512).fill(0);
    this.config = DMX_CONFIG;
  }
  
  parseAICommand(command) {
    // Command format: "front_right wash blue full, front_left wash orange 50, mid_center spot white 80"
    const parts = command.split(',').map(p => p.trim());
    const dmxChanges = [];
    
    parts.forEach(part => {
      const tokens = part.split(' ');
      const zone = tokens[0] + '_' + tokens[1]; // e.g., "front_right"
      const fixtureType = tokens[2]; // "wash", "spot", "moving"
      const color = tokens[3]; // "blue", "orange", "white"
      const intensity = tokens[4] ? parseInt(tokens[4]) : 100;
      
      // Find fixtures in this zone
      Object.entries(this.config.fixtures).forEach(([key, fixture]) => {
        if (fixture.zone === zone || zone === 'all') {
          const rgb = this.colorNameToRGB(color);
          const channels = this.setFixture(fixture, rgb, intensity);
          dmxChanges.push({ fixture: key, channels });
        }
      });
    });
    
    return dmxChanges;
  }
  
  colorNameToRGB(colorName) {
    const colors = {
      red: [255, 0, 0],
      orange: [255, 128, 0],
      yellow: [255, 255, 0],
      green: [0, 255, 0],
      cyan: [0, 255, 255],
      blue: [0, 0, 255],
      purple: [128, 0, 255],
      magenta: [255, 0, 255],
      white: [255, 255, 255],
      warm_white: [255, 200, 150],
      cold_white: [200, 220, 255],
      amber: [255, 191, 0],
      uv: [148, 0, 211]
    };
    return colors[colorName.toLowerCase()] || [255, 255, 255];
  }
  
  setFixture(fixture, rgb, intensity) {
    const [r, g, b] = rgb.map(v => Math.floor(v * intensity / 100));
    const start = fixture.startChannel - 1;
    const channels = {};
    
    if (fixture.type === 'par' || fixture.type === 'battery') {
      if (fixture.channels.dim !== undefined) {
        this.dmxBuffer[start + fixture.channels.dim] = intensity * 2.55;
        channels.dim = intensity * 2.55;
      }
      this.dmxBuffer[start + fixture.channels.r] = r;
      this.dmxBuffer[start + fixture.channels.g] = g;
      this.dmxBuffer[start + fixture.channels.b] = b;
      channels.r = r;
      channels.g = g;
      channels.b = b;
      
      if (fixture.channels.w !== undefined) {
        this.dmxBuffer[start + fixture.channels.w] = Math.max(r, g, b);
        channels.w = Math.max(r, g, b);
      }
    } else if (fixture.type === 'moving_head') {
      this.dmxBuffer[start + fixture.channels.dim] = intensity * 2.55;
      this.dmxBuffer[start + fixture.channels.r] = r;
      this.dmxBuffer[start + fixture.channels.g] = g;
      this.dmxBuffer[start + fixture.channels.b] = b;
      this.dmxBuffer[start + fixture.channels.w] = Math.max(r, g, b);
      channels.dim = intensity * 2.55;
      channels.r = r;
      channels.g = g;  
      channels.b = b;
      channels.w = Math.max(r, g, b);
    } else if (fixture.type === 'white_par') {
      const isWarm = rgb[0] > rgb[2];
      this.dmxBuffer[start + fixture.channels.warm] = isWarm ? intensity * 2.55 : 0;
      this.dmxBuffer[start + fixture.channels.cold] = !isWarm ? intensity * 2.55 : 0;
      channels.warm = isWarm ? intensity * 2.55 : 0;
      channels.cold = !isWarm ? intensity * 2.55 : 0;
    }
    
    return channels;
  }
  
  async sendDMX() {
    try {
      const response = await fetch(`http://${this.ip}/dmx`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channels: Array.from(this.dmxBuffer) })
      });
      return response.ok;
    } catch (error) {
      console.error('DMX send error:', error);
      return false;
    }
  }
  
  blackout() {
    this.dmxBuffer.fill(0);
    return this.sendDMX();
  }
}

// ============================================================================
// AI SERVICE - Claude API integration for lighting design
// ============================================================================

class LightingAI {
  async analyzeRequest(userInput, context = {}) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: `You are a church lighting designer AI for the Make Light app. You design tasteful, atmospheric DMX lighting for worship music.

Available zones: front_right, front_left, mid_right, mid_left, mid_center, back_right, back_left
Available fixtures: par lights (colorful washes), moving heads (dynamic spots), battery lights (subtle accents), white pars (front light)
Color options: red, orange, yellow, green, cyan, blue, purple, magenta, white, warm_white, cold_white, amber, uv

Your role:
1. Ask 2-3 clarifying questions if needed (mood, color temperature, intensity)
2. Generate lighting commands in this format: "front_right wash blue 80, mid_center spot warm_white 100"
3. Create different looks for song sections (intro, verse, chorus, bridge, outro)
4. Learn from user feedback and iterate

Always respond in JSON format:
{
  "questions": ["What mood? (dark/hopeful/energetic)", "Color preference? (warm/cold/mixed)"],
  "lighting_command": "front_right wash blue 80, front_left wash blue 80, mid_center spot warm_white 60",
  "section_variations": {
    "intro": "front_right wash blue 50, mid_center spot cold_white 40",
    "verse": "front_right wash blue 70, front_left wash purple 60, mid_center spot warm_white 80",
    "chorus": "front_right wash orange 100, front_left wash yellow 100, mid_center spot warm_white 100, back_right wash amber 70",
    "bridge": "front_right wash cyan 60, front_left wash blue 80, mid_center spot cold_white 90",
    "outro": "front_right wash blue 30, mid_center spot warm_white 50"
  }
}`,
        messages: [
          { 
            role: "user", 
            content: `User request: "${userInput}"\nContext: ${JSON.stringify(context)}\n\nGenerate lighting design or ask clarifying questions.`
          }
        ]
      })
    });
    
    const data = await response.json();
    const text = data.content.find(c => c.type === "text")?.text || "{}";
    const cleanText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanText);
  }
  
  async refineDesign(originalDesign, userFeedback) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: `You are refining a lighting design based on user feedback. Adjust colors, intensities, or zones accordingly.
        
Return JSON with updated lighting_command and section_variations.`,
        messages: [
          {
            role: "user",
            content: `Original design: ${JSON.stringify(originalDesign)}\nUser feedback: "${userFeedback}"\n\nProvide refined design.`
          }
        ]
      })
    });
    
    const data = await response.json();
    const text = data.content.find(c => c.type === "text")?.text || "{}";
    const cleanText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanText);
  }
}

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function MakeLightApp() {
  const [screen, setScreen] = useState('home'); // 'home', 'create', 'setlist'
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [activeSongId, setActiveSongId] = useState(null);
  const [activeSection, setActiveSection] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [aiQuestions, setAiQuestions] = useState([]);
  const [aiAnswers, setAiAnswers] = useState({});
  const [lightingDesign, setLightingDesign] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [testingMode, setTestingMode] = useState(false);
  const [esp8266IP, setEsp8266IP] = useState('192.168.1.100');
  const [showSettings, setShowSettings] = useState(false);
  
  const dmxEngine = useRef(new DMXEngine(esp8266IP));
  const lightingAI = useRef(new LightingAI());
  
  useEffect(() => {
    dmxEngine.current = new DMXEngine(esp8266IP);
  }, [esp8266IP]);

  // ============================================================================
  // HANDLERS
  // ============================================================================
  
  const handleMakeLight = async () => {
    if (!userInput.trim()) return;
    
    setScreen('create');
    setIsGenerating(true);
    setAiQuestions([]);
    setAiAnswers({});
    
    try {
      const aiResponse = await lightingAI.current.analyzeRequest(userInput);
      
      if (aiResponse.questions && aiResponse.questions.length > 0) {
        setAiQuestions(aiResponse.questions);
        setIsGenerating(false);
      } else {
        setLightingDesign(aiResponse);
        setIsGenerating(false);
        setTestingMode(true);
      }
    } catch (error) {
      console.error('AI error:', error);
      setIsGenerating(false);
    }
  };
  
  const handleAnswerQuestions = async () => {
    setIsGenerating(true);
    
    try {
      const context = { userInput, answers: aiAnswers };
      const aiResponse = await lightingAI.current.analyzeRequest(userInput, context);
      setLightingDesign(aiResponse);
      setIsGenerating(false);
      setTestingMode(true);
    } catch (error) {
      console.error('AI error:', error);
      setIsGenerating(false);
    }
  };
  
  const handleSkipQuestions = async () => {
    setIsGenerating(true);
    
    try {
      const aiResponse = await lightingAI.current.analyzeRequest(userInput, { skipQuestions: true });
      setLightingDesign(aiResponse);
      setIsGenerating(false);
      setTestingMode(true);
    } catch (error) {
      console.error('AI error:', error);
      setIsGenerating(false);
    }
  };
  
  const handleTestLight = async () => {
    if (!lightingDesign?.lighting_command) return;
    
    const dmxChanges = dmxEngine.current.parseAICommand(lightingDesign.lighting_command);
    await dmxEngine.current.sendDMX();
  };
  
  const handleFeedback = async (feedback) => {
    setIsGenerating(true);
    
    try {
      const refinedDesign = await lightingAI.current.refineDesign(lightingDesign, feedback);
      setLightingDesign(refinedDesign);
      setIsGenerating(false);
    } catch (error) {
      console.error('AI refinement error:', error);
      setIsGenerating(false);
    }
  };
  
  const handleSaveSong = () => {
    if (!lightingDesign) return;
    
    const newSong = {
      id: Date.now(),
      name: userInput,
      design: lightingDesign,
      sections: Object.keys(lightingDesign.section_variations || { intro: "", verse: "", chorus: "", outro: "" })
    };
    
    setSongs([...songs, newSong]);
    setScreen('setlist');
    setUserInput('');
    setLightingDesign(null);
    setTestingMode(false);
  };
  
  const handleActivateSong = (song) => {
    setActiveSongId(song.id);
    setCurrentSong(song);
    setActiveSection(0);
    
    const firstSection = song.sections[0];
    const command = song.design.section_variations[firstSection];
    dmxEngine.current.parseAICommand(command);
    dmxEngine.current.sendDMX();
  };
  
  const handleSwipeSection = (direction) => {
    if (!currentSong) return;
    
    const newIndex = direction === 'next' 
      ? Math.min(activeSection + 1, currentSong.sections.length - 1)
      : Math.max(activeSection - 1, 0);
    
    setActiveSection(newIndex);
    
    const section = currentSong.sections[newIndex];
    const command = currentSong.design.section_variations[section];
    dmxEngine.current.parseAICommand(command);
    dmxEngine.current.sendDMX();
  };
  
  const handleJumpToSection = (index) => {
    setActiveSection(index);
    const section = currentSong.sections[index];
    const command = currentSong.design.section_variations[section];
    dmxEngine.current.parseAICommand(command);
    dmxEngine.current.sendDMX();
  };

  // ============================================================================
  // RENDER FUNCTIONS
  // ============================================================================
  
  const renderHome = () => (
    <div style={styles.container}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.homeContent}
      >
        <h1 style={styles.logo}>Make Light</h1>
        
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleMakeLight()}
            placeholder="Make light for..."
            style={styles.input}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMakeLight}
            style={styles.makeLightButton}
          >
            Make Light
          </motion.button>
        </div>
        
        {songs.length > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => setScreen('setlist')}
            style={styles.setlistButton}
          >
            View Setlist ({songs.length})
          </motion.button>
        )}
        
        <button onClick={() => setShowSettings(!showSettings)} style={styles.settingsButton}>
          ⚙️
        </button>
        
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={styles.settingsPanel}
          >
            <label style={styles.label}>ESP8266 IP Address:</label>
            <input
              type="text"
              value={esp8266IP}
              onChange={(e) => setEsp8266IP(e.target.value)}
              style={styles.settingsInput}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
  
  const renderCreate = () => (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={styles.createContent}
      >
        <h2 style={styles.createTitle}>{userInput}</h2>
        
        {aiQuestions.length > 0 && !testingMode && (
          <div style={styles.questionsContainer}>
            {aiQuestions.map((question, idx) => (
              <div key={idx} style={styles.questionBlock}>
                <p style={styles.question}>{question}</p>
                <input
                  type="text"
                  value={aiAnswers[idx] || ''}
                  onChange={(e) => setAiAnswers({ ...aiAnswers, [idx]: e.target.value })}
                  style={styles.answerInput}
                  placeholder="Your answer..."
                />
              </div>
            ))}
            
            <div style={styles.questionButtons}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAnswerQuestions}
                style={styles.primaryButton}
              >
                Generate Light
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSkipQuestions}
                style={styles.secondaryButton}
              >
                Skip
              </motion.button>
            </div>
          </div>
        )}
        
        {isGenerating && (
          <div style={styles.generatingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.generatingText}>Creating light...</p>
          </div>
        )}
        
        {testingMode && lightingDesign && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={styles.testingContainer}
          >
            <p style={styles.andThereWasLight}>...and there was light</p>
            <p style={styles.tryItOut}>try it out</p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTestLight}
              style={styles.testButton}
            >
              Test Light
            </motion.button>
            
            <div style={styles.feedbackContainer}>
              <p style={styles.feedbackPrompt}>How does it feel?</p>
              <input
                type="text"
                placeholder="Too bright, needs more blue, perfect..."
                style={styles.feedbackInput}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleFeedback(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
            </div>
            
            <div style={styles.sectionsPreview}>
              <p style={styles.sectionsTitle}>Sections:</p>
              {Object.keys(lightingDesign.section_variations || {}).map((section) => (
                <span key={section} style={styles.sectionTag}>{section}</span>
              ))}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveSong}
              style={styles.saveButton}
            >
              Save
            </motion.button>
          </motion.div>
        )}
        
        <button onClick={() => setScreen('home')} style={styles.backButton}>
          ← Back
        </button>
      </motion.div>
    </div>
  );
  
  const renderSetlist = () => (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={styles.setlistContent}
      >
        <h2 style={styles.setlistTitle}>Setlist</h2>
        
        <div style={styles.songsList}>
          <AnimatePresence>
            {songs.map((song) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={() => handleActivateSong(song)}
                style={{
                  ...styles.songItem,
                  ...(activeSongId === song.id ? styles.songItemActive : {})
                }}
              >
                <p style={styles.songName}>{song.name}</p>
                
                {activeSongId === song.id && currentSong && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    style={styles.songSections}
                  >
                    <div style={styles.sectionsRow}>
                      {song.sections.map((section, idx) => (
                        <motion.div
                          key={idx}
                          whileTap={{ scale: 0.95 }}
                          onTouchStart={() => {
                            const touchTimer = setTimeout(() => handleJumpToSection(idx), 1000);
                            return () => clearTimeout(touchTimer);
                          }}
                          style={{
                            ...styles.sectionBox,
                            ...(activeSection === idx ? styles.sectionBoxActive : {})
                          }}
                        >
                          {section.toUpperCase()}
                        </motion.div>
                      ))}
                    </div>
                    
                    <div style={styles.swipeButtons}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleSwipeSection('prev'); }}
                        style={styles.swipeButton}
                        disabled={activeSection === 0}
                      >
                        ←
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSwipeSection('next'); }}
                        style={styles.swipeButton}
                        disabled={activeSection === currentSong.sections.length - 1}
                      >
                        →
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        <div style={styles.setlistActions}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setScreen('home');
              setActiveSongId(null);
              setCurrentSong(null);
              dmxEngine.current.blackout();
            }}
            style={styles.homeButton}
          >
            + New Song
          </motion.button>
        </div>
      </motion.div>
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  
  return (
    <>
      {screen === 'home' && renderHome()}
      {screen === 'create' && renderCreate()}
      {screen === 'setlist' && renderSetlist()}
    </>
  );
}

// ============================================================================
// STYLES - Church-inspired dark aesthetic
// ============================================================================

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '"Cormorant Garamond", "Libre Baskerville", Georgia, serif',
    color: '#e8e8e8',
    padding: '20px',
  },
  
  homeContent: {
    textAlign: 'center',
    maxWidth: '600px',
    width: '100%',
  },
  
  logo: {
    fontSize: '4.5rem',
    fontWeight: 300,
    letterSpacing: '0.15em',
    marginBottom: '60px',
    background: 'linear-gradient(135deg, #ffd89b 0%, #ffb347 50%, #ff8c42 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 0 60px rgba(255, 184, 71, 0.3)',
    fontFamily: '"Cinzel", serif',
  },
  
  inputContainer: {
    marginBottom: '40px',
  },
  
  input: {
    width: '100%',
    padding: '18px 24px',
    fontSize: '1.1rem',
    border: '1px solid rgba(255, 184, 71, 0.3)',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#e8e8e8',
    marginBottom: '20px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  
  makeLightButton: {
    width: '100%',
    padding: '20px',
    fontSize: '1.3rem',
    background: 'linear-gradient(135deg, #ff8c42 0%, #ffb347 100%)',
    border: 'none',
    borderRadius: '8px',
    color: '#0a0a0f',
    fontWeight: 600,
    cursor: 'pointer',
    letterSpacing: '0.05em',
    fontFamily: '"Cinzel", serif',
    boxShadow: '0 10px 40px rgba(255, 140, 66, 0.4)',
    transition: 'all 0.3s ease',
  },
  
  setlistButton: {
    padding: '12px 24px',
    fontSize: '1rem',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 184, 71, 0.3)',
    borderRadius: '6px',
    color: '#ffb347',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
  },
  
  settingsButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#ffb347',
  },
  
  settingsPanel: {
    marginTop: '30px',
    padding: '20px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 184, 71, 0.2)',
  },
  
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '0.9rem',
    color: '#ffb347',
  },
  
  settingsInput: {
    width: '100%',
    padding: '10px',
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 184, 71, 0.3)',
    borderRadius: '4px',
    color: '#e8e8e8',
    fontFamily: 'monospace',
  },
  
  createContent: {
    maxWidth: '700px',
    width: '100%',
    position: 'relative',
  },
  
  createTitle: {
    fontSize: '2.5rem',
    fontWeight: 300,
    marginBottom: '40px',
    textAlign: 'center',
    color: '#ffb347',
  },
  
  questionsContainer: {
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '30px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 184, 71, 0.2)',
  },
  
  questionBlock: {
    marginBottom: '25px',
  },
  
  question: {
    fontSize: '1.1rem',
    marginBottom: '10px',
    color: '#ffb347',
  },
  
  answerInput: {
    width: '100%',
    padding: '12px',
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 184, 71, 0.3)',
    borderRadius: '6px',
    color: '#e8e8e8',
    fontSize: '1rem',
    fontFamily: 'inherit',
  },
  
  questionButtons: {
    display: 'flex',
    gap: '15px',
    marginTop: '30px',
  },
  
  primaryButton: {
    flex: 1,
    padding: '15px',
    background: 'linear-gradient(135deg, #ff8c42 0%, #ffb347 100%)',
    border: 'none',
    borderRadius: '6px',
    color: '#0a0a0f',
    fontSize: '1.1rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  
  secondaryButton: {
    flex: 1,
    padding: '15px',
    background: 'transparent',
    border: '1px solid rgba(255, 184, 71, 0.5)',
    borderRadius: '6px',
    color: '#ffb347',
    fontSize: '1.1rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  
  generatingContainer: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  
  spinner: {
    width: '50px',
    height: '50px',
    border: '3px solid rgba(255, 184, 71, 0.2)',
    borderTop: '3px solid #ffb347',
    borderRadius: '50%',
    margin: '0 auto 20px',
    animation: 'spin 1s linear infinite',
  },
  
  generatingText: {
    fontSize: '1.2rem',
    color: '#ffb347',
  },
  
  testingContainer: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  
  andThereWasLight: {
    fontSize: '2rem',
    fontStyle: 'italic',
    marginBottom: '10px',
    color: '#ffb347',
    fontFamily: '"Cormorant Garamond", serif',
  },
  
  tryItOut: {
    fontSize: '1.2rem',
    marginBottom: '30px',
    color: '#ccc',
  },
  
  testButton: {
    padding: '18px 40px',
    fontSize: '1.2rem',
    background: 'linear-gradient(135deg, #ff8c42 0%, #ffb347 100%)',
    border: 'none',
    borderRadius: '8px',
    color: '#0a0a0f',
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: '30px',
    boxShadow: '0 8px 30px rgba(255, 140, 66, 0.4)',
  },
  
  feedbackContainer: {
    marginBottom: '30px',
  },
  
  feedbackPrompt: {
    fontSize: '1.1rem',
    marginBottom: '10px',
    color: '#ffb347',
  },
  
  feedbackInput: {
    width: '100%',
    maxWidth: '400px',
    padding: '12px',
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 184, 71, 0.3)',
    borderRadius: '6px',
    color: '#e8e8e8',
    fontSize: '1rem',
    fontFamily: 'inherit',
    margin: '0 auto',
  },
  
  sectionsPreview: {
    marginBottom: '30px',
  },
  
  sectionsTitle: {
    fontSize: '1rem',
    marginBottom: '10px',
    color: '#ffb347',
  },
  
  sectionTag: {
    display: 'inline-block',
    padding: '6px 12px',
    margin: '5px',
    background: 'rgba(255, 184, 71, 0.2)',
    border: '1px solid rgba(255, 184, 71, 0.4)',
    borderRadius: '4px',
    fontSize: '0.9rem',
    color: '#ffb347',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  
  saveButton: {
    padding: '15px 50px',
    fontSize: '1.2rem',
    background: 'transparent',
    border: '2px solid #ffb347',
    borderRadius: '8px',
    color: '#ffb347',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
  },
  
  backButton: {
    position: 'absolute',
    top: '0',
    left: '0',
    padding: '10px 20px',
    background: 'transparent',
    border: 'none',
    color: '#ffb347',
    fontSize: '1rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  
  setlistContent: {
    maxWidth: '800px',
    width: '100%',
  },
  
  setlistTitle: {
    fontSize: '3rem',
    fontWeight: 300,
    marginBottom: '40px',
    textAlign: 'center',
    color: '#ffb347',
    fontFamily: '"Cinzel", serif',
  },
  
  songsList: {
    marginBottom: '40px',
  },
  
  songItem: {
    padding: '20px',
    marginBottom: '15px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 184, 71, 0.2)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  songItemActive: {
    background: 'rgba(255, 184, 71, 0.1)',
    border: '2px solid #ffb347',
    padding: '30px',
  },
  
  songName: {
    fontSize: '1.5rem',
    fontWeight: 500,
    color: '#e8e8e8',
    marginBottom: '10px',
  },
  
  songSections: {
    marginTop: '20px',
  },
  
  sectionsRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  
  sectionBox: {
    padding: '12px 20px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 184, 71, 0.3)',
    borderRadius: '6px',
    fontSize: '0.9rem',
    color: '#ccc',
    letterSpacing: '0.05em',
    transition: 'all 0.3s ease',
  },
  
  sectionBoxActive: {
    background: 'linear-gradient(135deg, #ff8c42 0%, #ffb347 100%)',
    border: 'none',
    color: '#0a0a0f',
    fontWeight: 700,
    transform: 'scale(1.1)',
  },
  
  swipeButtons: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
  },
  
  swipeButton: {
    padding: '12px 30px',
    fontSize: '1.5rem',
    background: 'rgba(255, 184, 71, 0.2)',
    border: '1px solid #ffb347',
    borderRadius: '6px',
    color: '#ffb347',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  setlistActions: {
    textAlign: 'center',
  },
  
  homeButton: {
    padding: '15px 40px',
    fontSize: '1.2rem',
    background: 'linear-gradient(135deg, #ff8c42 0%, #ffb347 100%)',
    border: 'none',
    borderRadius: '8px',
    color: '#0a0a0f',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
};

// Add keyframes for spinner animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&display=swap');
`;
document.head.appendChild(styleSheet);
