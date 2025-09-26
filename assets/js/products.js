 // No changes made as 'Kuri' was not found in the file.
/* assets/js/products.js */

// === Config ===
const WHATSAPP_PHONE = "521000000000"; // tu número
const CATEGORY_LABELS = {
  kimetsu: "Kimetsu No Yaiba",
  tokyo: "Tokyo Revengers",
  otros: "Otros artículos",
  "demon-hunters": "K-Pop Demon Hunters"
};

// === Helpers ===
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const titleCase = s => s.replace(/[-_]/g, " ").replace(/\b\w/g, m => m.toUpperCase());
const setSelected = (cat) => {
  $$(".tab-btn").forEach(b => b.setAttribute("aria-selected", String(b.dataset.cat === cat)));
};

// === Render ===
document.addEventListener("DOMContentLoaded", async () => {
  const catalog = $("#catalog");
  const tpl = $("#card-tpl");
  const catBar = $("#catBar");
  const modalCatBar = $("#modalCatBar");
  const filtersModal = $("#filtersModal");
  const openFilters = $("#openFilters");
  const closeFilters = $("#closeFilters");

  const params = new URLSearchParams(location.search);
  const startCat = params.get("cat") || "all";

  // 1) Cargar productos
  const res = await fetch("products.json");
  const products = await res.json();

  // 2) Pintar cards
  // Agrupar productos por categoría
  const grouped = {};
  products.forEach(p => {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  });

  const frag = document.createDocumentFragment();
  Object.entries(grouped).forEach(([cat, items]) => {
    // Título de la categoría
    const h2 = document.createElement("h2");
    h2.textContent = CATEGORY_LABELS[cat] || titleCase(cat);
    h2.className = "cat-title";
    frag.appendChild(h2);
    // Productos
    items.forEach(p => {
      const node = tpl.content.cloneNode(true);
      const card = node.querySelector(".card");
      card.dataset.cat = p.category;

      const img = node.querySelector(".thumb img");
      img.src = p.img;
      img.alt = p.name;
      img.loading = "lazy";

      node.querySelector(".name").textContent = p.name;
      node.querySelector(".sizes").textContent = p.sizes || "";
      node.querySelector(".price").textContent = `$${p.price}`;

      const chips = node.querySelector(".chips");
      (p.tags || []).forEach(t => {
        const span = document.createElement("span");
        span.className = "chip";
        span.textContent = t;
        chips.appendChild(span);
      });

      // Comprar (WhatsApp)
      node.querySelector(".buy").href =
        `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Quiero " + p.name)}`;

      // Detalles
      node.querySelector(".details").href = `product.html?id=${encodeURIComponent(p.id)}`;

      frag.appendChild(node);
    });
  });
  catalog.appendChild(frag);

  // 3) Construir barra de categorías con contador
  const counts = products.reduce((acc, p) => ((acc[p.category] = (acc[p.category] || 0) + 1), acc), {});
  const cats = ["all", ...Object.keys(counts)];

  // Mostrar todos los botones de categoría en la barra principal en escritorio
  cats.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "tab-btn";
    btn.type = "button";
    btn.setAttribute("role", "tab");
    btn.dataset.cat = cat;
    const label = cat === "all" ? "Todos los productos" : (CATEGORY_LABELS[cat] || titleCase(cat));
    const qty = cat === "all" ? products.length : counts[cat];
    btn.innerHTML = `${label} <span class="tab-count">${qty}</span>`;
    if (cat === startCat) btn.setAttribute("aria-selected", "true");
    // Solo mostrar todos en desktop, y solo 'Todos' en móvil
    if (cat === "all") {
      catBar.appendChild(btn);
    } else {
      btn.classList.add("d-none", "d-md-inline-flex");
      catBar.appendChild(btn);
    }
    modalCatBar.appendChild(btn.cloneNode(true));
  });

  // Abrir/cerrar modal filtros en móvil
  if (openFilters && filtersModal && closeFilters) {
    openFilters.addEventListener("click", () => {
      filtersModal.style.display = "flex";
    });
    closeFilters.addEventListener("click", () => {
      filtersModal.style.display = "none";
    });
    filtersModal.addEventListener("click", e => {
      if (e.target === filtersModal) filtersModal.style.display = "none";
    });
    // Filtro desde modal
    modalCatBar.addEventListener("click", e => {
      const btn = e.target.closest(".tab-btn");
      if (!btn) return;
      filtersModal.style.display = "none";
      applyFilter(btn.dataset.cat, true);
    });
  }

  // 4) Filtro
  function applyFilter(cat, scrollToFirst = false) {
    setSelected(cat);
    // Actualiza URL sin recargar (deep-link)
    const u = new URL(location.href);
    if (cat === "all") u.searchParams.delete("cat"); else u.searchParams.set("cat", cat);
    history.replaceState({}, "", u);

    // Mostrar/ocultar productos y títulos
    $$(".card").forEach(card => {
      if (cat === "all" || card.dataset.cat === cat) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
    $$(".cat-title").forEach(title => {
      if (cat === "all" || title.textContent === (CATEGORY_LABELS[cat] || titleCase(cat))) {
        title.style.display = "";
      } else {
        title.style.display = "none";
      }
    });

    // Scroll al primer producto de la categoría
    if (scrollToFirst && cat !== "all") {
      const first = $$(".card").find(card => card.style.display !== "none");
      if (first) {
        first.scrollIntoView({behavior: "smooth", block: "center"});
      }
    }
  }

  // Click con delegación
  $("#catBar").addEventListener("click", e => {
    const btn = e.target.closest(".tab-btn");
    if (!btn) return;
    applyFilter(btn.dataset.cat, true);
  });

  // Accesibilidad: teclado (Enter/Espacio)
  $("#catBar").addEventListener("keydown", e => {
    if (!["Enter", " "].includes(e.key)) return;
    const btn = e.target.closest(".tab-btn");
    if (!btn) return;
    e.preventDefault();
    applyFilter(btn.dataset.cat, true);
  });

  // Categoría inicial
  applyFilter(startCat);
});
