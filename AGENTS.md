# AGENTS.md — ConnectDevs Project Context

> This file provides persistent context for AI agents (Copilot, Claude, etc.) working on this project. Read this first before making any changes.

---

## Project Overview

**ConnectDevs** is a developer social networking platform — think "Tinder for developers." Users discover other developers through a card-based feed, send connection requests (interested/ignore), and manage their network.

- **Frontend**: React 18 + Vite + Redux Toolkit + React Router v7 + Tailwind CSS + DaisyUI v4
- **Backend**: Node.js + Express + MongoDB/Mongoose (runs on `localhost:3001`) — sibling repo at `../ConnectDevs-backend/`
- **API base**: `http://localhost:3001` (see `src/utils/constants.js`)

---

## Design System — "Amber Terminal" Theme

The UI follows a **terminal/CRT-inspired dark theme** with warm amber-orange accents, modeled after classic amber phosphor monitors.

### Color Palette
| Token        | Hex       | Usage                        |
|-------------|-----------|------------------------------|
| `bg`        | `#0a0a0a` | Main background              |
| `surface`   | `#111111` | Slightly elevated areas      |
| `elevated`  | `#161616` | Cards, modals, dropdowns     |
| `border`    | `#1e1e1e` | Borders, dividers            |
| `accent`    | `#FF8A00` | Primary accent (buttons, highlights) |
| `accent-bright` | `#FFA033` | Hover state for accent  |
| `accent-dim`| `#CC6E00` | Pressed/muted accent         |
| `muted`     | `#999999` | Secondary text               |
| `body`      | `#ffffff` | Primary text                 |

### Typography
| Role     | Font       | Usage                          |
|----------|-----------|--------------------------------|
| Display  | **Syne**      | Headings, logo, card titles    |
| Body     | **DM Sans**   | Paragraphs, descriptions       |
| Mono     | **Fira Code** | Labels, terminal elements, code |

### UI Conventions
- **Terminal window chrome**: Cards use macOS-style 3-dot title bars (red/yellow/green) with a monospace filename
- **Noise overlay**: Subtle grain texture over the full viewport (`.noise-overlay`)
- **Custom inputs**: Use `.terminal-input` class — monospace font, amber focus glow
- **Buttons**: Primary → amber bg + dark text; Secondary → dark bg + border + muted text
- **Animations**: `animate-slide-up` for entry, `animate-blink` for cursor caret
- **Card hover**: `.card-glow` class adds amber glow + slight lift
- **Dropdown menus**: Use `.terminal-menu` class on DaisyUI `menu` for styled items
- **Empty states**: Terminal-style prompts like `$ ls connections/` → "Directory empty"

### DaisyUI Theme
The custom DaisyUI theme is named `"terminal"` and is set via `data-theme="terminal"` on `<html>`. All DaisyUI components automatically use the amber palette.

---

## Architecture

### Directory Structure
```
src/
├── App.jsx                 # Router setup (BrowserRouter + Routes)
├── Body.jsx                # Layout wrapper (Navbar + Outlet + Footer + noise overlay)
├── main.jsx                # Entry point
├── index.css               # Global styles (noise, scrollbar, inputs, animations)
├── App.css                 # (empty)
├── components/
│   ├── Navbar.jsx          # Fixed top nav, logo, avatar dropdown
│   ├── Footer.jsx          # Fixed bottom bar
│   ├── Login.jsx           # Login/Signup form (terminal window card)
│   ├── Feed.jsx            # Discover developers (shows UserCard)
│   ├── UserCard.jsx        # Developer card (photo, info, pass/connect)
│   ├── Profile.jsx         # Renders EditProfile
│   ├── EditProfile.jsx     # Edit form + live preview card
│   ├── Connections.jsx     # List of accepted connections
│   └── Requests.jsx        # Incoming connection requests (accept/reject)
└── utils/
    ├── appStore.js         # Redux store config
    ├── constants.js        # BASE_URL
    ├── userSlice.js        # Current user state
    ├── feedSlice.js        # Feed (array of users to discover)
    ├── connectionSlice.js  # Connections list
    └── requestSlice.js     # Pending requests list
```

### Routes
| Path            | Component     | Auth Required |
|----------------|---------------|---------------|
| `/`            | Feed          | Yes           |
| `/login`       | Login         | No            |
| `/profile`     | Profile       | Yes           |
| `/connections` | Connections   | Yes           |
| `/requests`    | Requests      | Yes           |

### API Endpoints Used
| Method | Endpoint                              | Purpose                    |
|--------|---------------------------------------|----------------------------|
| GET    | `/profile/view`                       | Get current user           |
| POST   | `/login`                              | Login                      |
| POST   | `/signup`                             | Register                   |
| POST   | `/logout`                             | Logout                     |
| PATCH  | `/profile/edit`                       | Update profile             |
| GET    | `/feed`                               | Get users to discover      |
| POST   | `/request/send/:status/:userId`       | Send interested/ignore     |
| GET    | `/user/connections`                   | Get connections            |
| GET    | `/user/requests/received`             | Get pending requests       |
| POST   | `/request/review/:status/:requestId`  | Accept/reject request      |

---

## Build & Dev Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # Production build (vite build)
npm run lint     # ESLint (note: pre-existing require() warning in tailwind.config.js)
npm run preview  # Preview production build
```

---

## Coding Conventions

- **State management**: Redux Toolkit slices in `src/utils/`
- **API calls**: Axios with `withCredentials: true` for cookie-based auth
- **Styling**: Tailwind utility classes + custom CSS classes in `index.css`. Avoid DaisyUI component classes for visuals (except `dropdown`, `menu` for functionality)
- **Font classes**: `font-display` (Syne), `font-sans` (DM Sans), `font-mono` (Fira Code)
- **Color classes**: `text-accent`, `bg-elevated`, `border-border`, `text-muted`, `bg-surface`, `bg-bg`
- **ESLint**: Some `react-hooks/exhaustive-deps` warnings are suppressed with comments
- **No TypeScript**: Plain JSX

---

## Feature Roadmap

See `docs/FEATURES_SPEC.md` for the full feature specification and build order.
See `../ConnectDevs-backend/AGENTS.md` and `../ConnectDevs-backend/docs/FEATURES_SPEC.md` for backend context and API specs.
