const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const params = new URLSearchParams(location.search);
let filter = params.get("cat") in CATS ? params.get("cat") : "all", query = (params.get("q") || "").toLowerCase(), wishOnly = params.get("wish") === "1", sort = "default";
const heart = `<svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z"/></svg>`;

function card(p, i = 0) {
  return `<article class="card reveal" style="--d:${i * 70}ms">
    <div class="thumb"><a href="product.html?id=${p.id}" aria-label="${p.name}"><img src="${p.img}" alt="${p.name}" loading="lazy"></a>
      <button class="wish ${wish.includes(p.id) ? "on" : ""}" data-wish="${p.id}" aria-label="Save ${p.name}">${heart}</button></div>
    <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
    <p class="price">${money(p.price)} ${p.old ? `<s>${money(p.old)}</s>` : ""}</p>
    <p class="stock ${p.stock ? "in" : "out"}">${p.stock ? "In stock" : "Sold out"}</p>
    <div class="acts"><button class="btn small ghost" data-add="${p.id}" ${p.stock ? "" : "disabled"}>${p.stock ? "Add to cart" : "Sold out"}</button>${p.stock ? `<a class="btn small" target="_blank" rel="noopener" href="${buyLink(p)}">Buy now</a>` : ""}</div>
  </article>`;
}
function renderProducts() {
  const g = $("#grid"); if (!g) return;
  let list = PRODUCTS.filter((p) => (filter === "all" || p.cat === filter) && p.name.toLowerCase().includes(query) && (!wishOnly || wish.includes(p.id)));
  if (sort === "low") list.sort((a, b) => a.price - b.price); if (sort === "high") list.sort((a, b) => b.price - a.price);
  if (g.dataset.limit) list = list.slice(0, +g.dataset.limit);
  g.innerHTML = list.length ? list.map(card).join("") : `<p class="empty">No plants match. Try another category or search.</p>`;
  if ($("#count")) $("#count").textContent = `${list.length} ${list.length === 1 ? "plant" : "plants"}${wishOnly ? " saved" : ""}`;
  observe();
}
function setFilter(f) {
  filter = f; $$(".chip").forEach((c) => c.classList.toggle("active", c.dataset.filter === f));
  if ($("#shopTitle")) { $("#shopTitle").textContent = CATS[f][0]; $("#shopDesc").textContent = CATS[f][1]; document.title = `${CATS[f][0]} | ${CONFIG.brand}`; try { history.replaceState(null, "", f === "all" ? "shop.html" : "shop.html?cat=" + f); } catch {} }
  renderProducts();
}
function renderProduct() {
  const box = $("#product"); if (!box) return;
  const p = find(params.get("id"));
  if (!p) { box.innerHTML = `<p class="empty">We could not find that plant. <a href="shop.html"><u>Browse all plants</u></a></p>`; return; }
  document.title = `${p.name} | ${CONFIG.brand}`;
  box.innerHTML = `<div class="pimg"><img src="${p.img}" alt="${p.name}"></div>
   <div class="pinfo"><p class="crumb"><a href="index.html">Home</a> / <a href="shop.html">Shop</a> / <a href="shop.html?cat=${p.cat}">${CATS[p.cat][0]}</a></p>
    <h1>${p.name}</h1><p class="price">${money(p.price)} ${p.old ? `<s>${money(p.old)}</s>` : ""}</p>
    <p class="stock ${p.stock ? "in" : "out"}">${p.stock ? "In stock" : "Sold out"}</p><p>${p.desc}</p>
    <dl class="specs"><dt>Light</dt><dd>${p.light}</dd><dt>Water</dt><dd>${p.water}</dd><dt>Pets</dt><dd>${p.pet}</dd></dl>
    <div class="acts"><button class="btn" data-add="${p.id}" ${p.stock ? "" : "disabled"}>${p.stock ? "Add to cart" : "Sold out"}</button>${p.stock ? `<a class="btn ghost" target="_blank" rel="noopener" href="${buyLink(p)}">Buy now on WhatsApp</a>` : ""}
     <button class="wishbtn ${wish.includes(p.id) ? "on" : ""}" data-wish="${p.id}">${heart} Save</button></div>
    <p class="note">Delivery charges and payment details are confirmed with you on WhatsApp.</p></div>`;
  $(".wishbtn svg").setAttribute("style", "fill:none;stroke:currentColor;stroke-width:1.6");
  $("#related").innerHTML = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4).map(card).join("");
}
function renderCartPage() {
  const box = $("#cartPageItems"); if (!box) return;
  const ids = Object.keys(cart).filter(find);
  box.innerHTML = ids.length ? ids.map((id) => { const p = find(id); return `<div class="crow"><a href="product.html?id=${p.id}"><img src="${p.img}" alt=""></a><div><b>${p.name}</b><span>${money(p.price)} each</span><div class="qty"><button aria-label="Less" data-q="${id}" data-d="-1">−</button>${cart[id]}<button aria-label="More" data-q="${id}" data-d="1">+</button></div></div><b>${money(p.price * cart[id])}</b></div>`; }).join("") : `<p class="empty">Your cart is empty. <a href="shop.html"><u>Browse plants</u></a></p>`;
  $("#pageTotal").textContent = money(cartTotal());
}
let io;
function observe() {
  if (reduce || !("IntersectionObserver" in window)) return $$(".reveal").forEach((e) => e.classList.add("in"));
  io = io || new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 });
  $$(".reveal:not(.in)").forEach((e) => io.observe(e));
}
document.addEventListener("click", (e) => {
  const t = e.target.closest("button, a"); if (!t) return;
  if (t.dataset.add) addToCart(t.dataset.add);
  if (t.dataset.wish) { toggleWish(t.dataset.wish); if (t.classList.contains("wishbtn")) t.classList.toggle("on", wish.includes(+t.dataset.wish)); if (wishOnly) renderProducts(); }
  if (t.dataset.q) changeQty(t.dataset.q, +t.dataset.d);
  if (t.dataset.filter) setFilter(t.dataset.filter);
  if (t.dataset.open) document.body.classList.toggle("open-" + t.dataset.open);
  if (t.dataset.open === "search") setTimeout(() => $("#searchInput").focus(), 300);
  if (t.dataset.close !== undefined) document.body.classList.remove("open-cart", "open-menu", "open-search");
  if (t.matches(".menu a")) document.body.classList.remove("open-menu");
  if (t.id === "wishToggle") { if (!$("#grid")) return (location.href = "shop.html?wish=1"); wishOnly = !wishOnly; t.classList.toggle("on", wishOnly); renderProducts(); }
  if (t.id === "toTop") scrollTo({ top: 0, behavior: "smooth" });
});
$("#searchInput").addEventListener("input", (e) => { if (!$("#grid")) return; query = e.target.value.trim().toLowerCase(); renderProducts(); });
$("#searchForm").addEventListener("submit", (e) => {
  e.preventDefault(); const q = $("#searchInput").value.trim();
  if (!$("#grid") || $("#grid").dataset.limit) return (location.href = "shop.html?q=" + encodeURIComponent(q));
  document.body.classList.remove("open-search");
});
if (sort) $("#sort")?.addEventListener("change", (e) => { sort = e.target.value; renderProducts(); });
$("#placeOrder")?.addEventListener("click", () => {
  const ids = Object.keys(cart).filter(find), n = $("#cName").value.trim(), a = $("#cAddr").value.trim(), ph = $("#cPhone").value.trim();
  if (!ids.length) return toast("Your cart is empty");
  if (!n || !a) return toast("Please add your name and delivery address");
  const lines = ids.map((id) => `• ${find(id).name} × ${cart[id]} = ${money(find(id).price * cart[id])}`).join("\n");
  open(whatsappLink(`Hi ${CONFIG.brand}, I'd like to place an order:\n\n${lines}\n\nTotal: ${money(cartTotal())}\n\nName: ${n}${ph ? "\nPhone: " + ph : ""}\nDelivery address: ${a}`), "_blank");
});
$("#contactForm")?.addEventListener("submit", (e) => {
  e.preventDefault(); const f = new FormData(e.target);
  open(whatsappLink(`Hi ${CONFIG.brand}, this is ${f.get("name")}.\n${f.get("phone") ? "Phone: " + f.get("phone") + "\n" : ""}\n${f.get("message")}`), "_blank"); e.target.reset();
});
document.addEventListener("keydown", (e) => e.key === "Escape" && document.body.classList.remove("open-cart", "open-menu", "open-search"));
addEventListener("scroll", () => {
  $("#header").classList.toggle("solid", scrollY > 40); $("#toTop").classList.toggle("show", scrollY > 700);
  if (!reduce) $$("[data-parallax]").forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.style.setProperty("--py", (r.top * -0.06).toFixed(1) + "px"); });
}, { passive: true });
$$("[data-wa]").forEach((a) => (a.href = whatsappLink(a.dataset.wa.replace("{brand}", CONFIG.brand))));
if (REVIEWS.length && $("#reviews")) { $("#reviews").hidden = false; $("#reviewList").innerHTML = REVIEWS.map((r) => `<blockquote class="reveal"><p>${r.text}</p><cite>${r.name}</cite></blockquote>`).join(""); }
const here = location.pathname.split("/").pop() || "index.html";
$$(".menu a").forEach((a) => { const h = a.getAttribute("href"); if (h === here + (here === "shop.html" ? location.search : "") || (h === "shop.html" && here === "product.html")) a.setAttribute("aria-current", "page"); });
$("#year").textContent = new Date().getFullYear(); $("#wishCount").textContent = wish.length;
if ($("#searchInput") && query) $("#searchInput").value = params.get("q");
if ($("#shopTitle")) setFilter(filter); else renderProducts();
renderProduct(); renderCart(); observe();
