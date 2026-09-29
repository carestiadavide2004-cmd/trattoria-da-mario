// Galleria: apre le foto ingrandite al centro dello schermo (lightbox)

const lightbox = document.querySelector(".lightbox");
const immagineGrande = lightbox.querySelector(".lightbox-immagine");
const didascaliaGrande = lightbox.querySelector(".lightbox-didascalia");
const pulsanteChiudi = lightbox.querySelector(".lightbox-chiudi");

// Le foto Unsplash sono ritagliate a 800x600 per la griglia:
// nella versione ingrandita chiediamo la foto intera e più definita
function versioneGrande(src) {
  if (!src.includes("images.unsplash.com")) return src;
  const url = new URL(src);
  url.searchParams.delete("h");
  url.searchParams.delete("fit");
  url.searchParams.set("w", "1600");
  url.searchParams.set("q", "85");
  return url.toString();
}

function apri(elemento) {
  const foto = elemento.querySelector("img");
  immagineGrande.src = versioneGrande(foto.currentSrc || foto.src);
  immagineGrande.alt = foto.alt;
  didascaliaGrande.textContent = elemento.querySelector("figcaption")?.textContent ?? "";
  lightbox.showModal();
  document.body.classList.add("lightbox-aperta");
}

function chiudi() {
  lightbox.close();
}

document.querySelectorAll(".galleria-elemento").forEach((elemento) => {
  // Rende ogni foto raggiungibile e apribile anche da tastiera
  elemento.tabIndex = 0;
  elemento.setAttribute("role", "button");
  elemento.setAttribute("aria-label", "Ingrandisci: " + elemento.querySelector("img").alt);

  elemento.addEventListener("click", () => apri(elemento));
  elemento.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      apri(elemento);
    }
  });
});

pulsanteChiudi.addEventListener("click", chiudi);

// Clic fuori dall'immagine: lo sfondo scuro e lo spazio vuoto attorno alla foto
// appartengono al <dialog> stesso, non alla foto o alla didascalia
lightbox.addEventListener("click", (evento) => {
  if (evento.target === lightbox || evento.target.classList.contains("lightbox-contenuto")) {
    chiudi();
  }
});

// Scatta sia con la X sia con il tasto Esc
lightbox.addEventListener("close", () => {
  document.body.classList.remove("lightbox-aperta");
  immagineGrande.removeAttribute("src");
});
