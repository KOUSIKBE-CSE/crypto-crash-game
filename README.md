# 💥 Crypto Crash Game

A real-time multiplayer game where players bet on the price movements of cryptocurrencies (BTC & ETH). Built with **Node.js**, **Express**, **Socket.io**, **MongoDB**, and **React + Vite**.

---

## 📦 Tech Stack

| Layer       | Technology                  |
|------------|-----------------------------|
| Frontend   | React, Vite, CSS/Bootstrap  |
| Backend    | Node.js, Express.js         |
| Realtime   | Socket.io                   |
| Database   | MongoDB (Mongoose)          |
| Deployment | Render (backend), Netlify (frontend) |

---

## 📁 Project Structure

```

crypto-crash-backend/
├── app.js                # Express app setup
├── controllers/          # Game and player logic
├── models/               # Mongoose models
├── routes/               # API endpoints
├── sockets/              # Socket.io handlers
├── utils/                # Crypto price fetcher, helpers
├── services/             # Game logic services
├── frontend/             # React frontend (Vite)
├── seedPlayer.js         # Creates sample test users
└── README.md

````

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/YOUR-USERNAME/crypto-crash-game.git
cd crypto-crash-game
````

### 2. Install Backend

```bash
npm install
```

### 3. Start MongoDB (locally or use MongoDB Atlas)

### 4. Seed Player

```bash
node seedPlayer.js
```

This creates a test player `alice`.

### 5. Start Backend Server

```bash
node app.js
```

Runs on `http://localhost:5000`

---

## 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`

---

## 🔌 Socket Events

### Emitted by Server:

* `gameStarted`: Sends updated crypto prices to clients
* `gameEnded`: Sends final prices

### Sent by Client:

* (To be implemented: `betPlaced`, `cashOut`, etc.)

---

## 🔐 Sample API

| Endpoint            | Method | Description             |
| ------------------- | ------ | ----------------------- |
| `/wallet/:username` | GET    | Fetch user wallet + USD |
| `/start`            | POST   | Start a game round      |
| `/end`              | POST   | End a game round        |

---

## 🧪 Test User

* Username: `alice`
* Wallet: Preloaded with BTC & ETH
* Use this user to test the wallet info and live updates.

---

## 📄 TODO

* [ ] Auth & registration
* [ ] Bet & cashout logic
* [ ] Leaderboard
* [ ] Game UI polish

---

## 🧠 Credits

Built by [Kousik D](https://github.com/KOUSIKBE-CSE)
Made with ❤️ for learning, gaming, and crypto fun!

---

## 📜 License

MIT
