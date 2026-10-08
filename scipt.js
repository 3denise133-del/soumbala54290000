/* =========================================================
   CONFIGURATION — MODIFIEZ UNIQUEMENT CES VALEURS
   ========================================================= */
const CONFIG = {
  // Numéro WhatsApp au format international SANS le + (ex: 22670000000)
  whatsappNumber: "22670000000",
  // Message par défaut pour le bouton flottant et le hero
  defaultMessage: "Bonjour, je souhaite commander du soumbala naturel du Burkina Faso."
};

/* =========================================================
   DONNÉES DES PRODUITS
   ========================================================= */
const PRODUCTS = [
  {
    id: 1,
    name: "Soumbala Naturel Premium",
    description: "Graines de néré fermentées et séchées, goût intense et authentique. Idéal pour vos sauces et riz.",
    format: "250 g",
    price: 2000,
    image: "images/image1.jpg",
    badge: "Best-seller"
  },
  {
    id: 2,
    name: "Soumbala en Poudre Fine",
    description: "Soumbala finement moulu, prêt à l'emploi. Se dissout facilement pour un assaisonnement homogène.",
    format: "200 g",
    price: 2500,
    image: "images/image2.jpg",
    badge: "Pratique"
  },
  {
    id: 3,
    name: "Soumbala Familial Économique",
    description: "Format familial pour les grandes tablées. Conservation longue durée dans un sachet hermétique.",
    format: "500 g",
    price: 3500,
    image: "images/image3.jpg",
    badge: "Économique"
  }
];

/* =========================================================
   FAQ
   ========================================================= */
const FAQS = [
  {
    q: "Qu'est-ce que le soumbala exactement ?",
    a: "Le soumbala est un condiment traditionnel africain fabriqué à partir des graines du néré. Après fermentation et séchage, il dégage un arôme puissant et unique qui enrichit les sauces, riz et plats mijotés."
  },
  {
    q: "Votre soumbala est-il vraiment naturel ?",
    a: "Oui, à 100%. Nous n'utilisons aucun additif, colorant ou conservateur chimique. La fermentation est naturelle et le séchage se fait au soleil."
  },
  {
    q: "Comment conserver le soumbala ?",
    a: "Conservez-le dans un endroit sec et frais, à l'abri de l'humidité, dans son sachet hermétique ou un bocal fermé. Il peut se garder plusieurs mois."
  },
  {
    q: "Livrez-vous partout au Burkina Faso ?",
    a: "Nous livrons à Ouagadougou et Bobo-Dioulasso sous 24-48h. Pour les autres villes, contactez-nous sur WhatsApp pour convenir des modalités."
  },
  {
    q: "Comment passer commande ?",
    a: "Cliquez sur « Commander » pour un produit, ou ajoutez plusieurs produits au panier puis cliquez sur « Commander sur WhatsApp ». Votre message est prérempli automatiquement."
  }
];

/* =========================================================
   ÉTAT DU PANIER
   ========================================================= */
let cart = [];

/* =========================================================
   INITIALISATION
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderFAQ();
  initNavigation();
  initScrollAnimations();
  initCart();
  initHeaderScroll();
  updateCartUI();
});

/* =========================================================
   RENDU DES PRODUITS
   ========================================================= */
function renderProducts() {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  grid.innerHTML = PRODUCTS.map(p => `
    <article class="product-card reveal">
      <div class="product-image">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <span class="product-badge">${p.badge}</span>
      </div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="product-meta">
          <span class="product-format"><i class="fa-solid fa-weight-hanging"></i> ${p.format}</span>
          <span class="product-price">${formatPrice(p.price)}</span>
        </div>
        <div class="product-actions">
          <button class="btn btn-cart" data-add="${p.id}">
            <i class="fa-solid fa-cart-plus"></i> Ajouter
          </button>
          <button class="btn btn-whatsapp" data-order="${p.id}">
            <i class="fa-brands fa-whatsapp"></i> Commander
          </button>
        </div>
      </div>
    </article>
  `).join("");

  // Événements produits
  grid.querySelectorAll("[data-add]").forEach(btn => {
    btn.addEventListener("click", () => addToCart(Number(btn.dataset.add)));
  });
  grid.querySelectorAll("[data-order]").forEach(btn => {
    btn.addEventListener("click", () => orderSingle(Number(btn.dataset.order)));
  });

  // Re-observer les nouveaux éléments
  observeReveals();
}

