# ⚡ Irregular Verbs Master (VerbMaster)

A modern, interactive, mobile-first web application designed for learning, practicing, and mastering English irregular and regular verbs through 5 dynamic question types, custom game modes, detailed analytics, and exportable glassmorphic scorecards.

---

## 📱 Application Screenshots & Previews

<table>
  <tr>
    <td align="center" width="33%">
      <b>🏠 Home Dashboard</b><br/><br/>
      <img src="https://github.com/user-attachments/assets/6e0d7b2b-9bfc-41ff-a4cf-52ab779648bf" height="260" alt="Home Dashboard" />
    </td>
    <td align="center" width="33%">
      <b>🎮 Quiz Gameplay</b><br/><br/>
      <img src="https://github.com/user-attachments/assets/b9ea6d58-5314-47fa-a40a-3985bdd6e33e" height="260" alt="Quiz Gameplay" />
    </td>
      <td align="center" width="33%">
      <b>🏆 Quiz Results</b><br/><br/>
      <img src="https://github.com/user-attachments/assets/68f27bb5-96ed-4554-979c-b8702b4b55b6" height="260" alt="Quiz Results" />
    </td>
  </tr>
  <tr>
    <td align="center" width="33%">
      <b>🎨 Scorecard Export</b><br/><br/>
      <img src="https://github.com/user-attachments/assets/74be8e09-040e-4885-8a3f-28eb6c06ecfe" height="260" alt="Scorecard Export" />
    </td>
    <td align="center" width="33%">
      <b>📊 Analytics Stats</b><br/><br/>
      <img src="https://github.com/user-attachments/assets/81a28253-741b-4c96-953d-c599046146ea" height="260" alt="Analytics Stats" />
    </td>
    <td align="center" width="33%">
      <b>🧠 Mistake Review</b><br/><br/>
      <img src="https://github.com/user-attachments/assets/a49e7c14-23a4-4776-acb9-ab537d797772" height="260" alt="Mistake Review" />
    </td>
  </tr>
</table>

---

## 🌟 Key Features

### 🕹️ Learning & Quiz Modes
* **📚 145+ Verbs Database:** Comprehensive collection of English irregular and regular verbs complete with Azerbaijani translations and distractor patterns.
* **🎯 5 Interactive Question Types:**
  1. **Form Typing (V1/V2/V3):** Type missing base, past, or participle forms.
  2. **Sequence Verification (True/False):** Identify correct verb form triads.
  3. **Fill Missing Form:** Complete missing slots (e.g., `___ — answered — answered`).
  4. **Multi-Select Identification:** Choose correct forms among distractors.
  5. **Drag & Drop / Reordering:** Arrange verb forms into proper chronological sequence.
* **⚡ Multiple Quiz Lengths:** Select between 10 (Quick), 20 (Standard), 50 (Medium), 100 (Deep), or Full Database (145).
* **♾️ Endless Mode:** Test your streak precision — play continuously until your very first mistake.
* **⏱️ Time Attack (60s):** Race against the clock! Start with 60 seconds and earn +2 bonus seconds for every correct answer.
* **🧠 Smart Error Review (My Mistakes):** Missed verbs are automatically logged into LocalStorage with error counters and Azerbaijani translations for targeted review quizzes.

### 📊 Analytics & Scorecard Sharing
* **📈 Deep Performance Stats:** Track total quizzes played, all-time high score, max streak combos, and average accuracy percentage.
* **📖 Live Searchable Dictionary:** Filter by verb forms, Azerbaijani translations, regular/irregular types, or mistake count.
* **📷 Glassmorphism Canvas Exporter:** Render clean, high-resolution scorecards instantly using the native HTML5 Canvas API to download PNGs or share via Web Share API.

### 📱 Premium UI & Experience
* **🌐 Internationalization (AZ / EN):** Seamless bilingual switching between Azerbaijani and English interfaces.
* **🌙 Dark & Light Themes:** Instant visual theme hydration via `LocalStorage` without page flicker.
* **🎵 Web Audio FX:** Synthesized audio feedback for correct/incorrect answers without external asset dependencies.
* **📱 Mobile-First Responsive Design:** Modern glassmorphism layout optimized for touch interaction across mobile, tablet, and desktop viewports.

---

## 🛠️ Tech Stack

* **Frontend Framework:** Vanilla HTML5, CSS3 (CSS Custom Properties, Glassmorphic Design, Keyframe Animations), Pure JavaScript (ES6+ Modules).
* **Audio Engine:** Web Audio API for synthetic sound effects.
* **Storage & Exporter:** `LocalStorage` state hydration & HTML5 Canvas API for scorecard generation.
* **Backend Dev Server:** Lightweight Node.js static server (`server.js`).

---

## 📂 Project Structure

```text
├── index.html          # Main HTML structure, modals, and screen containers
├── style.css           # Global stylesheet entry point
├── app.js              # Application lifecycle and state controller
├── verbs.json          # Verb database with 145+ entries & Azerbaijani definitions
├── server.js           # Local HTTP static server (Port 3005)
├── css/                # Modular Stylesheets
│   ├── base.css        # CSS variables, resets, and dark/light themes
│   ├── header.css      # Top navigation header and action controls
│   ├── quiz.css        # Quiz interface, timer progress, and options
│   ├── modals.css      # Modals (Analytics, Profile, Settings, FAQ)
│   ├── dictionary.css  # Dictionary interface, search inputs, and filters
│   └── scorecard.css   # Scorecard preview and modal styling
└── js/                 # Modular JavaScript Architecture
    ├── config.js       # Global constants, scoring rules, and app config
    ├── i18n.js         # Internationalization dictionary (AZ / EN)
    ├── storage.js      # LocalStorage operations (stats, mistakes, history)
    ├── audio.js        # Web Audio API sound generator
    ├── questions.js    # Question generators and answer evaluation logic
    ├── modals.js       # Modal open/close handlers & toast notification system
    ├── dictionary.js   # Live dictionary search, filtering, and rendering
    └── scorecard.js    # HTML5 Canvas scorecard generator & sharing logic
```

---

## 🚀 Local Setup & Installation

Since **VerbMaster** is 100% client-side, running the application locally is fast and straightforward:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/KananYusubov/verb-master.git
   cd verb-master
   ```

2. **Start the local static server:**
   ```bash
   node server.js
   ```

3. **Open in browser:**
   Navigate to `http://localhost:3005` in your browser.


---

## 📝 License & Attribution

This project is open-source and free for educational and personal use under the MIT License.  
Developed with ❤️ by **Kanan**.

