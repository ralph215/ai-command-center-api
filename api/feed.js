async function loadNews() {
  const statsEls = {
    total: document.getElementById('stat-total'),
    sources: document.getElementById('stat-sources'),
    summarized: document.getElementById('stat-summarized'),
    today: document.getElementById('stat-today')
  };
  const container = document.getElementById('news-container'); // adjust ID to match yours

  try {
    const res = await fetch('/api/feed');
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    const data = await res.json();
    const records = data.records || [];

    if (records.length === 0) {
      container.innerHTML = '<p style="color:#888">No articles found in Airtable yet.</p>';
      return;
    }

    // your existing render logic here
    renderNews(records, statsEls, container);

  } catch (err) {
    container.innerHTML = `<p style="color:#e55;font-weight:600">⚠️ Failed to load news: ${err.message}</p><p style="color:#888;font-size:13px">Check that /api/feed is deployed and AIRTABLE_PAT is set in Vercel.</p>`;
    Object.values(statsEls).forEach(el => { if (el) el.textContent = 'Error'; });
  }
}
