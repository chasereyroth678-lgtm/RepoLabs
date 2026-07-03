import express from 'express';
import { guides } from '../content/index.js';
import { requireAuth } from '../middleware/auth.js';
import pool from '../utils/db.js';

const router = express.Router();

router.get('/dashboard', requireAuth, async (req, res) => {
  const result = await pool.query(
    'SELECT guide_slug, completed_steps FROM progress WHERE user_id = $1',
    [req.session.userId]
  );
  const userProgress = result.rows;

  const guideStats = guides.map(g => {
    const p = userProgress.find(pr => pr.guide_slug === g.slug);
    const done = p ? p.completed_steps.length : 0;
    return {
      slug: g.slug,
      title: g.title,
      icon: g.icon,
      tagline: g.tagline,
      done,
      total: g.steps.length,
      percent: g.steps.length ? Math.round((done / g.steps.length) * 100) : 0
    };
  });

  const totalSteps = guideStats.reduce((sum, g) => sum + g.total, 0);
  const totalDone = guideStats.reduce((sum, g) => sum + g.done, 0);

  res.render('dashboard', {
    guideStats,
    totalSteps,
    totalDone,
    overallPercent: totalSteps ? Math.round((totalDone / totalSteps) * 100) : 0
  });
});

export default router;
