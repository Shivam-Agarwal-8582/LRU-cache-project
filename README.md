# LRU Cache Simulator

![LRU Cache Simulator Mockup](file:///Users/shivamagarwal/.gemini/antigravity-ide/brain/38df8a36-01d8-4afb-ae5b-404148dda166/lru_simulator_mockup_1782476565925.png)

A **modern, interactive LRU (Least Recently Used) cache visualizer** built with vanilla HTML, CSS, and JavaScript. The app demonstrates how an LRU cache works step‑by‑step, showing the underlying doubly‑linked list and hashmap structures, operation logs, hit/miss statistics, and O(1) time‑complexity guarantees.

## ✨ Features
- **Dynamic visualization** of the cache's doubly‑linked list and hashmap.
- **Interactive controls** for setting capacity, putting key/value pairs, and retrieving values.
- Real‑time **operation log** and cache statistics (hits, misses, hit‑rate).
- **Premium UI** with dark‑mode glassmorphism, gradients, and smooth micro‑animations.
- Fully **responsive** – works on desktop and mobile browsers.

## 🛠️ Technologies
- **HTML5** – semantic structure
- **Vanilla CSS** – custom design system (no frameworks)
- **JavaScript (ES6+)** – core logic and animation handling
- **Google Fonts – Inter** for clean, modern typography

## 🚀 Quick Start
1. Clone the repository or download the source.
2. Open `index.html` directly in a web browser, or serve the folder with a simple HTTP server:
   ```bash
   # Using Python (already installed on macOS)
   cd "/Users/shivamagarwal/Desktop/LRU Project"
   python3 -m http.server 8000
   ```
3. Navigate to `http://localhost:8000` in your browser.

## 📂 Project Structure
```
LRU Project/
├─ index.html          # Main page markup
├─ style.css           # Premium UI styling (glassmorphism, gradients)
├─ script.js           # LRU cache implementation & UI logic
├─ fonts.css           # Font imports (Inter)
└─ backend/            # Placeholder for future server‑side extensions
```

## 🤝 Contributing
Feel free to open issues or submit pull requests. Some ideas for improvement:
- Add unit tests for the LRU core logic.
- Implement a persistent backend (e.g., Node/Express) to store cache state.
- Extend the UI with customizable themes.

## 📜 License
This project is released under the MIT License – see the `LICENSE` file for details.
