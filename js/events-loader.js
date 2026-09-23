// ==========================================================
// AFIYA — EVENTS LOADER
// Lädt Events aus data/events.json.
//
// Bestehende CMS-Struktur bleibt erhalten:
// {
//   "upcoming": [...],
//   "past": [...]
// }
//
// Upcoming Events  -> #tickets
// Past Events      -> #pastEventsTrack
// ==========================================================

(function () {
  "use strict";


  /* ========================================================
     HELPERS
  ======================================================== */

  function escapeHtml(value) {
    const div = document.createElement("div");

    div.textContent =
      value == null
        ? ""
        : String(value);

    return div.innerHTML;
  }


  function safeUrl(value) {
    if (!value) {
      return "#";
    }

    return escapeHtml(value);
  }


  function eventNumber(index) {
    return String(index + 1).padStart(2, "0");
  }


  /* ========================================================
     UPCOMING EVENTS
  ======================================================== */

  function renderUpcoming(events) {

    const container =
      document.getElementById("tickets");

    const emptyState =
      document.getElementById("eventsEmpty");


    if (!container) {
      return;
    }


    /*
     * CMS order weiterhin respektieren.
     */

    const sorted = events
      .slice()
      .sort(function (a, b) {

        return (
          (a.order || 0) -
          (b.order || 0)
        );

      });


    /*
     * Keine Events vorhanden
     */

    if (!sorted.length) {

      container.innerHTML = "";

      if (emptyState) {
        emptyState.hidden = false;
      }

      return;
    }


    if (emptyState) {
      emptyState.hidden = true;
    }


    /*
     * Event Cards erstellen
     */

    container.innerHTML =
      sorted
        .map(function (ev, index) {

          const title =
            escapeHtml(ev.title);

          const date =
            escapeHtml(ev.date);

          const location =
            escapeHtml(ev.location);

          const description =
            escapeHtml(ev.description);

          const image =
            safeUrl(ev.image);

          const ticketUrl =
            safeUrl(ev.ticket_url);


          /*
           * Erstes Event etwas prominenter darstellen,
           * wenn mehrere Events vorhanden sind.
           */

          const featuredClass =
            index === 0 && sorted.length > 1
              ? " event-card--featured"
              : "";


          /*
           * Coming soon
           */

          const comingSoon =
            Boolean(ev.coming_soon);


          const statusLabel =
            comingSoon
              ? "COMING SOON"
              : "UPCOMING";


          const actionLabel =
            comingSoon
              ? "Follow for updates"
              : "Get tickets";


          const actionIcon =
            comingSoon
              ? "ri-instagram-line"
              : "ri-arrow-right-up-line";


          return (
            '<article class="event-card' +
            featuredClass +
            ' reveal">' +

              /*
               * IMAGE
               */

              '<a ' +
                'class="event-card__image" ' +
                'href="' + ticketUrl + '" ' +
                'target="_blank" ' +
                'rel="noopener noreferrer" ' +
                'aria-label="' + title + '">' +

                '<img ' +
                  'src="' + image + '" ' +
                  'alt="' + title + '" ' +
                  'loading="lazy">' +

                '<div class="event-card__overlay"></div>' +


                /*
                 * STATUS
                 */

                '<span class="event-card__status">' +
                  statusLabel +
                '</span>' +


                /*
                 * NUMBER
                 */

                '<span class="event-card__number">' +
                  eventNumber(index) +
                '</span>' +

              '</a>' +


              /*
               * CONTENT
               */

              '<div class="event-card__content">' +

                '<div class="event-card__meta">' +

                  '<span>' +
                    '<i class="ri-calendar-line"></i>' +
                    date +
                  '</span>' +

                  '<span>' +
                    '<i class="ri-map-pin-line"></i>' +
                    location +
                  '</span>' +

                '</div>' +


                '<h3 class="event-card__title">' +
                  title +
                '</h3>' +


                (
                  description
                    ? '<p class="event-card__description">' +
                        description +
                      '</p>'
                    : ""
                ) +


                '<div class="event-card__footer">' +

                  '<span class="event-card__location">' +
                    location +
                  '</span>' +


                  '<a ' +
                    'class="event-card__arrow" ' +
                    'href="' + ticketUrl + '" ' +
                    'target="_blank" ' +
                    'rel="noopener noreferrer">' +

                    '<span>' +
                      actionLabel +
                    '</span>' +

                    '<i class="' +
                      actionIcon +
                    '"></i>' +

                  '</a>' +

                '</div>' +

              '</div>' +

            '</article>'
          );

        })
        .join("");


    /*
     * Dynamisch erzeugte Reveal-Elemente sichtbar machen.
     *
     * Der IntersectionObserver im index.html wurde bereits
     * ausgeführt, bevor die Events geladen wurden.
     */

    requestAnimationFrame(function () {

      container
        .querySelectorAll(".reveal")
        .forEach(function (element) {

          element.classList.add("is-visible");

        });

    });

  }


  /* ========================================================
     PAST EVENTS
  ======================================================== */

  function renderPast(events) {

    const container =
      document.getElementById("pastEventsTrack");


    if (!container) {
      return;
    }


    const sorted = events
      .slice()
      .sort(function (a, b) {

        return (
          (a.order || 0) -
          (b.order || 0)
        );

      });


    if (!sorted.length) {

      container.innerHTML = "";

      return;

    }


    container.innerHTML =
      sorted
        .map(function (ev, index) {

          const title =
            escapeHtml(ev.title);

          const image =
            safeUrl(ev.image);

          const date =
            escapeHtml(ev.date);

          const location =
            escapeHtml(ev.location);


          return (
            '<article class="past-event reveal">' +

              '<div class="past-event__image">' +

                '<img ' +
                  'src="' + image + '" ' +
                  'alt="' + title + '" ' +
                  'loading="lazy">' +

                '<span class="past-event__number">' +
                  eventNumber(index) +
                '</span>' +

              '</div>' +


              '<div class="past-event__content">' +

                '<div>' +

                  '<p class="past-event__meta">' +

                    (
                      date
                        ? '<span>' +
                            date +
                          '</span>'
                        : ""
                    ) +

                    (
                      date && location
                        ? '<span class="past-event__dot">·</span>'
                        : ""
                    ) +

                    (
                      location
                        ? '<span>' +
                            location +
                          '</span>'
                        : ""
                    ) +

                  '</p>' +


                  '<h3>' +
                    title +
                  '</h3>' +

                '</div>' +


                '<i class="ri-arrow-right-up-line"></i>' +

              '</div>' +

            '</article>'
          );

        })
        .join("");


    /*
     * Dynamisch erzeugte Elemente sichtbar machen
     */

    requestAnimationFrame(function () {

      container
        .querySelectorAll(".reveal")
        .forEach(function (element) {

          element.classList.add("is-visible");

        });

    });

  }


  /* ========================================================
     LOAD EVENTS.JSON
  ======================================================== */

  fetch("data/events.json", {
    cache: "no-store"
  })

    .then(function (response) {

      if (!response.ok) {

        throw new Error(
          "HTTP " + response.status
        );

      }

      return response.json();

    })


    .then(function (data) {

      /*
       * Bestehende JSON-Struktur:
       *
       * {
       *   upcoming: [],
       *   past: []
       * }
       */

      renderUpcoming(
        Array.isArray(data.upcoming)
          ? data.upcoming
          : []
      );


      renderPast(
        Array.isArray(data.past)
          ? data.past
          : []
      );

    })


    .catch(function (error) {

      console.error(
        "Afiya Events konnten nicht geladen werden:",
        error
      );


      /*
       * Upcoming Empty State anzeigen,
       * falls JSON nicht geladen werden konnte.
       */

      const emptyState =
        document.getElementById("eventsEmpty");

      if (emptyState) {
        emptyState.hidden = false;
      }

    });

})();