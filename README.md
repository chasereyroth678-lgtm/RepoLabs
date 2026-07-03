# RepoLab

An interactive walkthrough site for installing the dev tools every IT student needs — Git/GitHub, Python, VS Code, and Node.js — with Windows/macOS/Linux instructions side by side, copy-paste commands, and progress tracking saved to your account.

## Features

- **4 full guides**: Git & GitHub (incl. SSH keys), Python (incl. virtual environments), VS Code (incl. extensions), Node.js & npm (incl. nvm)
- **OS-specific instructions** — tabs to switch between Windows / macOS / Linux per step
- **Copy-to-clipboard** code blocks for every command
- **Accounts** — sign up, log in, log out (passwords hashed with bcrypt)
- **Progress tracking** — check off steps as you complete them; progress saves per-user (in NeonDB) and shows on a dashboard
- **Troubleshooting accordions** on every guide for the most common errors

## Tech stack

- **Backend** (`/backend`): Node.js + Express
- **Frontend** (`/frontend`): EJS templates (server-rendered, no build step) + vanilla CSS/JS
- **Auth**: express-session + bcryptjs
- **Database**: [NeonDB](https://neon.tech) — serverless Postgres

## Project structure

```
RepoLab/
├── render.yaml                 # Render deployment blueprint (repo root, not inside backend)
├── backend/
│   ├── server.js              # App entry point
│   ├── content/                # Guide data (one file per guide)
│   │   ├── git-github.js
│   │   ├── python.js
│   │   ├── vscode.js
│   │   ├── nodejs.js
│   │   └── index.js            # Aggregates all guides
│   ├── routes/
│   │   ├── auth.js              # Signup / login / logout
│   │   ├── guides.js             # Guide listing, detail, progress API
│   │   ├── dashboard.js          # User dashboard
│   │   └── chat.js               # AI chat assistant API
│   ├── middleware/
│   │   └── auth.js               # requireAuth + attachUser (exposes currentUser to views)
│   ├── utils/
│   │   └── db.js                  # NeonDB (Postgres) connection + schema setup
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── views/                    # EJS templates
    │   └── partials/              # Shared header/nav/footer
    └── public/
        ├── css/style.css           # All styling
        ├── js/                      # OS tabs, copy buttons, checkbox/progress logic, chat widget
        └── images/                  # Guide icons (real Git/GitHub, Python, VS Code, Node.js logos)
```

The Express app in `backend/server.js` serves the templates and static
assets from `../frontend` (`app.set('views', ...)` and
`express.static(...)` both point there), so the two folders together are
still one running app — they're just organized separately.

## Setup

1. **Create a NeonDB database** (free tier is enough):
   - Sign up at [neon.tech](https://neon.tech) and create a project.
   - Open **Connection Details** and copy the connection string. It looks like:
     ```
     postgresql://user:password@ep-something.region.aws.neon.tech/dbname?sslmode=require
     ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and set:
   - `DATABASE_URL` — your NeonDB connection string from step 1
   - `SESSION_SECRET` — any random string
   - `GEMINI_API_KEY` — optional, only needed for the AI chat widget

4. **Start the server** (from the `backend` folder):
   ```bash
   npm start
   ```

5. Open **http://localhost:3000**

On first boot, `backend/utils/db.js` automatically creates the `users` and
`progress` tables in your NeonDB database if they don't exist yet — no
manual migration step required.

## Adding a new guide

1. Create a new file in `backend/content/`, e.g. `content/docker.js`, following the same shape as the existing guides (see `content/python.js` for a simple example).
2. Import and add it to the `guides` array in `backend/content/index.js`.
3. Done — it automatically appears in the guides list, gets its own detail page, and progress tracking works without any other changes.

## Guide icons

Each guide's `icon` field accepts either an emoji/character or a path to an image. RepoLab's four default guides already use real logos:

- Git & GitHub → `/images/github.png`
- Python → `/images/python.png`
- VS Code → `/images/vscode.png`
- Node.js & npm → `/images/nodejs.png`

To add your own for a new guide:

1. Put your image file in `frontend/public/images/` (e.g. `frontend/public/images/docker-icon.png`)
2. In that guide's content file (e.g. `backend/content/docker.js`), set:
   ```js
   icon: '/images/docker-icon.png',
   ```
3. The templates detect any icon starting with `/images/` and render it as an `<img>` automatically — no other changes needed.

## AI chat assistant

There's a floating chat widget (bottom-right corner, on every page) backed by Google's Gemini API (`gemini-2.5-flash`), which has a free tier.

**Setup:**
1. Get a free API key at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) — it will start with `AIza`
2. Add it to `backend/.env`:
   ```
   GEMINI_API_KEY=AIzaSy...
   ```
3. Restart the server — the chat widget will start working immediately, no other config needed

If you deploy to Render or another host, add `GEMINI_API_KEY` as an environment variable in that platform's dashboard (don't commit it to `.env` in git). The chat route (`backend/routes/chat.js`) gives a clear error message if the key is missing, rather than crashing.

The chat history is kept in the browser's memory only (not saved to the database) and resets on page reload — this is a "right now" help assistant, not a saved conversation log.

## Why NeonDB

Data now lives in a real Postgres database instead of a local JSON file, so:

- It survives redeploys/restarts on hosts like Render, whose free-tier disk is wiped on every restart — no persistent disk to configure.
- It handles concurrent writes safely (progress toggles use an atomic `INSERT ... ON CONFLICT DO UPDATE`).
- It's a normal SQL database, so you can inspect data with any Postgres client, or Neon's own web SQL editor.

## Deploying to Render

1. Push this project to a GitHub repo.
2. In Render, choose **New > Web Service** (or **New > Blueprint** to use the included `render.yaml` at the repo root) and connect the repo.
3. Leave **Root Directory** blank (the whole repo). Since the app is split into `/frontend` and `/backend`, isolating just `backend` as the root directory would hide the sibling `/frontend` folder at runtime — instead, point the build/start commands into `backend/`:
   - Build command: `cd backend && npm install`
   - Start command: `node backend/server.js`
4. Under **Environment**, add:
   - `DATABASE_URL` — your NeonDB connection string
   - `SESSION_SECRET` — any random string (the blueprint auto-generates one)
   - `GEMINI_API_KEY` — your key, if you want the chat widget working
5. Deploy. No disks needed — NeonDB is already persistent.

## Known limitations / ideas for extension

- No password reset flow (would need an email service)
- No rate limiting on login attempts
- Sessions are kept in server memory (`express-session`'s default store), so logged-in sessions reset on server restart — fine for a student project; swap in `connect-pg-simple` (storing sessions in the same NeonDB database) for production
- Could add: a search bar across guides, a "suggest a guide" form, dark/light theme toggle, admin panel to add guides via UI instead of code
