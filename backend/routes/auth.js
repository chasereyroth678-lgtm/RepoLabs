import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import pool from '../utils/db.js';

const router = express.Router();

router.get('/signup', (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.render('signup', { error: null });
});

router.post('/signup', async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password) {
    return res.render('signup', { error: 'All fields are required.' });
  }
  if (password.length < 6) {
    return res.render('signup', { error: 'Password must be at least 6 characters.' });
  }
  if (password !== confirmPassword) {
    return res.render('signup', { error: 'Passwords don\'t match.' });
  }

  try {
    const existing = await pool.query(
      'SELECT id FROM users WHERE lower(email) = lower($1) OR lower(username) = lower($2)',
      [email, username]
    );
    if (existing.rows.length > 0) {
      return res.render('signup', { error: 'An account with that username or email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = uuidv4();

    await pool.query(
      'INSERT INTO users (id, username, email, password_hash) VALUES ($1, $2, $3, $4)',
      [id, username, email, passwordHash]
    );

    req.session.userId = id;
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Signup error:', err);
    res.render('signup', { error: 'Something went wrong creating your account. Try again.' });
  }
});

router.get('/login', (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.render('login', { error: null, next: req.query.next || '/dashboard' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const next = req.body.next || '/dashboard';

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE lower(email) = lower($1)',
      [email]
    );
    const user = result.rows[0];

    if (!user) {
      return res.render('login', { error: 'No account found with that email.', next });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.render('login', { error: 'Incorrect password.', next });
    }

    req.session.userId = user.id;
    res.redirect(next);
  } catch (err) {
    console.error('Login error:', err);
    res.render('login', { error: 'Something went wrong logging you in. Try again.', next });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

export default router;
