// Cursore a forma di fetta di pizza: segue il mouse con un movimento morbido
// e reagisce con un piccolo rimbalzo sopra link, bottoni e foto cliccabili.
// Attivo solo con il mouse: su touch e penna resta il comportamento normale.

(() => {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const movimentoRidotto = window.matchMedia("(prefers-reduced-motion: reduce)");

  const CLICCABILI = 'a[href], button, [role="button"], label, summary, select';
  // Qui torna il puntatore normale: campi di testo, mappa (iframe) e foto ingrandita
  // (il <dialog> sta sopra a tutto, la pizza resterebbe nascosta sotto lo sfondo scuro)
  const NATIVI = 'input, textarea, [contenteditable], iframe, dialog[open]';

  const cursore = document.createElement("div");
  cursore.className = "cursore-pizza";
  cursore.setAttribute("aria-hidden", "true");
  // La punta della fetta è in alto a sinistra: è il punto che "clicca"
  cursore.innerHTML = `
    <svg class="cursore-pizza-icona" viewBox="0 0 32 32" width="26" height="26">
      <path class="cursore-pizza-formaggio" d="M2 2 L30 14 A30.5 30.5 0 0 1 14 30 Z"/>
      <path class="cursore-pizza-crosta" d="M30 14 A30.5 30.5 0 0 1 14 30 L12.2 25.9 A26 26 0 0 0 25.9 12.2 Z"/>
      <circle class="cursore-pizza-salame" cx="9.5" cy="8.5" r="2"/>
      <circle class="cursore-pizza-salame" cx="20" cy="13" r="2.4"/>
      <circle class="cursore-pizza-salame" cx="13" cy="20.5" r="2.2"/>
      <ellipse class="cursore-pizza-basilico" cx="18.5" cy="19" rx="2.2" ry="1.1" transform="rotate(-45 18.5 19)"/>
      <path class="cursore-pizza-bordo" d="M2 2 L30 14 A30.5 30.5 0 0 1 14 30 Z"/>
    </svg>`;
  document.body.append(cursore);

  const radice = document.documentElement;
  let mouseX = 0;
  let mouseY = 0;
  let x = 0;
  let y = 0;
  let animazione = null;
  let visibile = false;
  let sopraNativo = false;

  function mostra(si) {
    if (si === visibile) return;
    visibile = si;
    cursore.classList.toggle("cursore-pizza--visibile", si);
    // Nasconde la freccia del sistema solo mentre la pizza è visibile
    radice.classList.toggle("cursore-pizza-attivo", si);
  }

  // Avvicina la pizza al mouse a ogni fotogramma; si ferma quando l'ha raggiunto,
  // così a mouse fermo non gira nessuna animazione
  function segui() {
    const morbidezza = movimentoRidotto.matches ? 1 : 0.35;
    x += (mouseX - x) * morbidezza;
    y += (mouseY - y) * morbidezza;

    if (Math.abs(mouseX - x) < 0.1 && Math.abs(mouseY - y) < 0.1) {
      x = mouseX;
      y = mouseY;
      animazione = null;
    } else {
      animazione = requestAnimationFrame(segui);
    }
    cursore.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  document.addEventListener("pointermove", (evento) => {
    if (evento.pointerType !== "mouse") {
      mostra(false);
      return;
    }
    mouseX = evento.clientX;
    mouseY = evento.clientY;

    if (!visibile && !sopraNativo) {
      // Ricompare direttamente sotto il mouse, senza "scivolare" dalla vecchia posizione
      x = mouseX;
      y = mouseY;
      cursore.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      mostra(true);
    }
    if (!animazione) animazione = requestAnimationFrame(segui);
  }, { passive: true });

  document.addEventListener("pointerover", (evento) => {
    if (evento.pointerType !== "mouse") return;
    sopraNativo = Boolean(evento.target.closest(NATIVI));
    if (sopraNativo) mostra(false);
    cursore.classList.toggle("cursore-pizza--cliccabile", Boolean(evento.target.closest(CLICCABILI)));
  });

  // Il mouse esce dalla finestra
  document.addEventListener("pointerout", (evento) => {
    if (!evento.relatedTarget) mostra(false);
  });

  document.addEventListener("pointerdown", () => cursore.classList.add("cursore-pizza--premuto"));
  document.addEventListener("pointerup", () => cursore.classList.remove("cursore-pizza--premuto"));
  window.addEventListener("blur", () => cursore.classList.remove("cursore-pizza--premuto"));
})();
