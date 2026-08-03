# ⚡ Irregular Verbs Master

A modern, mobile-first web application designed for learning, practicing, and testing English irregular and regular verbs through 5 interactive question types.

---

## 🌟 Key Features

* **📚 Extensive Verb Database:** 145+ English verbs (109 irregular, 36 regular verbs, including translations, alternative forms, and common distractor patterns).
* **🎮 5 Interactive Question Types:**
  1. **Type the Form:** Given a verb, type its V1, V2, or V3 form (*e.g., "write" $\rightarrow$ V2: `wrote`*).
  2. **Check Sequence (True/False):** Verify if a 3-form verb sequence is correct (*includes distractors with fake `-ed` endings*).
  3. **Fill Missing Form:** 2 out of 3 forms are provided; fill in the missing form (*e.g., "go - ___ - gone" $\rightarrow$ `went`*).
  4. **Identify Form (Multi-Select):** Identify whether a word is V1, V2, or V3 (*select multiple for verbs with identical forms like "cut"*).
  5. **Reorder 3 Forms (Drag & Drop):** Arrange 3 scrambled verb forms into correct V1 $\rightarrow$ V2 $\rightarrow$ V3 sequence via clicking or HTML5 Drag & Drop.
* **🕹️ Game Modes:** `10`, `20`, `50`, `100` questions, `Full Database (145)`, and **♾️ Endless Mode (until first mistake)**.
* **🔥 Score & Streak Engine:** Earn points and build streak multipliers with animated fire combos.
* **📊 Results & Error Review:** Detailed post-quiz analytics including accuracy %, total score, max streak, and a review list of incorrect answers with correct forms.
* **🌐 Multi-Language Support (AZ / EN):** Instant language switching between Azerbaijani and English with saved preferences.
* **📱 Mobile-First Responsive Design:** Optimized touch targets, zero mobile zoom issues, and smooth glassmorphic UI.
* **🎵 Web Audio API Sound Effects:** Built-in synthetic chimes and error buzzers without external audio assets.
* **🌙 Dark & Light Themes:** Toggle between dark mode and light mode seamlessly.

---

## 🛠️ Tech Stack

* **HTML5:** Semantic layout, accessibility attributes, data-i18n internationalization.
* **Vanilla CSS3:** CSS custom properties (variables), Glassmorphism, mobile-first Flexbox/Grid, and responsive animations.
* **JavaScript (ES6+):** Pure client-side reactive quiz generator, state management, and Web Audio API.
* **JSON:** Lightweight local database storing all verb metadata (`verbs.json`).

---

## 📂 Project Structure

```
├── index.html       # Primary HTML structure, layout & modals
├── style.css        # Mobile-first design system, themes & animations
├── app.js           # Quiz engine, multi-language controller & state management
├── verbs.json       # Database of 145 English verbs
├── favicon.svg      # Vector SVG favicon icon
├── sual_novleri.md  # Question types specification document
├── flow_plan.md     # User flow & architecture document
└── README.md        # English project documentation
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
