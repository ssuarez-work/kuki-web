/* assets/js/products.js */

// === Config ===
const WHATSAPP_PHONE = "521000000000"; // tu número
const CATEGORY_LABELS = {
  kimetsu: "Playeras Kimetsu",
  tokyo: "Playeras Tokyo Revengers",
  otros: "Otros artículos"
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

  const params = new URLSearchParams(location.search);
  const startCat = params.get("cat") || "all";

  // 1) Cargar productos
  const res = await fetch("products.json");
  const products = await res.json();

  // 2) Pintar cards
  const frag = document.createDocumentFragment();
  products.forEach(p => {
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
    node.querySelector(".buy").innerHTML = `Comprar <span style='font-size:0.95em'>(999 747 8066)</span>`;

    // Detalles
    // Detalles
    node.querySelector(".details").href = `product.html?id=${encodeURIComponent(p.id)}`;


    frag.appendChild(node);
  });
  catalog.appendChild(frag);

  // 3) Construir barra de categorías con contador
  const counts = products.reduce((acc, p) => ((acc[p.category] = (acc[p.category] || 0) + 1), acc), {});
  const cats = ["all", ...Object.keys(counts)];

  cats.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "tab-btn";
    btn.type = "button";
    btn.setAttribute("role", "tab");
    btn.dataset.cat = cat;

    const label = cat === "all" ? "Todas" : (CATEGORY_LABELS[cat] || titleCase(cat));
    const qty = cat === "all" ? products.length : counts[cat];

    btn.innerHTML = `${label} <span class="tab-count">${qty}</span>`;
    if (cat === startCat) btn.setAttribute("aria-selected", "true");
    catBar.appendChild(btn);
  });

  // 4) Filtro
  function applyFilter(cat) {
    setSelected(cat);
    $$(".item").forEach(card => {
      const match = (cat === "all" || card.dataset.cat === cat);
      card.classList.toggle("hidden", !match);
    });
    // Actualiza URL sin recargar (deep-link)
    const u = new URL(location.href);
    if (cat === "all") u.searchParams.delete("cat"); else u.searchParams.set("cat", cat);
    history.replaceState({}, "", u);
  }

  // Click con delegación
  $("#catBar").addEventListener("click", e => {
    const btn = e.target.closest(".tab-btn");
    if (!btn) return;
    applyFilter(btn.dataset.cat);
  });

  // Accesibilidad: teclado (Enter/Espacio)
  $("#catBar").addEventListener("keydown", e => {
    if (!["Enter", " "].includes(e.key)) return;
    const btn = e.target.closest(".tab-btn");
    if (!btn) return;
    e.preventDefault();
    applyFilter(btn.dataset.cat);
  });

  // Categoría inicial
  applyFilter(startCat);
});