/* =========================================================
   RENDU FAQ
   ========================================================= */
function renderFAQ() {
  const list = document.getElementById("faqList");
  if (!list) return;

  list.innerHTML = FAQS.map((f, i) => `
    <div class="faq-item reveal" data-faq="${i}">
      <button class="faq-question" aria-expanded="false">
        <span>${f.q}</span>
        <i class="fa-solid fa-chevron-down"></i>
      </button>
      <div class="faq-answer">${f.a}</div>
    </div>
  `).join("");

  list.querySelectorAll(".faq-question").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const isActive = item.classList.contains("active");
      // Fermer tous les autres
      list.querySelectorAll(".faq-item").forEach(el => {
        el.classList.remove("active");
        el.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });
      if (!isActive) {
        item.classList.add("active");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  observeReveals();
}

/* =========================================================
   NAVIGATION MOBILE + LIENS ACTIFS
   ========================================================= */
function initNavigation() {
  const hamburger = document.getElementById("hamburger");
  const nav = document.getElementById("nav");
  const navLinks = document.querySelectorAll(".nav-link");

  hamburger?.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    nav.classList.toggle("active");
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      hamburger?.classList.remove("active");
      nav?.classList.remove("active");
    });
  });

  // Scroll spy — uniquement pour les 3 sections du menu principal
  const spySections = ["accueil", "apropos", "contact"];
  const sections = spySections
    .map(id => document.getElementById(id))
    .filter(Boolean);

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY + 120;
    let currentId = "accueil";
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentId = section.id;
      }
    });
    navLinks.forEach(l => l.classList.remove("active"));
    document.querySelector(`.nav-link[href="#${currentId}"]`)?.classList.add("active");
  });
}

/* =========================================================
   HEADER AU SCROLL
   ========================================================= */
function initHeaderScroll() {
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 30) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  });
}

/* =========================================================
   ANIMATIONS AU SCROLL
   ========================================================= */
let revealObserver;
function observeReveals() {
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
    return;
  }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });
  }
  document.querySelectorAll(".reveal:not(.visible)").forEach(el => revealObserver.observe(el));
}

function initScrollAnimations() {
  // Ajouter .reveal aux sections principales
  document.querySelectorAll(".section-head, .feature-card, .avis-card, .apropos-image, .apropos-text, .contact-info, .contact-image").forEach(el => {
    el.classList.add("reveal");
  });
  observeReveals();
}

/* =========================================================
   PANIER
   ========================================================= */
function initCart() {
  const cartBtn = document.getElementById("cartBtn");
  const cartClose = document.getElementById("cartClose");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartPanel = document.getElementById("cartPanel");
  const checkoutBtn = document.getElementById("checkoutBtn");

  const openCart = () => {
    cartPanel.classList.add("active");
    cartOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  };
  const closeCart = () => {
    cartPanel.classList.remove("active");
    cartOverlay.classList.remove("active");
    document.body.style.overflow = "";
  };

  cartBtn?.addEventListener("click", openCart);
  cartClose?.addEventListener("click", closeCart);
  cartOverlay?.addEventListener("click", closeCart);
  checkoutBtn?.addEventListener("click", checkoutWhatsApp);

  // Fermer avec Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCart();
  });
}

function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
  showToast(`${product.name} ajouté au panier`);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else updateCartUI();
}

