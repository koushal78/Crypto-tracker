# 🚀 Crypto Price Tracker

A modern and responsive real-time cryptocurrency price tracker built with **React**, **Redux**, and **Tailwind CSS**. It fetches data from **CoinGecko API** for static info and uses **Binance WebSocket** for live updates.

---

## 🌐 Live Preview

> Coming Soon...

---

## 📸 Features

- 🔄 **Real-time price updates** via Binance WebSocket
- 📊 **Market stats**: price, % changes, market cap, supply, and more
- 📈 **7-day mini chart** for trend visualization
- 🌓 **Dark-themed responsive UI** with mobile-first design
- 🧠 State management using **Redux Toolkit**
- 📦 Clean modular code and utility-first styling

---

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **State Management**: Redux Toolkit
- **Data Sources**:
  - CoinGecko API (initial data)
  - Binance WebSocket (live data)

---

## 📁 Folder Structure

```
.
├── src
│   ├── components  # Reusable UI components
│   ├── redux       # Redux store and slices
│   ├── utils       # Helper functions (APIs, formatters)
│   ├── App.tsx     # Main App component
│   └── index.tsx   # React root
├── public
│   └── index.html
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/crypto-price-tracker.git
cd crypto-price-tracker
```

### 2. Install dependencies

```bash
npm install # or yarn
```

### 3. Run the app locally

```bash
npm run dev # or yarn dev
```

The app will be available at http://localhost:5173 (if using Vite).

## ⚙️ Environment Setup

No `.env` required as CoinGecko and Binance WebSocket are public. However, make sure to handle rate limits and fallbacks if scaling.

## ✨ Screenshots

Add screenshots here once deployed or styled further.

## 📄 License

MIT License



