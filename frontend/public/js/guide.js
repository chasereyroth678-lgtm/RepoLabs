(function () {
  // ----- OS tab switching -----
  const tabs = document.querySelectorAll('.os-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const os = tab.dataset.os;
      tabs.forEach(t => t.classList.toggle('active', t === tab));
      document.querySelectorAll('.os-content').forEach(el => {
        el.style.display = el.dataset.os === os ? 'block' : 'none';
      });
    });
  });

  // ----- Copy to clipboard -----
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = 'copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'copy';
          btn.classList.remove('copied');
        }, 1500);
      } catch (e) {
        btn.textContent = 'failed';
      }
    });
  });

  // ----- Troubleshooting accordion -----
  document.querySelectorAll('.tshoot-item').forEach(item => {
    const q = item.querySelector('.tshoot-q');
    q.addEventListener('click', () => {
      item.classList.toggle('open');
    });
  });

  // ----- Step completion -----
  const completed = new Set(window.COMPLETED_STEPS || []);
  const total = window.TOTAL_STEPS || 0;
  const slug = window.GUIDE_SLUG;
  const isLoggedIn = window.IS_LOGGED_IN;

  function renderProgress() {
    const bar = document.getElementById('progress-bar');
    const label = document.getElementById('progress-label');
    if (!bar) return;
    const filled = '#'.repeat(completed.size) + '-'.repeat(Math.max(0, total - completed.size));
    bar.textContent = `[${filled}]`;
    if (isLoggedIn && label) {
      label.textContent = `${completed.size} of ${total} steps complete`;
    }
  }

  function applyInitialState() {
    completed.forEach(stepId => {
      const stepEl = document.querySelector(`.step[data-step-id="${stepId}"]`);
      const checkbox = document.querySelector(`.step-checkbox[data-step-id="${stepId}"]`);
      if (stepEl) stepEl.classList.add('complete');
      if (checkbox) checkbox.classList.add('checked');
    });
    renderProgress();
  }

  document.querySelectorAll('.step-checkbox').forEach(checkbox => {
    checkbox.addEventListener('click', async () => {
      const stepId = checkbox.dataset.stepId;
      const stepEl = document.querySelector(`.step[data-step-id="${stepId}"]`);

      if (!isLoggedIn) {
        window.location.href = '/signup?next=' + encodeURIComponent(window.location.pathname);
        return;
      }

      // optimistic UI update
      const willBeComplete = !checkbox.classList.contains('checked');
      checkbox.classList.toggle('checked', willBeComplete);
      stepEl.classList.toggle('complete', willBeComplete);
      if (willBeComplete) completed.add(stepId); else completed.delete(stepId);
      renderProgress();

      try {
        const res = await fetch(`/api/progress/${slug}/${stepId}`, { method: 'POST' });
        if (!res.ok) throw new Error('Request failed');
        const data = await res.json();
        // reconcile with server truth in case of race conditions
        completed.clear();
        data.completedSteps.forEach(id => completed.add(id));
        renderProgress();
      } catch (e) {
        // revert on failure
        checkbox.classList.toggle('checked', !willBeComplete);
        stepEl.classList.toggle('complete', !willBeComplete);
        if (willBeComplete) completed.delete(stepId); else completed.add(stepId);
        renderProgress();
      }
    });
  });

  applyInitialState();
})();
