// Lädt Hero-/Über-uns-Texte und Social-Media-Links aus data/site.json und
// befüllt die vorbereiteten Elemente. So können diese Inhalte über das CMS
// (/admin) gepflegt werden, ohne index.html anzufassen.
(function () {
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el && value != null) el.textContent = value;
  }

  function applyHero(hero) {
    if (!hero) return;
    setText('hero-kicker', hero.kicker);
    setText('hero-heading', hero.heading);
    setText('hero-subtitle', hero.subtitle);
    setText('hero-location-text', hero.location);
    const image = document.getElementById('hero-image');
    if (image && hero.image) image.src = hero.image;
  }

  function applyAbout(about) {
    if (!about) return;
    setText('about-kicker', about.kicker);
    setText('about-heading', about.heading);
    setText('about-vision-text', about.vision_text);

    const container = document.getElementById('about-values');
    if (container && Array.isArray(about.values)) {
      container.innerHTML = about.values.map(function (v) {
        return (
          '<div class="col-md-6 mb-4">' +
            '<div class="card-soft hoverable">' +
              '<span class="badge-soft"><i class="' + escapeHtml(v.icon) + '"></i> ' + escapeHtml(v.badge) + '</span>' +
              '<h3 class="mt-3">' + escapeHtml(v.title) + '</h3>' +
              '<p class="lead-soft" style="font-size:16px;">' + escapeHtml(v.description) + '</p>' +
            '</div>' +
          '</div>'
        );
      }).join('');
    }
  }

  function applySocial(social) {
    if (!social) return;
    ['instagram', 'tiktok', 'whatsapp'].forEach(function (key) {
      if (!social[key]) return;
      document.querySelectorAll('[data-social="' + key + '"]').forEach(function (a) {
        a.href = social[key];
      });
    });
  }

  fetch('data/site.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      applyHero(data.hero);
      applyAbout(data.about);
      applySocial(data.social);
    })
    .catch(function (err) {
      console.error('Seiteninhalte konnten nicht geladen werden:', err);
    });
})();
