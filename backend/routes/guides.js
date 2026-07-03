import express from 'express';
import { guides, getGuideBySlug } from '../content/index.js';
import { requireAuth } from '../middleware/auth.js';
import pool from '../utils/db.js';

const router = express.Router();

async function getProgressFor(userId, guideSlug) {
  const result = await pool.query(
    'SELECT completed_steps FROM progress WHERE user_id = $1 AND guide_slug = $2',
    [userId, guideSlug]
  );
  return result.rows[0];
}

router.get('/guides', async (req, res) => {
  let progressMap = {};
  if (req.session.userId) {
    for (const g of guides) {
      const p = await getProgressFor(req.session.userId, g.slug);
      const done = p ? p.completed_steps.length : 0;
      progressMap[g.slug] = { done, total: g.steps.length };
    }
  }
  res.render('guides-list', { guides, progressMap });
});

router.get('/guides/:slug', async (req, res) => {
  const guide = getGuideBySlug(req.params.slug);
  if (!guide) return res.status(404).render('404');

  let completedSteps = [];
  if (req.session.userId) {
    const p = await getProgressFor(req.session.userId, guide.slug);
    if (p) completedSteps = p.completed_steps;
  }

  res.render('guide-detail', { guide, completedSteps, isLoggedIn: !!req.session.userId });
});

// Toggle a step's completion state — requires auth so progress can be saved
router.post('/api/progress/:slug/:stepId', requireAuth, async (req, res) => {
  const { slug, stepId } = req.params;
  const guide = getGuideBySlug(slug);
  if (!guide) return res.status(404).json({ error: 'Guide not found' });
  if (!guide.steps.find(s => s.id === stepId)) {
    return res.status(404).json({ error: 'Step not found' });
  }

  const existing = await getProgressFor(req.session.userId, slug);
  let completedSteps = existing ? [...existing.completed_steps] : [];

  const idx = completedSteps.indexOf(stepId);
  let nowComplete;
  if (idx >= 0) {
    completedSteps.splice(idx, 1);
    nowComplete = false;
  } else {
    completedSteps.push(stepId);
    nowComplete = true;
  }

  const id = `${req.session.userId}:${slug}`;
  await pool.query(
    `INSERT INTO progress (id, user_id, guide_slug, completed_steps, updated_at)
     VALUES ($1, $2, $3, $4, now())
     ON CONFLICT (user_id, guide_slug)
     DO UPDATE SET completed_steps = EXCLUDED.completed_steps, updated_at = now()`,
    [id, req.session.userId, slug, JSON.stringify(completedSteps)]
  );

  res.json({ ok: true, complete: nowComplete, completedSteps, total: guide.steps.length });
});

export default router;
