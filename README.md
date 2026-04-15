# ConnectDevs

A developer social networking platform — discover developers, swipe to connect, and build your network. Think "Tinder for developers."

---

## Tech Stack

- **Frontend** (`client/`): React 18 · Vite · Redux Toolkit · Tailwind CSS · DaisyUI
- **Backend** (`server/`): Node.js · Express · MongoDB · Mongoose · Socket.IO

---

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/muhammadusman586/ConnectDevs.git
cd ConnectDevs

# 2. Install all dependencies (client + server)
npm install

# 3. Set up backend environment
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI

# 4. Seed the database (100 developer profiles)
npm run seed

# 5. Start both servers
npm run dev:server   # Backend on localhost:3001
npm run dev:client   # Frontend on localhost:5173
```

---

## Features

- **Swipe Cards** — Discover developers with Tinder-style swipe UI
- **Guest Browsing** — Browse developer cards without signing up
- **Explore** — Find developers by skill category
- **Leaderboard** — Top developers ranked by connections
- **Real-time Chat** — Message your connections with Socket.IO
- **Notifications** — Connection requests and messages
- **GitHub Integration** — Link your GitHub profile
- **Dark/Light Theme** — Toggle between amber terminal and light mode
- **Search & Filter** — Filter by skills, age, gender
