(function () {
  const defaultFormat = (value) => {
    if (!Number.isFinite(value)) return '0';
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
  };

  function normalizeEntry(entry) {
    if (!entry) return null;
    if (typeof entry === 'number') return { name: 'Player', score: entry };
    if (typeof entry !== 'object') return null;
    const name = typeof entry.name === 'string' && entry.name.trim() ? entry.name.trim() : 'Player';
    const score = Number(entry.score);
    if (!Number.isFinite(score)) return null;
    return { name, score };
  }

  function createLeaderboard({
    storageKey,
    nameKey,
    listElement,
    maxEntries = 5,
    format = defaultFormat
  } = {}) {
    if (!storageKey) throw new Error('storageKey is required for createLeaderboard');

    const playerKey = nameKey || `${storageKey}Player`;
    let leaderboard = [];

    function load() {
      try {
        const raw = localStorage.getItem(storageKey);
        const parsed = raw ? JSON.parse(raw) : [];
        leaderboard = Array.isArray(parsed) ? parsed.map(normalizeEntry).filter(Boolean) : [];
      } catch (err) {
        leaderboard = [];
      }
      leaderboard.sort((a, b) => b.score - a.score);
    }

    function save() {
      try {
        localStorage.setItem(storageKey, JSON.stringify(leaderboard));
      } catch (err) {
        // Ignore storage errors to keep the game running.
      }
    }

    function render(target) {
      const el = target || listElement;
      if (!el) return;
      el.innerHTML = '';
      if (!leaderboard.length) {
        const empty = document.createElement('li');
        empty.textContent = 'No scores yet';
        empty.className = 'empty';
        el.appendChild(empty);
        return;
      }
      leaderboard.slice(0, maxEntries).forEach((entry) => {
        const li = document.createElement('li');
        li.textContent = `${entry.name} - ${format(entry.score)}`;
        el.appendChild(li);
      });
    }

    function best() {
      return leaderboard[0]?.score || 0;
    }

    function getPlayerName() {
      const lastName = localStorage.getItem(playerKey) || '';
      const input = window.prompt('Enter your name for the leaderboard:', lastName);
      const name = input ? input.trim() : '';
      if (name) {
        localStorage.setItem(playerKey, name);
        return name;
      }
      return lastName || 'Player';
    }

    function record(score) {
      const value = Number(score);
      if (!Number.isFinite(value)) return best();
      const name = getPlayerName();
      leaderboard.push({ name, score: value });
      leaderboard.sort((a, b) => b.score - a.score);
      leaderboard = leaderboard.slice(0, maxEntries);
      save();
      render();
      return best();
    }

    return {
      load,
      save,
      render,
      best,
      record,
      data: () => leaderboard,
      format
    };
  }

  window.createLeaderboard = createLeaderboard;
})();