function updateCartUI() {
  const countEl = document.getElementById("cartCount");
  const itemsEl = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");

  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.qty * i.price, 0);

  if (countEl) countEl.textContent = totalQty;
  if (totalEl) totalEl.textContent = formatPrice(totalPrice);

  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = `<p class="cart-empty">Votre panier est vide.</p>`;
    return;
  }

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <span class="cart-item-format">${item.format}</span>
        <div class="cart-item-bottom">
          <span class="cart-item-price">${formatPrice(item.price * item.qty)}</span>
          <div class="qty-control">
            <button class="qty-btn" data-minus="${item.id}" aria-label="Diminuer">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" data-plus="${item.id}" aria-label="Augmenter">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-remove="${item.id}">
          <i class="fa-solid fa-trash-can"></i> Retirer
        </button>
      </div>
    </div>
  `).join("");

  itemsEl.querySelectorAll("[data-plus]").forEach(b => b.addEventListener("click", () => changeQty(Number(b.dataset.plus), 1)));
  itemsEl.querySelectorAll("[data-minus]").forEach(b => b.addEventListener("click", () => changeQty(Number(b.dataset.minus), -1)));
  itemsEl.querySelectorAll("[data-remove]").forEach(b => b.addEventListener("click", () => removeFromCart(Number(b.dataset.remove))));
}

/* =========================================================
   COMMANDE WHATSAPP
   ========================================================= */
function orderSingle(id) {
  const p = PRODUCTS.find(prod => prod.id === id);
  if (!p) return;
  const message = `Bonjour, je souhaite commander :\n\n` +
    `• ${p.name}\n` +
    `• Format : ${p.format}\n` +
    `• Prix : ${formatPrice(p.price)}\n\n` +
    `Merci de me confirmer la disponibilité et les modalités de livraison.`;
  openWhatsApp(message);
}

function checkoutWhatsApp() {
  if (cart.length === 0) {
    showToast("Votre panier est vide.", "error");
    return;
  }
  const total = cart.reduce((sum, i) => sum + i.qty * i.price, 0);
  let message = "Bonjour, je souhaite passer la commande suivante :\n\n";
  cart.forEach(item => {
    message += `• ${item.name}\n   Format : ${item.format}\n   Quantité : ${item.qty}\n   Sous-total : ${formatPrice(item.qty * item.price)}\n\n`;
  });
  message += `━━━━━━━━━━━━━━\n`;
  message += `TOTAL : ${formatPrice(total)}\n\n`;
  message += `Merci de me confirmer la commande et les modalités de livraison.`;
  openWhatsApp(message);
}

function openWhatsApp(message) {
  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

/* =========================================================
   HELPERS
   ========================================================= */
function formatPrice(value) {
  return new Intl.NumberFormat("fr-FR").format(value) + " FCFA";
}

function showToast(message, type = "success") {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.className = "toast";
  }, 2500);
}
/* =========================================================
   COMPTEURS ANIMÉS (Page À propos)
   ========================================================= */
function initCounters() {
  const counters = document.querySelectorAll(".stat-number");
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = Number(el.dataset.count);
    const duration = 1800;
    const startTime = performance.now();
    const startValue = 0;

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // Easing easeOutQuad
      const eased = 1 - (1 - progress) * (1 - progress);
      const value = Math.floor(startValue + (target - startValue) * eased);
      el.textContent = value.toLocaleString("fr-FR");
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString("fr-FR");
    };
    requestAnimationFrame(step);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(animateCounter);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => observer.observe(c));
}

// Ajouter l'appel dans le DOMContentLoaded
document.addEventListener("DOMContentLoaded", initCounters);
/* =========================================================
   PAGE CONTACT — FAQ + FORMULAIRE
   ========================================================= */

/* ===== FAQ spécifique au contact ===== */
const FAQ_CONTACT = [
  {
    q: "Quels sont les délais de réponse ?",
    a: "Nous répondons généralement sous 24h ouvrées. Pour une réponse immédiate, privilégiez WhatsApp : nous sommes souvent disponibles en direct pendant les horaires d'ouverture."
  },
  {
    q: "Livrez-vous en dehors de Ouagadougou ?",
    a: "Oui. Nous livrons à Bobo-Dioulasso sous 48h et dans d'autres villes du Burkina Faso sur demande. Contactez-nous avec votre ville pour connaître les frais et délais exacts."
  },
  {
    q: "Puis-je commander en gros pour revendre ?",
    a: "Absolument. Nous proposons des tarifs préférentiels pour les revendeurs, restaurants et boutiques. Écrivez-nous via le formulaire (sujet « Devis / gros ») ou sur WhatsApp."
  },
  {
    q: "Quels sont les modes de paiement acceptés ?",
    a: "Nous acceptons les paiements par Orange Money, Moov Money, Wave et espèces à la livraison. Les modalités précises vous seront confirmées lors de la commande sur WhatsApp."
  },
  {
    q: "Puis-je venir récupérer ma commande sur place ?",
    a: "Oui, c'est possible sur rendez-vous à notre atelier de Ouagadougou. Contactez-nous d'abord sur WhatsApp pour convenir d'un créneau."
  }
];

function renderFAQContact() {
  const list = document.getElementById("faqContactList");
  if (!list) return;

  list.innerHTML = FAQ_CONTACT.map((f, i) => `
    <div class="faq-item reveal" data-faq="${i}">
      <button class="faq-question" aria-expanded="false">
        <span>${f.q}</span>
        <i class="fa-solid fa-chevron-down"></i>
      </button>
      <div class="faq-answer">${f.a}</div>
    </div>
  `).join("");

  list.querySelectorAll(".faq-question").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const isActive = item.classList.contains("active");
      list.querySelectorAll(".faq-item").forEach(el => {
        el.classList.remove("active");
        el.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });
      if (!isActive) {
        item.classList.add("active");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  observeReveals();
}

/* ===== Formulaire de contact → WhatsApp ===== */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const fields = {
    nom: {
      el: document.getElementById("nom"),
      validate: v => v.trim().length >= 2 || "Veuillez entrer votre nom complet."
    },
    telephone: {
      el: document.getElementById("telephone"),
      validate: v => /^[+0-9 ()-]{8,}$/.test(v.trim()) || "Veuillez entrer un numéro valide."
    },
    email: {
      el: document.getElementById("email"),
      validate: v => v.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Email invalide."
    },
    sujet: {
      el: document.getElementById("sujet"),
      validate: v => v.trim() !== "" || "Veuillez choisir un sujet."
    },
    message: {
      el: document.getElementById("message"),
      validate: v => v.trim().length >= 10 || "Votre message doit contenir au moins 10 caractères."
    }
  };

  const setError = (name, message) => {
    const field = fields[name];
    const errorEl = document.querySelector(`[data-error="${name}"]`);
    if (!field || !field.el) return;
    if (message) {
      field.el.classList.add("error");
      if (errorEl) errorEl.textContent = message;
    } else {
      field.el.classList.remove("error");
      if (errorEl) errorEl.textContent = "";
    }
  };

  // Validation en direct
  Object.keys(fields).forEach(name => {
    const field = fields[name];
    if (!field.el) return;
    field.el.addEventListener("input", () => {
      const result = field.validate(field.el.value);
      setError(name, result === true ? "" : result);
    });
    field.el.addEventListener("blur", () => {
      const result = field.validate(field.el.value);
      setError(name, result === true ? "" : result);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let hasError = false;
    const values = {};

    Object.keys(fields).forEach(name => {
      const field = fields[name];
      if (!field.el) return;
      const result = field.validate(field.el.value);
      if (result !== true) {
        setError(name, result);
        hasError = true;
      } else {
        setError(name, "");
        values[name] = field.el.value.trim();
      }
    });

    if (hasError) {
      showToast("Veuillez corriger les erreurs du formulaire.", "error");
      // Focus sur le premier champ en erreur
      const firstError = form.querySelector(".error");
      if (firstError) firstError.focus();
      return;
    }

    // Construction du message WhatsApp
    const lines = [
      "Bonjour, je vous contacte depuis votre site web.",
      "",
      `• Nom : ${values.nom}`,
      `• Téléphone : ${values.telephone}`,
      values.email ? `• Email : ${values.email}` : null,
      `• Sujet : ${values.sujet}`,
      "",
      "Message :",
      values.message
    ].filter(Boolean);

    const message = lines.join("\n");
    openWhatsApp(message);

    showToast("Redirection vers WhatsApp...");
    form.reset();

    // Nettoyer les erreurs
    Object.keys(fields).forEach(name => setError(name, ""));
  });
}

/* ===== Initialisation globale pour la page contact ===== */
document.addEventListener("DOMContentLoaded", () => {
  renderFAQContact();
  initContactForm();
});