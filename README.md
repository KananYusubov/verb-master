# ⚡ Irregular Verbs Master

A modern, mobile-first web application designed for learning, practicing, and testing English irregular and regular verbs through 5 interactive question types.

---

## 🌟 Key Features

### 🎮 Learning & Game Modes
* **📚 145+ Verbs Database:** Complete coverage of irregular and regular verbs with translations and distractor patterns.
* **🎯 5 Question Types:** Type forms, sequence check (True/False), fill missing form, multi-select identification, and drag/click reordering.
* **🕹️ Multiple Modes:** Quiz sets of 10, 20, 50, 100, Full Database, or **Endless Mode** (play until your first mistake).

* **⏱️ Time Attack:** Fast-paced 60-second challenge with +2 seconds added for every correct answer.
* **🧠 Smart Error Review (My Mistakes):** Automatically logs missed verbs into LocalStorage for focused practice until fully mastered.

### 📊 Tools & Progress Tracking
* **📖 Live Verb Dictionary:** Instant search and filter by verb forms, Azerbaijani translations, or mistake history.
* **📈 Rich Analytics & History:** Detailed performance stats, streak combos, accuracy percentages, and a log of your last 50 quizzes.

* **📷 High-Score Export:** Generate and download crisp Glassmorphism PNG score cards or share them natively.

### 📱 UI & Experience
* **🌐 Multi-Language (AZ / EN):** Seamlessly toggle between Azerbaijani and English languages.
* **🌙 Dark & Light Themes:** Smooth theme switching with instant state hydration (no page flickering).

* **📱 Mobile-First Design:** Fully responsive glassmorphic UI optimized for touch controls.
* **🎵 Web Audio FX:** Native synthetic audio feedback for correct and wrong answers.

---

## 🛠️ Tech Stack

* **Frontend:** Pure Vanilla HTML5, CSS3 (CSS Variables, Glassmorphism, Animations), Vanilla JavaScript (ES6+).
* **Audio Engine:** Web Audio API for synthetic sound effects.
* **Storage & Operations:** LocalStorage for user state and mistake tracking; Native HTML5 Canvas API for score card generation.
* **Database:** Lightweight local `verbs.json`.

---

## 📂 Project Structure

The codebase utilizes a clean, modular hierarchy to separate logic, styles, and data:

```text
├── index.html       # Primary HTML layout, modals, and quiz screens
├── style.css        # Main CSS entry point
├── app.js           # Main controller and app lifecycle
├── verbs.json       # Database of 145+ English verbs
├── server.js        # Node.js local static server (Port 3008)
├── css/             # Modular Styles
│   ├── base.css     # Resets, variables, dark/light themes
│   ├── header.css   # Navigation and grouped action buttons
│   ├── quiz.css     # Quiz interface, timer, and result cards
│   ├── modals.css   # Profile, settings, analytics, and dialog modals
│   ├── dictionary.css # Dictionary UI, filters, and verb cards
│   └── scorecard.css  # Canvas exporter modal styling
└── js/              # Modular Scripts
    ├── config.js    # Constants and global config
    ├── i18n.js      # Internationalization (AZ/EN) engine
    ├── storage.js   # LocalStorage management (stats, mistakes, history)
    ├── audio.js     # Web Audio API sound generator
    ├── questions.js # Question generators and validation logic
    ├── modals.js    # Modal handlers and toast notification system
    ├── dictionary.js# Dictionary search and filter logic
    └── scorecard.js # HTML5 Canvas score card renderer & native share
```

---

## 🚀 Local Setup & Run Instructions

Since the application is 100% client-side, no database or backend server is required.

1. Clone or download the repository:
   ```bash
   git clone https://github.com/KananYusubov/verb-master.git
   ```
2. Navigate into the project folder and start the local server:
   ```bash
   node server.js
   ```
3. Open your browser and visit: `http://localhost:3005`

---

## 📝 License & Attribution

This project is open-source and free for educational use.  
Created and developed with ❤️ by **Kanan**.
