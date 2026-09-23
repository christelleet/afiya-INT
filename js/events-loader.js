// Lädt Events aus data/events.json und rendert sie in die vorbereiteten Container.
// So können Events über das CMS (/admin) gepflegt werden, ohne index.html anzufassen.
(function () {
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function renderUpcoming(events) {
    const container = document.getElementById('tickets');
    if (!container) return;

    const sorted = events.slice().sort((a, b) => (a.order || 0) - (b.order || 0));

    container.innerHTML = sorted.map(function (ev) {
      const soonBadge = ev.coming_soon
        ? '<div class="soon-badge"><i class="ri-time-line"></i> Coming soon</div>'
        : '';
      const button = ev.coming_soon
        ? '<a class="btn btn-outline-primary btn-block" href="' + escapeHtml(ev.ticket_url) + '" target="_blank" rel="noopener"><i class="ri-instagram-line"></i> News auf Instagram</a>'
        : '<a class="btn btn-primary btn-block" href="' + escapeHtml(ev.ticket_url) + '" target="_blank" rel="noopener">Ticket kaufen</a>';

      return (
        '<div class="col-md-4 mb-4">' +
          '<div class="card-soft hoverable">' +
            soonBadge +
            '<div class="event-media mb-3"><img src="' + escapeHtml(ev.image) + '" alt="' + escapeHtml(ev.title) + '"></div>' +
            '<div class="d-flex justify-content-between align-items-center">' +
              '<span class="badge-soft"><i class="ri-calendar-event-line"></i>' + escapeHtml(ev.date) + '</span>' +
              '<span class="badge-soft"><i class="ri-map-pin-2-line"></i>' + escapeHtml(ev.location) + '</span>' +
            '</div>' +
            '<h3 class="mt-3">' + escapeHtml(ev.title) + '</h3>' +
            '<p class="lead-soft" style="font-size:16px;">' + escapeHtml(ev.description) + '</p>' +
            button +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  function renderPast(events) {
    const inner = document.querySelector('#pastCarousel .carousel-inner');
    const indicators = document.querySelector('#pastCarousel .carousel-indicators');
    if (!inner || !indicators) return;

    const sorted = events.slice().sort((a, b) => (a.order || 0) - (b.order || 0));

    inner.innerHTML = sorted.map(function (ev, i) {
      return (
        '<div class="carousel-item' + (i === 0 ? ' active' : '') + '">' +
          '<img src="' + escapeHtml(ev.image) + '" alt="' + escapeHtml(ev.title) + '">' +
          '<div class="carousel-caption"><div class="cap"><i class="ri-sparkling-2-line"></i>' + escapeHtml(ev.title) + '</div></div>' +
        '</div>'
      );
    }).join('');

    indicators.innerHTML = sorted.map(function (ev, i) {
      return '<li data-target="#pastCarousel" data-slide-to="' + i + '"' + (i === 0 ? ' class="active"' : '') + '></li>';
    }).join('');

    if (window.jQuery) {
      window.jQuery('#pastCarousel').carousel('dispose');
      window.jQuery('#pastCarousel').carousel({ interval: 7000, touch: true });
    }
  }

  fetch('data/events.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.upcoming) renderUpcoming(data.upcoming);
      if (data.past) renderPast(data.past);
    })
    .catch(function (err) {
      console.error('Events konnten nicht geladen werden:', err);
    });
})();
