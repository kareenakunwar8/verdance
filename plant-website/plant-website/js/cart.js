const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)) || (k === "vd_cart" ? {} : []); } catch { return k === "vd_cart" ? {} : []; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
let cart = store.get("vd_cart"), wish = store.get("vd_wish");
const money = (n) => CONFIG.currency + n.toLocaleString("en-IN");
const find = (id) => PRODUCTS.find((p) => p.id === +id);
function toast(msg) {
  const t = document.getElementById("toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2200);
}
function addToCart(id) {
  const p = find(id); if (!p || !p.stock) return;
  cart[id] = (cart[id] || 0) + 1; store.set("vd_cart", cart); renderCart(); toast(`${p.name} added to cart`);
  const c = document.getElementById("cartCount"); c.classList.remove("pop"); void c.offsetWidth; c.classList.add("pop");
}
function changeQty(id, d) { cart[id] = (cart[id] || 0) + d; if (cart[id] <= 0) delete cart[id]; store.set("vd_cart", cart); renderCart(); }
function toggleWish(id) {
  wish = wish.includes(+id) ? wish.filter((x) => x !== +id) : [...wish, +id]; store.set("vd_wish", wish);
  document.getElementById("wishCount").textContent = wish.length;
  document.querySelectorAll(`[data-wish="${id}"]`).forEach((b) => b.classList.toggle("on", wish.includes(+id)));
}
function cartTotal() { return Object.entries(cart).reduce((s, [id, q]) => s + find(id).price * q, 0); }
function buyLink(p) {
  return whatsappLink(`Hi ${CONFIG.brand}, I want to buy this:\n\nProduct: ${p.name}\nType: ${CATS[p.cat][0]}\nPrice: ${money(p.price)}\nQuantity: 1\n\nPlease confirm availability, delivery charges and payment details.`);
}
function whatsappLink(text) { return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`; }
function renderCart() {
  const ids = Object.keys(cart).filter(find), box = document.getElementById("cartItems");
  document.getElementById("cartCount").textContent = ids.reduce((s, i) => s + cart[i], 0);
  box.innerHTML = ids.length ? ids.map((id) => { const p = find(id); return `<div class="line"><img src="${p.img}" alt=""><div><b>${p.name}</b><span>${money(p.price)}</span><div class="qty"><button aria-label="Less" data-q="${id}" data-d="-1">−</button>${cart[id]}<button aria-label="More" data-q="${id}" data-d="1">+</button></div></div></div>`; }).join("") : `<p class="empty">Your cart is empty. Pick a plant to begin.</p>`;
  document.getElementById("cartTotal").textContent = money(cartTotal());
  const order = document.getElementById("cartOrder");
  const lines = ids.map((id) => `• ${find(id).name} × ${cart[id]}`).join("\n");
  order.href = ids.length ? whatsappLink(`Hi ${CONFIG.brand}, I'd like to order:\n${lines}\nTotal: ${money(cartTotal())}`) : "#";
  order.classList.toggle("disabled", !ids.length);
  if (typeof renderCartPage === "function") renderCartPage();
}
