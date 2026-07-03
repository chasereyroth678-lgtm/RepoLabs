export function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login?next=' + encodeURIComponent(req.originalUrl));
  }
  next();
}

// Makes the current user available in every template as `currentUser`
export function attachUser(pool) {
  return async (req, res, next) => {
    if (req.session.userId) {
      try {
        const result = await pool.query(
          'SELECT id, username, email FROM users WHERE id = $1',
          [req.session.userId]
        );
        res.locals.currentUser = result.rows[0] || null;
      } catch (err) {
        console.error('attachUser lookup failed:', err);
        res.locals.currentUser = null;
      }
    } else {
      res.locals.currentUser = null;
    }
    next();
  };
}
