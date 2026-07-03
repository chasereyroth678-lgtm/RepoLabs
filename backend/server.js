import 'dotenv/config';

import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

import { initDb } from './utils/db.js';
import pool from './utils/db.js';
import { attachUser } from './middleware/auth.js';

import authRoutes from './routes/auth.js';
import guideRoutes from './routes/guides.js';
import dashboardRoutes from './routes/dashboard.js';
import chatRoutes from './routes/chat.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The frontend (EJS views + static assets) lives in a sibling folder,
// ../frontend, so it's kept separate from backend server/route code.
const frontendDir = path.join(__dirname, '..', 'frontend');

const app = express();
const PORT = process.env.PORT || 3000;

await initDb();

app.set('view engine', 'ejs');
app.set('views', path.join(frontendDir, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(frontendDir, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'repolab-dev-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } // 1 week
}));

app.use(attachUser(pool));

app.get('/', (req, res) => {
  res.render('home');
});

app.use('/', authRoutes);
app.use('/', guideRoutes);
app.use('/', dashboardRoutes);
app.use('/', chatRoutes);

app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(PORT, () => {
  console.log(`RepoLab running at http://localhost:${PORT}`);
});
