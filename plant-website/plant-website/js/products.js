// ===== EDIT ME: site settings & product data =====
const CONFIG = { whatsapp: "919999999999", brand: "Verdance", currency: "₹" }; // country code + number, no "+"
const IMG = (n) => `assets/images/${n}.jpg`; // product/section photos live in assets/images/
const CATS = {
  all: ["All plants", "Everything we grow, packed and shipped from our nursery."],
  indoor: ["Indoor plants", "Easy, leafy companions for living rooms, bedrooms and desks."],
  outdoor: ["Outdoor plants", "Sun-lovers for balconies, terraces and gardens."],
  succulents: ["Succulents", "Compact plants that forgive a missed watering."],
  flowering: ["Flowering plants", "Colour for the warm months."],
  pots: ["Pots & planters", "Clay and ceramic pots with proper drainage."],
};
const PRODUCTS = [
  { id: 1, name: "Monstera Deliciosa", cat: "indoor", price: 899, old: 1099, stock: true, img: IMG("p1"), light: "Bright indirect", water: "Every 7-10 days", pet: "Not pet-safe", desc: "A statement leaf plant with split, glossy leaves. Grows fast once settled." },
  { id: 2, name: "Snake Plant Laurentii", cat: "indoor", price: 549, old: null, stock: true, img: IMG("p2"), light: "Low to bright", water: "Every 2-3 weeks", pet: "Not pet-safe", desc: "Upright, sculptural and nearly unkillable. A good first plant." },
  { id: 3, name: "Golden Money Plant", cat: "indoor", price: 349, old: 429, stock: true, img: IMG("p3"), light: "Indirect light", water: "Weekly, or grow in water", pet: "Not pet-safe", desc: "Trailing pothos that fills a shelf or hanging pot in a season." },
  { id: 4, name: "Echeveria Rosette", cat: "succulents", price: 249, old: null, stock: true, img: IMG("p4"), light: "Bright, some sun", water: "Every 10-14 days", pet: "Pet-safe", desc: "A tidy sage-green rosette that suits a sunny sill." },
  { id: 5, name: "Bougainvillea Magenta", cat: "flowering", price: 699, old: 799, stock: true, img: IMG("p5"), light: "Full sun", water: "Every 3-4 days", pet: "Mild irritant", desc: "Paper-bright magenta blooms for balconies and terraces." },
  { id: 6, name: "Areca Palm", cat: "outdoor", price: 1199, old: null, stock: false, img: IMG("p6"), light: "Bright indirect", water: "Every 5-7 days", pet: "Pet-safe", desc: "Feathery fronds that soften a corner. Back in stock soon." },
  { id: 7, name: "Jade Plant", cat: "succulents", price: 399, old: null, stock: true, img: IMG("p7"), light: "Bright light", water: "Every 2 weeks", pet: "Not pet-safe", desc: "A compact, tree-like succulent that is happy to be forgotten." },
  { id: 8, name: "Hibiscus Red", cat: "flowering", price: 449, old: 519, stock: true, img: IMG("p8"), light: "Full sun", water: "Every 2-3 days", pet: "Pet-safe", desc: "Large red blooms through the warm months." },
  { id: 9, name: "Fiddle Leaf Fig", cat: "indoor", price: 1499, old: 1799, stock: true, img: IMG("p9"), light: "Bright indirect", water: "Every 7-10 days", pet: "Not pet-safe", desc: "Big, violin-shaped leaves for a bright living room." },
  { id: 10, name: "Clay Pot Duo, Sand", cat: "pots", price: 599, old: null, stock: true, img: IMG("p10"), light: "Not applicable", water: "Not applicable", pet: "Not applicable", desc: "Two hand-finished clay pots in a soft sand tone, with drainage holes." },
  { id: 11, name: "Peace Lily", cat: "indoor", price: 499, old: null, stock: true, img: IMG("p11"), light: "Low to medium", water: "Weekly", pet: "Not pet-safe", desc: "White blooms and deep green leaves, forgiving in lower light." },
  { id: 12, name: "Dieffenbachia Camille", cat: "indoor", price: 649, old: 749, stock: true, img: IMG("p12"), light: "Bright indirect", water: "Every 7 days", pet: "Not pet-safe", desc: "Cream-and-green variegated leaves that brighten a dim corner." },
  { id: 13, name: "Caladium Pink Star", cat: "indoor", price: 379, old: null, stock: true, img: IMG("p13"), light: "Bright indirect", water: "Keep lightly moist", pet: "Not pet-safe", desc: "Heart-shaped leaves splashed with pink and white." },
  { id: 14, name: "Monstera Adansonii", cat: "indoor", price: 599, old: null, stock: true, img: IMG("p14"), light: "Bright indirect", water: "Every 7 days", pet: "Not pet-safe", desc: "Lacy, perforated leaves that climb or trail." },
  { id: 15, name: "Syngonium Green", cat: "indoor", price: 329, old: null, stock: true, img: IMG("p15"), light: "Indirect light", water: "Every 5-7 days", pet: "Not pet-safe", desc: "Arrow-shaped leaves in fresh lime green. Easy and quick." },
  { id: 16, name: "Oxalis Purple Shamrock", cat: "indoor", price: 299, old: null, stock: true, img: IMG("p16"), light: "Bright light", water: "Every 5-7 days", pet: "Not pet-safe", desc: "Deep purple triangular leaves with small pink flowers." },
  { id: 17, name: "Jade Bonsai Bowl", cat: "succulents", price: 1299, old: 1499, stock: true, img: IMG("p17"), light: "Bright light", water: "Every 2 weeks", pet: "Not pet-safe", desc: "A mature jade trained in a glazed bowl, ready to display." },
  { id: 18, name: "Calla Lily Pink", cat: "flowering", price: 549, old: null, stock: true, img: IMG("p18"), light: "Bright indirect", water: "Every 4-5 days", pet: "Not pet-safe", desc: "Elegant pink spathes over speckled leaves." },
  { id: 19, name: "Celosia Crimson", cat: "outdoor", price: 199, old: null, stock: true, img: IMG("p19"), light: "Full sun", water: "Every 2-3 days", pet: "Pet-safe", desc: "Velvety crimson plumes that last for weeks." },
  { id: 20, name: "Celosia Orange", cat: "outdoor", price: 199, old: null, stock: true, img: IMG("p20"), light: "Full sun", water: "Every 2-3 days", pet: "Pet-safe", desc: "Bold orange crests for sunny borders and pots." },
  { id: 21, name: "Adenium Desert Rose", cat: "outdoor", price: 899, old: 999, stock: true, img: IMG("p21"), light: "Full sun", water: "Every 5-7 days", pet: "Toxic if eaten", desc: "A swollen trunk topped with pink blooms. Loves heat." },
  { id: 22, name: "Smiley Ceramic Planter", cat: "pots", price: 449, old: null, stock: true, img: IMG("p22"), light: "Not applicable", water: "Not applicable", pet: "Not applicable", desc: "A speckled ceramic planter with saucer and a small face." },
];
// Add real reviews here; the testimonials section only appears when this has entries.
const REVIEWS = []; // { name: "Anita, Udaipur", text: "..." }
