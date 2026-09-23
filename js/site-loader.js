// AFIYA — SITE LOADER
(function () {
  "use strict";

  const esc = (value) => {
    const div = document.createElement("div");
    div.textContent = value == null ? "" : String(value);
    return div.innerHTML;
  };

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el && value != null) el.textContent = value;
  };

  const setSocial = (name, value) => {
    if (!value) return;
    document.querySelectorAll(`[data-social="${name}"]`).forEach((link) => {
      link.href = value;
    });
  };

  fetch("data/site.json", { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    })
    .then((data) => {
      const hero = data.hero || {};
      const about = data.about || {};
      const social = data.social || {};

      setText("hero-kicker", hero.kicker);
      setText("hero-heading", hero.heading);
      setText("hero-subtitle", hero.subtitle);
      setText("hero-location-text", hero.location);

      if (hero.image) {
        const image = document.getElementById("hero-image");
        if (image) image.src = hero.image;
      }

      setText("about-kicker", about.kicker);
      setText("about-heading", about.heading);
      setText("about-vision-text", about.vision_text);

      const values = document.getElementById("about-values");
      if (values && Array.isArray(about.values)) {
        values.innerHTML = about.values.map((item, index) => `
          <article class="value-item reveal">
            <span class="value-item__number">${String(index + 1).padStart(2, "0")}</span>
            <div class="value-item__badge">
              ${item.icon ? `<i class="${esc(item.icon)}"></i>` : ""}
              <span>${esc(item.badge)}</span>
            </div>
            <h3>${esc(item.title)}</h3>
            <p>${esc(item.description)}</p>
          </article>
        `).join("");
      }

      setSocial("instagram", social.instagram);
      setSocial("tiktok", social.tiktok);
      setSocial("whatsapp", social.whatsapp);

      requestAnimationFrame(() => {
        if (window.AfiyaObserve) window.AfiyaObserve();
        else document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
      });
    })
    .catch((error) => console.error("Afiya Site Content konnte nicht geladen werden:", error));
})();