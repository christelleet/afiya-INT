// Lädt AGB/DSGVO/Impressum-Texte aus data/legal.json und rendert das
// Markdown-Feld "body" ins vorbereitete Element. Welche Seite geladen wird,
// steht als data-legal-page="agb|dsgvo|impressum" auf <body>.
(function () {
  const page = document.body.getAttribute('data-legal-page');
  if (!page) return;

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  fetch('data/legal.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      const entry = data[page];
      if (!entry) return;

      const titleEl = document.getElementById('legal-title');
      const subtitleEl = document.getElementById('legal-subtitle');
      const bodyEl = document.getElementById('legal-body');

      if (titleEl && entry.title) titleEl.textContent = entry.title;
      if (subtitleEl) subtitleEl.textContent = entry.subtitle || '';
      if (bodyEl && entry.body) {
        bodyEl.innerHTML = window.marked ? window.marked.parse(entry.body) : escapeHtml(entry.body);
      }
    })
    .catch(function (err) {
      console.error('Rechtstexte konnten nicht geladen werden:', err);
    });
})();
