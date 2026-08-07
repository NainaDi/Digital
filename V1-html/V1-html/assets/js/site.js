(function () {
  const D = window.OTO;
  const STORAGE = {
    cart: "oto-cart-v2",
    currency: "oto-currency",
    theme: "oto-theme",
    font: "oto-font",
    typeSize: "oto-type-size",
    wishlist: "oto-wishlist",
    recent: "oto-recent",
    mobileSearches: "oto-mobile-searches"
  };

  const state = {
    currency: localStorage.getItem(STORAGE.currency) || "INR",
    cart: readStorage(STORAGE.cart, []),
    wishlist: readStorage(STORAGE.wishlist, [])
  };
  let quickViewProduct = null;
  let quickViewSize = "";
  let quickViewLastFocused = null;
  let mobileSurfaceLastFocused = null;
  const MOBILE_QUERY = window.matchMedia("(max-width: 900px)");

  function readStorage(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value == null ? fallback : value;
    } catch (error) {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function logoSvg(className) {
    return `<svg class="${className || ""}" viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <circle cx="50" cy="50" r="47" stroke="currentColor" stroke-width="2.6"/>
      <circle cx="50" cy="50" r="41" stroke="currentColor" stroke-width="1.6"/>
      <line x1="9.5" y1="42" x2="90.5" y2="42" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"/>
      <line x1="50" y1="42" x2="50" y2="90" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"/>
    </svg>`;
  }

  function icon(name, label) {
    return `<i data-lucide="${name}" aria-hidden="true"></i>${label ? `<span class="sr-only">${label}</span>` : ""}`;
  }

  function formatMoney(inr, usd, currency) {
    const selected = currency || state.currency;
    if (selected === "USD") return `$${Number(usd || Math.round(Number(inr) / 85)).toLocaleString("en-US")}`;
    return `\u20B9 ${Number(inr || 0).toLocaleString("en-IN")}`;
  }

  function findProduct(handle) {
    return D.PRODUCTS.find((product) => product.handle === handle) || D.PRODUCTS[0];
  }

  function productUrl(handle) {
    return `product.html?handle=${encodeURIComponent(handle)}`;
  }

  function collectionUrl(handle) {
    return `collection.html?handle=${encodeURIComponent(handle || "all")}`;
  }

  function productCard(product, options) {
    const settings = options || {};
    const wished = state.wishlist.includes(product.handle);
    return `<article class="product-card reveal" data-product-handle="${escapeHtml(product.handle)}">
      <div class="product-media-wrap">
        <a class="product-media" href="${productUrl(product.handle)}" aria-label="View ${escapeHtml(product.name)}">
          ${product.badge ? `<span class="product-badge">${escapeHtml(product.badge)}</span>` : ""}
          <img class="product-primary" src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy">
          <img class="product-secondary" src="${product.hoverImage || product.image}" alt="${escapeHtml(product.name)} detail" loading="lazy">
        </a>
        <button class="wishlist${wished ? " is-active" : ""}" type="button" data-wishlist="${escapeHtml(product.handle)}" aria-label="${wished ? "Remove from" : "Add to"} wishlist">${icon("heart")}</button>
        <div class="product-card-actions">
          <button class="quick-view" type="button" data-quick-view="${escapeHtml(product.handle)}">Quick view</button>
          ${settings.quickAdd === false ? "" : `<button class="quick-add" type="button" data-quick-add="${escapeHtml(product.handle)}">${product.sizingMode === "none" ? "Quick add" : "Choose options"}</button>`}
        </div>
      </div>
      <div class="product-card-info">
        <h3><a href="${productUrl(product.handle)}">${escapeHtml(product.name)}</a></h3>
        ${product.badge === "Edition of One" ? `<div class="product-edition"><span>✢</span> Edition of one <span>✢</span></div>` : ""}
        <p class="money" data-inr="${product.priceINR}" data-usd="${product.priceUSD}">${formatMoney(product.priceINR, product.priceUSD)}</p>
      </div>
    </article>`;
  }

  function discoverRoute(label) {
    if (label === "Our Story") return "our-story.html";
    if (label === "Designer's Note") return "designers-note.html";
    return "";
  }

  function discoverItem(label, mobile) {
    const route = discoverRoute(label);
    if (route) return `<a${mobile ? "" : " class=\"mega-item\""} href="${route}">${escapeHtml(label)}</a>`;
    return mobile
      ? `<button type="button" data-showcase="${escapeHtml(label)}">${escapeHtml(label)}</button>`
      : `<button class="mega-item" type="button" data-showcase="${escapeHtml(label)}">${escapeHtml(label)}</button>`;
  }

  function discoverGroups() {
    return D.DISCOVER_MENU.map((group) => `<div>
      <div class="mega-title">${escapeHtml(group.title)}</div>
      ${group.links.map((link) => discoverItem(link, false)).join("")}
    </div>`).join("");
  }

  function menuItem(link) {
    return link.handle
      ? `<a class="mega-item" href="${collectionUrl(link.handle)}">${escapeHtml(link.label)}</a>`
      : `<button class="mega-item" type="button" data-showcase="${escapeHtml(link.label)}">${escapeHtml(link.label)}</button>`;
  }

  function menuGroups(groups, className) {
    return `<div class="mega-groups ${className || ""}">${groups.map((group) => `<div><div class="mega-title">${escapeHtml(group.title)}</div>${group.links.map(menuItem).join("")}</div>`).join("")}</div>`;
  }

  function megaSpots(spots) {
    return `<div class="mega-spots">${spots.map((spot) => `<a class="mega-spot" href="${collectionUrl(spot.handle)}"><img src="${spot.image}" alt="${escapeHtml(spot.label)}"><span>${escapeHtml(spot.label)}</span></a>`).join("")}</div>`;
  }

  function shopMega() {
    return `<div class="mega-menu" id="shopMenu" aria-label="Shop menu"><div class="mega-layout"><div class="shop-menu-tree"><a class="mega-callout" href="${collectionUrl(D.SHOP_MENU.callout.handle)}">${escapeHtml(D.SHOP_MENU.callout.label)} ${icon("arrow-up-right")}</a>${menuGroups(D.SHOP_MENU.groups, "mega-groups-shop")}</div>${megaSpots(D.SHOP_MENU.spots)}</div></div>`;
  }

  function collectionsMega() {
    return `<div class="mega-menu" id="collectionsMenu" aria-label="Collections menu"><div class="mega-layout">${menuGroups(D.COLLECTION_MENU.groups, "mega-groups-collections")}${megaSpots(D.COLLECTION_MENU.spots)}</div></div>`;
  }

  function mobileDiscoverGroups() {
    return D.DISCOVER_MENU.map((group) => `<div>
      <h3>${escapeHtml(group.title)}</h3>
      ${group.links.map((link) => discoverItem(link, true)).join("")}
    </div>`).join("");
  }

  function mobileMenuItem(link) {
    const route = discoverRoute(link.label);
    if (link.handle) return `<a href="${collectionUrl(link.handle)}">${escapeHtml(link.label)}</a>`;
    if (route) return `<a href="${route}">${escapeHtml(link.label)}</a>`;
    return `<button type="button" data-showcase="${escapeHtml(link.label)}">${escapeHtml(link.label)}</button>`;
  }

  function mobileMenuGroups(groups) {
    return groups.map((group) => `<section class="mobile-menu-group"><h3>${escapeHtml(group.title)}</h3>${group.links.map(mobileMenuItem).join("")}</section>`).join("");
  }

  function mobileAccordion(id, label, content) {
    return `<section class="mobile-menu-accordion">
      <button class="mobile-menu-trigger" type="button" data-mobile-accordion="${id}" aria-expanded="false" aria-controls="mobile-${id}-panel"><span>${label}</span>${icon("chevron-down")}</button>
      <div class="mobile-menu-panel" id="mobile-${id}-panel" data-mobile-panel="${id}" hidden>${content}</div>
    </section>`;
  }

  function mobileMenuMarkup() {
    const shop = `<a class="mobile-menu-callout" href="${collectionUrl(D.SHOP_MENU.callout.handle)}">${escapeHtml(D.SHOP_MENU.callout.label)}</a>${mobileMenuGroups(D.SHOP_MENU.groups)}`;
    const collections = `<a class="mobile-menu-callout" href="${collectionUrl("collections")}">View All Collections</a>${mobileMenuGroups(D.COLLECTION_MENU.groups)}`;
    const discover = mobileMenuGroups(D.DISCOVER_MENU);
    return `<a class="mobile-menu-direct" href="${collectionUrl("new")}"><span>New In</span>${icon("arrow-up-right")}</a>
      ${mobileAccordion("shop", "Shop", shop)}
      ${mobileAccordion("collections", "Collections", collections)}
      ${mobileAccordion("discover", "Discover", discover)}
      <a class="mobile-menu-direct" href="gift-card.html"><span>Gift Card</span>${icon("arrow-up-right")}</a>`;
  }

  function mobileNavActive(id) {
    const page = document.body.dataset.page;
    if (id === "home") return page === "home";
    if (id === "shop") return page === "collection" || page === "product";
    if (id === "bag") return page === "cart";
    return false;
  }

  function mobileBottomNavMarkup() {
    return D.MOBILE_NAV.map((item) => {
      const classes = `mobile-bottom-item${mobileNavActive(item.id) ? " is-active" : ""}`;
      const badge = item.badge ? `<span class="mobile-nav-badge" id="mobile${item.badge === "cart" ? "Cart" : "Saved"}Badge" hidden>0</span>` : "";
      const content = `<span class="mobile-bottom-icon">${icon(item.icon)}${badge}</span><span>${escapeHtml(item.label)}</span>`;
      return item.href
        ? `<a class="${classes}" href="${item.href}" data-mobile-nav="${item.id}"${mobileNavActive(item.id) ? " aria-current=\"page\"" : ""}>${content}</a>`
        : `<button class="${classes}" type="button" data-mobile-action="${item.action}" data-mobile-nav="${item.id}">${content}</button>`;
    }).join("");
  }

  function injectSiteShell() {
    const headerMount = document.getElementById("site-shell");
    if (!headerMount) return;
    const isHome = document.body.dataset.page === "home";
    headerMount.innerHTML = `${isHome ? `<div class="announcement">${escapeHtml(D.SITE_CONFIG.announcement)}</div>` : ""}
      <header class="site-header" id="siteHeader">
        <nav class="nav" aria-label="Main navigation">
          <button class="icon-button mobile-menu-button" id="mobileMenuOpen" type="button" aria-label="Open menu" aria-haspopup="dialog" aria-controls="mobileNav" aria-expanded="false">${icon("menu")}</button>
          <a class="brand-mark" href="index.html" aria-label="Ode to Odd home">${logoSvg()}</a>
          <ul class="primary-nav">
            <li><a class="nav-link" href="${collectionUrl("new")}">New In</a></li>
            <li class="has-mega" id="shopItem"><a class="nav-link" href="${collectionUrl("shop")}" aria-haspopup="true" aria-controls="shopMenu">Shop</a>${shopMega()}</li>
            <li class="has-mega" id="collectionsItem"><a class="nav-link" href="${collectionUrl("collections")}" aria-haspopup="true" aria-controls="collectionsMenu">Collections</a>${collectionsMega()}</li>
            <li class="has-mega" id="discoverItem">
              <button class="nav-trigger" id="discoverTrigger" type="button" aria-expanded="false" aria-controls="discoverMenu">Discover</button>
              <div class="mega-menu" id="discoverMenu">
                <div class="mega-layout">
                  <div class="mega-groups">${discoverGroups()}</div>
                  <div class="mega-spots">
                    <div class="mega-spot"><img src="assets/slow-by-intention-poster.jpg" alt="Hands embroidering in the atelier"><span>Craft - counted by hand</span></div>
                    <div class="mega-spot"><img src="assets/col-1.jpg" alt="Ode to Odd campaign portrait"><span>Journal - stories in cloth</span></div>
                  </div>
                </div>
              </div>
            </li>
            <li><a class="nav-link" href="gift-card.html">Gift Card</a></li>
          </ul>
          <div class="nav-actions">
            <button class="icon-button" id="searchOpen" type="button" aria-label="Open search" aria-expanded="false">${icon("search")}</button>
            <button class="icon-button account-action" id="accountOpen" type="button" aria-label="Open account menu" aria-expanded="false">${icon("user-round")}</button>
            <button class="icon-button" id="cartOpen" type="button" aria-label="Open cart" aria-expanded="false">${icon("shopping-bag")}<span class="cart-badge" id="cartBadge">0</span></button>
            <div class="account-popover" id="accountPopover" aria-hidden="true">
              <p class="eyebrow">Your account</p>
              <button type="button" data-demo-message="Sign in is ready for the production account system.">Sign in</button>
              <button type="button" data-demo-message="Account creation is demonstrated in the production build.">Create account</button>
              <button type="button" data-demo-message="Order tracking requires a live order number.">Track an order</button>
              <button type="button" data-demo-message="Your saved pieces remain on this browser.">Wishlist</button>
              <button type="button" data-demo-message="Styling-call booking will connect to the studio calendar.">Book a styling call</button>
            </div>
          </div>
        </nav>
        <div class="search-panel" id="searchPanel" aria-hidden="true">
          <div class="search-inner">
            <div class="search-field">
              ${icon("search")}
              <input id="searchInput" type="search" placeholder="Search products and collections" aria-label="Search products and collections" autocomplete="off">
              <button class="icon-button search-clear" id="searchClear" type="button" aria-label="Clear search" hidden>${icon("circle-x")}</button>
              <button class="icon-button" id="searchClose" type="button" aria-label="Close search">${icon("x")}</button>
            </div>
            <div class="search-results">
              <div class="mobile-recent-searches" id="mobileRecentSearches" hidden><p class="eyebrow">Recent searches</p><div class="recent-search-list" id="recentSearchList"></div></div>
              <div><p class="eyebrow">What you are searching for</p><div class="search-query" id="searchQuery">Begin with a piece, edit, or category.</div></div>
              <div><p class="eyebrow" id="searchProductsTitle">Trending products</p><div class="result-list product-result-list" id="searchProducts"></div></div>
              <div><p class="eyebrow">Trending categories</p><div class="result-list" id="searchCategories"></div></div>
            </div>
          </div>
        </div>
      </header>
      <div class="backdrop" id="siteBackdrop"></div>
      <aside class="mobile-nav" id="mobileNav" role="dialog" aria-modal="true" aria-labelledby="mobileMenuTitle" aria-hidden="true">
        <div class="mobile-nav-head"><span class="eyebrow" id="mobileMenuTitle">Menu</span><a class="brand-mark" href="index.html" aria-label="Ode to Odd home">${logoSvg()}</a><button class="icon-button" id="mobileMenuClose" type="button" aria-label="Close menu">${icon("x")}</button></div>
        <div class="mobile-nav-scroll"><nav class="mobile-nav-links" aria-label="Mobile navigation">${mobileMenuMarkup()}</nav>
          <div class="mobile-menu-utilities">
            <button type="button" data-demo-message="Sign in will connect to the production account system.">${icon("user-round")} Account</button>
            <button type="button" data-demo-message="Order tracking requires a live order number.">${icon("package-search")} Track Order</button>
            <button type="button" data-demo-message="Contact: info@odetoodd.com">${icon("message-circle")} Contact</button>
            <button type="button" id="mobileCurrencyToggle">${icon("circle-dollar-sign")} <span>${state.currency} / ${state.currency === "INR" ? "USD" : "INR"}</span></button>
            <a href="https://www.instagram.com/odetoodd/" target="_blank" rel="noopener">${icon("instagram")} Instagram</a>
          </div>
        </div>
      </aside>
      <aside class="drawer" id="cartDrawer" aria-hidden="true" aria-label="Shopping cart">
        <div class="drawer-head"><h2>Your Cart</h2><button class="icon-button" id="cartClose" type="button" aria-label="Close cart">${icon("x")}</button></div>
        <div class="drawer-body" id="cartDrawerItems"></div>
        <div class="drawer-foot" id="cartDrawerFoot"></div>
      </aside>
      <aside class="saved-sheet" id="savedSheet" role="dialog" aria-modal="true" aria-labelledby="savedTitle" aria-hidden="true">
        <div class="drawer-head"><div><p class="eyebrow">Your edit</p><h2 id="savedTitle">Saved Pieces</h2></div><button class="icon-button" id="savedClose" type="button" aria-label="Close saved pieces">${icon("x")}</button></div>
        <div class="saved-sheet-body" id="savedSheetItems"></div>
      </aside>
      <div class="modal quick-view-modal" id="quickViewModal" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="quickViewTitle">
        <div class="modal-panel quick-view-panel">
          <div class="quick-view-media"><img id="quickViewImage" alt=""></div>
          <div class="quick-view-copy">
            <button class="icon-button quick-view-close" id="quickViewClose" type="button" aria-label="Close quick view">${icon("x")}</button>
            <p class="eyebrow" id="quickViewCategory"></p>
            <h2 id="quickViewTitle"></h2>
            <p class="money quick-view-price" id="quickViewPrice"></p>
            <p class="quick-view-poem" id="quickViewPoem"></p>
            <div class="quick-view-options" id="quickViewOptions"></div>
            <p class="quick-view-dispatch" id="quickViewDispatch"></p>
            <button class="button-solid" id="quickViewAdd" type="button">Select a size</button>
            <a class="text-link" id="quickViewDetails" href="product.html">View full details ${icon("arrow-up-right")}</a>
          </div>
        </div>
      </div>
      <div class="mobile-page-action" id="mobilePageAction" hidden></div>
      <nav class="mobile-bottom-nav" id="mobileBottomNav" aria-label="Mobile navigation">${mobileBottomNavMarkup()}</nav>
      <div class="toast" id="siteToast" role="status" aria-live="polite"></div>`;

    const footerMount = document.getElementById("site-footer");
    if (footerMount) {
      footerMount.innerHTML = `<div class="footer-paper-edge" aria-hidden="true"><img src="assets/newsletter-background.png" alt=""></div>
      <footer class="site-footer">
        <div class="footer-top"><img class="footer-wordmark" src="assets/footer-wordmark.png" alt="Ode to Odd"></div>
        <div class="footer-grid">
          <p class="footer-intro">Objects of quiet expression, made slowly in India and intended to gather a life of their own.</p>
          <div class="footer-col"><h3>Shop</h3><a href="${collectionUrl("new")}">New In</a><a href="${collectionUrl("dresses")}">Dresses</a><a href="${collectionUrl("co-ord-sets")}">Co-ord Sets</a><a href="${collectionUrl("jewellery")}">Jewellery</a></div>
          <div class="footer-col"><h3>Discover</h3><a href="designers-note.html">Designer's Note</a><a href="our-story.html">Our Story</a><button type="button" data-demo-message="Journal stories will become an editorial page.">Journal</button></div>
          <div class="footer-col"><h3>Care</h3><button type="button" data-demo-message="Product care information is shown on every product page.">Product Care</button><button type="button" data-demo-message="Shipping and returns will connect to the production policy page.">Shipping & Returns</button><button type="button" data-demo-message="Contact: info@odetoodd.com">Contact</button></div>
          <div class="footer-col"><h3>Currency</h3><button type="button" id="currencyToggle">${state.currency} / ${state.currency === "INR" ? "USD" : "INR"}</button><a href="https://www.instagram.com/odetoodd/" target="_blank" rel="noopener">Instagram</a><a href="gift-card.html">Gift Card</a></div>
        </div>
        <div class="footer-bottom"><span>© 2026 Ode to Odd · Poonam Apparels Inc · Crafted slowly in India</span><span>Plain HTML prototype · No live checkout</span></div>
      </footer>`;
    }
  }

  function applyReviewPreferences() {
    const params = new URLSearchParams(window.location.search);
    const theme = localStorage.getItem(STORAGE.theme) || D.SITE_CONFIG.defaultTheme;
    const font = localStorage.getItem(STORAGE.font) || D.SITE_CONFIG.defaultFont;
    const typeSize = localStorage.getItem(STORAGE.typeSize) || D.SITE_CONFIG.defaultTypeSize || "current";
    setTheme(theme);
    setFont(font);
    setTypeSize(typeSize);
    if (params.get("review") !== "1") return;

    const toolbar = document.createElement("div");
    toolbar.className = "review-toolbar";
    toolbar.setAttribute("aria-label", "Client review options");
    toolbar.innerHTML = `<label>Heading font<select id="fontReview"><option value="instrument">Instrument + Pinyon</option><option value="bodoni">Bodoni + Allura</option><option value="cormorant">Cormorant + Pinyon</option><option value="cormorant-allura">Cormorant + Allura</option></select></label>
      <label>Background<select id="themeReview"><option value="porcelain">Porcelain</option><option value="sage">Misted Sage</option><option value="white">White</option><option value="like-doen">Like Doen</option></select></label>
      <label>Font size<select id="typeSizeReview"><option value="current">Current</option><option value="medium">Medium</option><option value="smaller">Smaller</option></select></label>`;
    document.body.appendChild(toolbar);
    toolbar.querySelector("#fontReview").value = font;
    toolbar.querySelector("#themeReview").value = theme;
    toolbar.querySelector("#typeSizeReview").value = typeSize;
    toolbar.querySelector("#fontReview").addEventListener("change", (event) => setFont(event.target.value));
    toolbar.querySelector("#themeReview").addEventListener("change", (event) => setTheme(event.target.value));
    toolbar.querySelector("#typeSizeReview").addEventListener("change", (event) => setTypeSize(event.target.value));
  }

  function setTheme(theme) {
    const selected = ["porcelain", "sage", "white", "like-doen"].includes(theme) ? theme : "porcelain";
    document.documentElement.dataset.theme = selected;
    localStorage.setItem(STORAGE.theme, selected);
  }

  function setTypeSize(typeSize) {
    const selected = ["current", "medium", "smaller"].includes(typeSize) ? typeSize : "current";
    document.documentElement.dataset.typeSize = selected;
    localStorage.setItem(STORAGE.typeSize, selected);
  }

  function setFont(font) {
    const selected = ["instrument", "bodoni", "cormorant", "cormorant-allura"].includes(font) ? font : "instrument";
    document.documentElement.dataset.font = selected;
    localStorage.setItem(STORAGE.font, selected);
    if (selected === "instrument") return;
    const id = `font-${selected}`;
    if (document.getElementById(id)) return;
    const href = selected === "bodoni"
      ? "https://fonts.googleapis.com/css2?family=Allura&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;1,6..96,400&display=swap"
      : selected === "cormorant-allura"
        ? "https://fonts.googleapis.com/css2?family=Allura&family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap"
        : "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap";
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }

  function syncIcons() {
    if (window.lucide) window.lucide.createIcons({ attrs: { "aria-hidden": "true" } });
  }

  function showToast(message) {
    const toast = document.getElementById("siteToast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
  }

  function cartCount() {
    return state.cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
  }

  function cartSubtotal(currency) {
    const selected = currency || state.currency;
    return state.cart.reduce((sum, item) => {
      const unit = selected === "USD" ? Number(item.priceUSD || 0) : Number(item.priceINR || 0);
      return sum + unit * Number(item.quantity || 1);
    }, 0);
  }

  function isMobile() {
    return MOBILE_QUERY.matches;
  }

  function markMobileSurface(name) {
    if (!isMobile()) return;
    const next = Object.assign({}, history.state || {}, { otoSurface: name });
    if (history.state?.otoSurface) history.replaceState(next, "", window.location.href);
    else history.pushState(next, "", window.location.href);
  }

  function requestSurfaceClose(name, closer) {
    if (isMobile() && history.state?.otoSurface === name) history.back();
    else closer();
  }

  function syncMobileBadges() {
    const values = {
      cartBadge: cartCount(),
      mobileCartBadge: cartCount(),
      mobileSavedBadge: state.wishlist.length
    };
    Object.entries(values).forEach(([id, value]) => {
      const badge = document.getElementById(id);
      if (!badge) return;
      badge.textContent = value;
      if (badge.classList.contains("mobile-nav-badge")) badge.hidden = value === 0;
    });
  }

  function syncWishlistButtons() {
    document.querySelectorAll("[data-wishlist]").forEach((button) => {
      const active = state.wishlist.includes(button.dataset.wishlist);
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-label", active ? "Remove from wishlist" : "Add to wishlist");
    });
  }

  function renderSavedSheet() {
    const mount = document.getElementById("savedSheetItems");
    if (!mount) return;
    const products = state.wishlist.map(findProduct).filter(Boolean);
    mount.innerHTML = products.length
      ? `<div class="saved-list">${products.map((product) => `<article class="saved-line">
          <a class="saved-thumb" href="${productUrl(product.handle)}"><img src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy"></a>
          <div class="saved-line-copy"><p class="eyebrow">${escapeHtml(product.category)}</p><h3><a href="${productUrl(product.handle)}">${escapeHtml(product.name)}</a></h3><p class="money" data-inr="${product.priceINR}" data-usd="${product.priceUSD}">${formatMoney(product.priceINR, product.priceUSD)}</p><div><button class="text-link" type="button" data-quick-view="${escapeHtml(product.handle)}">Quick view</button><button class="text-link" type="button" data-wishlist="${escapeHtml(product.handle)}">Remove</button></div></div>
        </article>`).join("")}</div>`
      : `<div class="empty-state"><div><p class="eyebrow">Nothing saved yet</p><h2 class="display">Keep a piece close.</h2><p>Tap the heart on anything you would like to return to.</p><a class="button" href="${collectionUrl("shop")}">Browse the collection</a></div></div>`;
    syncWishlistButtons();
    syncMobileBadges();
    syncIcons();
  }

  function setMobilePageAction(markup) {
    const mount = document.getElementById("mobilePageAction");
    if (!mount) return;
    mount.innerHTML = markup;
    mount.hidden = false;
    document.body.classList.add("has-mobile-page-action");
    syncIcons();
  }

  function clearMobilePageAction() {
    const mount = document.getElementById("mobilePageAction");
    if (!mount) return;
    mount.innerHTML = "";
    mount.hidden = true;
    document.body.classList.remove("has-mobile-page-action");
  }

  function setMobileNavState(id, active) {
    document.querySelectorAll("[data-mobile-nav]").forEach((item) => {
      const shouldActivate = active && item.dataset.mobileNav === id;
      item.classList.toggle("is-surface-active", shouldActivate);
      if (item.tagName === "BUTTON") item.setAttribute("aria-pressed", String(shouldActivate));
    });
  }

  function itemOptions(item) {
    const parts = [];
    if (item.options) {
      Object.keys(item.options).forEach((key) => {
        if (item.options[key]) parts.push(`${key}: ${item.options[key]}`);
      });
    }
    if (item.customisation) parts.push("Custom fit");
    return parts.join(" · ");
  }

  function cartLineMarkup(item) {
    const price = formatMoney(item.priceINR, item.priceUSD);
    return `<article class="cart-line" data-cart-id="${escapeHtml(item.id)}">
      <a class="cart-thumb" href="${item.type === "gift-card" ? "gift-card.html" : productUrl(item.handle)}"><img src="${item.image}" alt="${escapeHtml(item.name)}" loading="lazy"></a>
      <div>
        <h3><a href="${item.type === "gift-card" ? "gift-card.html" : productUrl(item.handle)}">${escapeHtml(item.name)}</a></h3>
        <p class="cart-meta">${escapeHtml(itemOptions(item) || (item.type === "gift-card" ? "Digital gift card" : "Made in India"))}</p>
        <div class="cart-summary-row"><span>${price}</span>${item.customisation ? `<span class="eyebrow">+10% custom</span>` : ""}</div>
        <div class="cart-line-actions">
          <div class="quantity"><button type="button" data-cart-minus="${escapeHtml(item.id)}" aria-label="Decrease quantity">-</button><span>${item.quantity}</span><button type="button" data-cart-plus="${escapeHtml(item.id)}" aria-label="Increase quantity">+</button></div>
          <button class="remove-line" type="button" data-cart-remove="${escapeHtml(item.id)}">Remove</button>
        </div>
      </div>
    </article>`;
  }

  function renderCartDrawer() {
    const items = document.getElementById("cartDrawerItems");
    const foot = document.getElementById("cartDrawerFoot");
    syncMobileBadges();
    if (!items || !foot) return;
    if (!state.cart.length) {
      items.innerHTML = `<div class="empty-state"><div><p class="eyebrow">Your cart is quiet</p><p>Begin with a handworked piece, an object, or a note for someone you love.</p><a class="button" href="${collectionUrl("shop")}">Explore pieces</a></div></div>`;
      foot.innerHTML = "";
      return;
    }
    items.innerHTML = state.cart.map(cartLineMarkup).join("");
    foot.innerHTML = `<div class="cart-summary-row"><span class="eyebrow">Subtotal</span><strong>${formatMoney(cartSubtotal("INR"), cartSubtotal("USD"))}</strong></div><a class="button-solid" href="cart.html">View Cart</a>`;
  }

  function saveCart() {
    writeStorage(STORAGE.cart, state.cart);
    renderCartDrawer();
    renderCartPage();
    document.dispatchEvent(new CustomEvent("oto:cart-updated", { detail: state.cart }));
  }

  function addToCart(product, options) {
    const settings = options || {};
    const custom = Boolean(settings.customisation);
    const multiplier = custom ? 1.1 : 1;
    const item = {
      id: `${product.handle}-${Date.now()}`,
      type: "product",
      handle: product.handle,
      name: product.name,
      image: product.image,
      priceINR: Math.round(product.priceINR * multiplier),
      priceUSD: Math.round(product.priceUSD * multiplier),
      quantity: 1,
      options: settings.options || {},
      customisation: settings.customisation || null
    };
    state.cart.push(item);
    saveCart();
    openCart();
    showToast(`${product.name} added to your cart.`);
  }

  function addGiftCard(gift) {
    state.cart.push({
      id: `gift-card-${Date.now()}`,
      type: "gift-card",
      handle: "gift-card",
      name: "Ode to Odd E-Gift Card",
      image: "assets/beauty-imperfect-garland.png",
      priceINR: gift.amount,
      priceUSD: Math.round(gift.amount / 85),
      quantity: 1,
      options: { Recipient: gift.recipient, Delivery: gift.delivery, Design: gift.design },
      gift
    });
    saveCart();
    openCart();
    showToast("Gift card added to your cart.");
  }

  function updateCartItem(id, action) {
    const index = state.cart.findIndex((item) => item.id === id);
    if (index < 0) return;
    if (action === "remove") state.cart.splice(index, 1);
    if (action === "plus") state.cart[index].quantity += 1;
    if (action === "minus") {
      state.cart[index].quantity -= 1;
      if (state.cart[index].quantity <= 0) state.cart.splice(index, 1);
    }
    saveCart();
  }

  function closeMegaMenus(except) {
    document.querySelectorAll(".has-mega").forEach((item) => {
      if (item === except) return;
      window.clearTimeout(item.closeTimer);
      item.classList.remove("is-open");
      item.querySelector(".nav-trigger")?.setAttribute("aria-expanded", "false");
    });
  }

  function openCart() {
    closeSearch();
    closeSaved();
    closeMobileNav();
    closeAccount();
    closeMegaMenus();
    mobileSurfaceLastFocused = document.activeElement;
    document.getElementById("cartDrawer")?.classList.add("is-open");
    document.getElementById("siteBackdrop")?.classList.add("is-open");
    document.getElementById("cartDrawer")?.setAttribute("aria-hidden", "false");
    document.getElementById("cartOpen")?.setAttribute("aria-expanded", "true");
    document.body.classList.add("is-locked");
    setMobileNavState("bag", true);
    markMobileSurface("cart");
    window.setTimeout(() => document.getElementById("cartClose")?.focus(), 0);
  }

  function closeCart() {
    document.getElementById("cartDrawer")?.classList.remove("is-open");
    document.getElementById("siteBackdrop")?.classList.remove("is-open");
    document.getElementById("cartDrawer")?.setAttribute("aria-hidden", "true");
    document.getElementById("cartOpen")?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("is-locked");
    setMobileNavState("bag", false);
  }

  function openSaved() {
    closeSearch();
    closeCart();
    closeMobileNav();
    closeAccount();
    closeMegaMenus();
    mobileSurfaceLastFocused = document.activeElement;
    renderSavedSheet();
    const sheet = document.getElementById("savedSheet");
    sheet?.classList.add("is-open");
    sheet?.setAttribute("aria-hidden", "false");
    document.getElementById("siteBackdrop")?.classList.add("is-open");
    document.body.classList.add("is-locked");
    setMobileNavState("saved", true);
    markMobileSurface("saved");
    window.setTimeout(() => document.getElementById("savedClose")?.focus(), 0);
  }

  function closeSaved(restoreFocus) {
    const sheet = document.getElementById("savedSheet");
    const wasOpen = sheet?.classList.contains("is-open");
    sheet?.classList.remove("is-open");
    sheet?.setAttribute("aria-hidden", "true");
    if (!document.getElementById("cartDrawer")?.classList.contains("is-open") && !document.getElementById("mobileNav")?.classList.contains("is-open")) document.getElementById("siteBackdrop")?.classList.remove("is-open");
    if (wasOpen) document.body.classList.remove("is-locked");
    setMobileNavState("saved", false);
    if (wasOpen && restoreFocus !== false) mobileSurfaceLastFocused?.focus();
  }

  function openSearch() {
    closeCart();
    closeSaved();
    closeMobileNav();
    closeAccount();
    closeMegaMenus();
    mobileSurfaceLastFocused = document.activeElement;
    const panel = document.getElementById("searchPanel");
    panel?.classList.add("is-open");
    panel?.setAttribute("aria-hidden", "false");
    document.getElementById("searchOpen")?.setAttribute("aria-expanded", "true");
    document.getElementById("siteHeader")?.classList.add("is-solid");
    renderSearch("");
    renderRecentSearches();
    if (isMobile()) {
      document.body.classList.add("is-locked");
      setMobileNavState("search", true);
      markMobileSurface("search");
    }
    window.setTimeout(() => document.getElementById("searchInput")?.focus(), 200);
  }

  function closeSearch() {
    const panel = document.getElementById("searchPanel");
    const wasOpen = panel?.classList.contains("is-open");
    panel?.classList.remove("is-open");
    panel?.setAttribute("aria-hidden", "true");
    document.getElementById("searchOpen")?.setAttribute("aria-expanded", "false");
    if (wasOpen && isMobile()) document.body.classList.remove("is-locked");
    setMobileNavState("search", false);
    syncHeader();
  }

  function openAccount() {
    closeSearch();
    closeMegaMenus();
    const popover = document.getElementById("accountPopover");
    popover?.classList.toggle("is-open");
    const isOpen = popover?.classList.contains("is-open");
    popover?.setAttribute("aria-hidden", String(!isOpen));
    document.getElementById("accountOpen")?.setAttribute("aria-expanded", String(isOpen));
  }

  function closeAccount() {
    const popover = document.getElementById("accountPopover");
    popover?.classList.remove("is-open");
    popover?.setAttribute("aria-hidden", "true");
    document.getElementById("accountOpen")?.setAttribute("aria-expanded", "false");
  }

  function renderRecentSearches() {
    const wrap = document.getElementById("mobileRecentSearches");
    const mount = document.getElementById("recentSearchList");
    if (!wrap || !mount) return;
    const searches = readStorage(STORAGE.mobileSearches, []);
    wrap.hidden = !isMobile() || !searches.length || Boolean(document.getElementById("searchInput")?.value.trim());
    mount.innerHTML = searches.map((term) => `<button type="button" data-recent-search="${escapeHtml(term)}">${escapeHtml(term)}</button>`).join("");
  }

  function saveRecentSearch(term) {
    const clean = term.trim();
    if (!clean) return;
    const searches = readStorage(STORAGE.mobileSearches, []).filter((item) => item.toLowerCase() !== clean.toLowerCase());
    writeStorage(STORAGE.mobileSearches, [clean].concat(searches).slice(0, 6));
    renderRecentSearches();
  }

  function renderSearch(query) {
    const normalized = query.trim().toLowerCase();
    const matches = normalized
      ? D.PRODUCTS.filter((product) => `${product.name} ${product.category} ${product.collection}`.toLowerCase().includes(normalized))
      : [];
    const seed = Array.from(normalized).reduce((total, character) => total + character.charCodeAt(0), 0);
    const rotated = D.PRODUCTS.slice(seed % D.PRODUCTS.length).concat(D.PRODUCTS.slice(0, seed % D.PRODUCTS.length));
    const suggestions = matches.concat(rotated.filter((product) => !matches.includes(product)));
    const products = (normalized ? suggestions : D.PRODUCTS.filter((product) => product.bestseller)).slice(0, 4);
    const categories = D.CATEGORY_ARTWORK.filter((category) => !normalized || category.label.toLowerCase().includes(normalized)).slice(0, 5);
    const queryMount = document.getElementById("searchQuery");
    const productMount = document.getElementById("searchProducts");
    const productTitle = document.getElementById("searchProductsTitle");
    const categoryMount = document.getElementById("searchCategories");
    const clearButton = document.getElementById("searchClear");
    if (clearButton) clearButton.hidden = !query;
    renderRecentSearches();
    if (queryMount) queryMount.textContent = normalized ? `Showing ideas for “${query.trim()}”` : "Begin with a piece, edit, or category.";
    if (productTitle) productTitle.textContent = normalized ? "Suggested pieces" : "Trending products";
    if (productMount) productMount.innerHTML = products.length
      ? products.map((product) => `<a class="search-product-result" href="${productUrl(product.handle)}">
          <img src="${product.image}" alt="" loading="lazy">
          <span class="search-product-copy"><strong>${escapeHtml(product.name)}</strong><small>${escapeHtml(product.category)}</small></span>
          <span class="search-result-price">${formatMoney(product.priceINR, product.priceUSD)}</span>
        </a>`).join("")
      : "<span class=\"muted\">No matching pieces yet.</span>";
    if (categoryMount) categoryMount.innerHTML = categories.length
      ? categories.map((category) => `<a href="${collectionUrl(category.handle)}"><span>${escapeHtml(category.label)}</span><small>Explore</small></a>`).join("")
      : "<span class=\"muted\">Try another category.</span>";
  }

  function quickViewDispatch(product) {
    if (product.readyToShip) return "Ready in the studio for prompt dispatch.";
    const weeks = Math.max(1, Math.ceil(Number(product.leadTimeDays || 28) / 7));
    return `Made to order in approximately ${weeks} ${weeks === 1 ? "week" : "weeks"}.`;
  }

  function renderQuickViewOptions(product) {
    const mount = document.getElementById("quickViewOptions");
    if (!mount) return;
    if (product.sizingMode === "split") {
      quickViewSize = "";
      mount.innerHTML = `<p class="quick-view-option-note">Top and bottom sizes are selected separately on the product page.</p>`;
      return;
    }
    const sizes = product.sizes?.length ? product.sizes : ["One Size"];
    quickViewSize = product.sizingMode === "none" ? sizes[0] : "";
    mount.innerHTML = `<span class="option-label">${product.sizingMode === "none" ? "Size" : "Select size"}</span><div class="option-row">${sizes.map((size) => `<button class="option-button${quickViewSize === size ? " is-active" : ""}" type="button" data-quick-view-size="${escapeHtml(size)}">${escapeHtml(size)}</button>`).join("")}</div>`;
  }

  function syncQuickViewAdd() {
    const button = document.getElementById("quickViewAdd");
    if (!button || !quickViewProduct) return;
    if (quickViewProduct.sizingMode === "split") {
      button.disabled = false;
      button.textContent = "Choose Top & Bottom Sizes";
      return;
    }
    button.disabled = !quickViewSize;
    button.textContent = quickViewSize ? `Add to Cart · ${formatMoney(quickViewProduct.priceINR, quickViewProduct.priceUSD)}` : "Select a Size";
  }

  function openQuickView(product) {
    const modal = document.getElementById("quickViewModal");
    if (!modal) return;
    closeSearch();
    closeCart();
    closeSaved();
    closeMobileNav();
    closeAccount();
    closeMegaMenus();
    quickViewProduct = product;
    quickViewLastFocused = document.activeElement;
    const image = document.getElementById("quickViewImage");
    image.src = product.image;
    image.alt = product.name;
    document.getElementById("quickViewCategory").textContent = `${product.collection} · ${product.category}`;
    document.getElementById("quickViewTitle").textContent = product.name;
    const price = document.getElementById("quickViewPrice");
    price.dataset.inr = product.priceINR;
    price.dataset.usd = product.priceUSD;
    price.textContent = formatMoney(product.priceINR, product.priceUSD);
    document.getElementById("quickViewPoem").textContent = product.poem || "A quietly expressive piece, shaped and finished by hand.";
    document.getElementById("quickViewDispatch").textContent = quickViewDispatch(product);
    document.getElementById("quickViewDetails").href = productUrl(product.handle);
    renderQuickViewOptions(product);
    syncQuickViewAdd();
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    markMobileSurface("quick-view");
    syncIcons();
    window.setTimeout(() => document.getElementById("quickViewClose")?.focus(), 0);
  }

  function closeQuickView() {
    const modal = document.getElementById("quickViewModal");
    if (!modal?.classList.contains("is-open")) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
    quickViewProduct = null;
    quickViewSize = "";
    quickViewLastFocused?.focus();
  }

  function keepFocusInQuickView(event) {
    const modal = document.getElementById("quickViewModal");
    if (event.key !== "Tab" || !modal?.classList.contains("is-open")) return;
    const focusable = Array.from(modal.querySelectorAll("a[href], button:not(:disabled), input, select, textarea")).filter((element) => !element.hidden);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function keepFocusInMobileSurface(event) {
    if (event.key !== "Tab") return;
    const surface = [document.getElementById("mobileNav"), document.getElementById("savedSheet"), document.getElementById("cartDrawer"), document.getElementById("searchPanel")]
      .find((element) => element?.classList.contains("is-open"));
    if (!surface || (!isMobile() && surface.id === "searchPanel")) return;
    const focusable = Array.from(surface.querySelectorAll("a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex='-1'])"))
      .filter((element) => !element.hidden && element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!surface.contains(document.activeElement)) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function syncHeader() {
    const header = document.getElementById("siteHeader");
    if (!header || document.body.dataset.page !== "home") return;
    const panelOpen = document.getElementById("searchPanel")?.classList.contains("is-open") || document.getElementById("accountPopover")?.classList.contains("is-open");
    header.classList.toggle("is-solid", window.scrollY > 44 || Boolean(panelOpen));
  }

  function toggleCurrency() {
    state.currency = state.currency === "INR" ? "USD" : "INR";
    localStorage.setItem(STORAGE.currency, state.currency);
    document.querySelectorAll(".money").forEach((element) => {
      element.textContent = formatMoney(element.dataset.inr, element.dataset.usd);
    });
    const button = document.getElementById("currencyToggle");
    if (button) button.textContent = `${state.currency} / ${state.currency === "INR" ? "USD" : "INR"}`;
    const mobileButton = document.querySelector("#mobileCurrencyToggle span");
    if (mobileButton) mobileButton.textContent = `${state.currency} / ${state.currency === "INR" ? "USD" : "INR"}`;
    renderCartDrawer();
    renderSavedSheet();
    renderCartPage();
    document.dispatchEvent(new CustomEvent("oto:currency", { detail: state.currency }));
  }

  function toggleWishlist(handle) {
    const index = state.wishlist.indexOf(handle);
    if (index >= 0) state.wishlist.splice(index, 1);
    else state.wishlist.push(handle);
    writeStorage(STORAGE.wishlist, state.wishlist);
    syncWishlistButtons();
    renderSavedSheet();
    syncMobileBadges();
    showToast(index < 0 ? "Saved to your wishlist." : "Removed from your wishlist.");
    document.dispatchEvent(new CustomEvent("oto:wishlist-updated", { detail: state.wishlist }));
  }

  function bindShellEvents() {
    document.getElementById("searchOpen")?.addEventListener("click", openSearch);
    document.getElementById("searchClose")?.addEventListener("click", () => requestSurfaceClose("search", closeSearch));
    document.getElementById("searchClear")?.addEventListener("click", () => {
      const input = document.getElementById("searchInput");
      if (!input) return;
      input.value = "";
      renderSearch("");
      input.focus();
    });
    document.getElementById("searchInput")?.addEventListener("input", (event) => renderSearch(event.target.value));
    document.getElementById("searchInput")?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") saveRecentSearch(event.currentTarget.value);
    });
    document.getElementById("accountOpen")?.addEventListener("click", openAccount);
    document.getElementById("cartOpen")?.addEventListener("click", openCart);
    document.getElementById("cartClose")?.addEventListener("click", () => requestSurfaceClose("cart", closeCart));
    document.getElementById("savedClose")?.addEventListener("click", () => requestSurfaceClose("saved", closeSaved));
    document.getElementById("siteBackdrop")?.addEventListener("click", () => {
      if (isMobile() && history.state?.otoSurface) {
        history.back();
        return;
      }
      closeCart();
      closeMobileNav();
      closeSaved();
    });
    document.getElementById("currencyToggle")?.addEventListener("click", toggleCurrency);
    document.getElementById("mobileCurrencyToggle")?.addEventListener("click", toggleCurrency);
    document.getElementById("mobileMenuOpen")?.addEventListener("click", openMobileNav);
    document.getElementById("mobileMenuClose")?.addEventListener("click", () => requestSurfaceClose("menu", closeMobileNav));
    document.querySelectorAll("[data-mobile-accordion]").forEach((button) => button.addEventListener("click", () => {
      const id = button.dataset.mobileAccordion;
      const shouldOpen = button.getAttribute("aria-expanded") !== "true";
      document.querySelectorAll("[data-mobile-accordion]").forEach((trigger) => trigger.setAttribute("aria-expanded", "false"));
      document.querySelectorAll("[data-mobile-panel]").forEach((panel) => { panel.hidden = true; });
      if (!shouldOpen) return;
      button.setAttribute("aria-expanded", "true");
      const panel = document.querySelector(`[data-mobile-panel="${id}"]`);
      if (panel) panel.hidden = false;
    }));
    document.querySelectorAll("[data-mobile-action]").forEach((button) => button.addEventListener("click", () => {
      if (button.dataset.mobileAction === "search") openSearch();
      if (button.dataset.mobileAction === "saved") openSaved();
      if (button.dataset.mobileAction === "cart") openCart();
    }));
    document.getElementById("quickViewClose")?.addEventListener("click", () => requestSurfaceClose("quick-view", closeQuickView));
    document.getElementById("quickViewModal")?.addEventListener("click", (event) => {
      if (event.target === event.currentTarget) requestSurfaceClose("quick-view", closeQuickView);
      const size = event.target.closest("[data-quick-view-size]");
      if (!size || !quickViewProduct) return;
      quickViewSize = size.dataset.quickViewSize;
      document.querySelectorAll("[data-quick-view-size]").forEach((button) => button.classList.toggle("is-active", button === size));
      syncQuickViewAdd();
    });
    document.getElementById("quickViewAdd")?.addEventListener("click", () => {
      if (!quickViewProduct) return;
      if (quickViewProduct.sizingMode === "split") {
        window.location.href = productUrl(quickViewProduct.handle);
        return;
      }
      if (!quickViewSize) return;
      const product = quickViewProduct;
      const size = quickViewSize;
      closeQuickView();
      addToCart(product, { options: { Size: size } });
    });
    document.querySelectorAll(".has-mega").forEach((item) => {
      const trigger = item.querySelector(".nav-trigger");
      item.addEventListener("mouseenter", () => {
        window.clearTimeout(item.closeTimer);
        closeMegaMenus(item);
        item.classList.add("is-open");
        trigger?.setAttribute("aria-expanded", "true");
      });
      item.addEventListener("mouseleave", () => {
        item.closeTimer = window.setTimeout(() => {
          item.classList.remove("is-open");
          trigger?.setAttribute("aria-expanded", "false");
        }, 260);
      });
      trigger?.addEventListener("click", () => {
        const shouldOpen = !item.classList.contains("is-open");
        closeMegaMenus(item);
        item.classList.toggle("is-open", shouldOpen);
        trigger.setAttribute("aria-expanded", String(shouldOpen));
      });
    });
    window.addEventListener("scroll", syncHeader, { passive: true });
    document.addEventListener("click", (event) => {
      handleGlobalClick(event);
      if (!event.target.closest(".has-mega")) closeMegaMenus();
    });
    document.addEventListener("keydown", (event) => {
      keepFocusInQuickView(event);
      keepFocusInMobileSurface(event);
      if (event.key !== "Escape") return;
      if (isMobile() && history.state?.otoSurface) {
        history.back();
        return;
      }
      closeSearch();
      closeAccount();
      closeCart();
      closeMobileNav();
      closeSaved();
      closeMegaMenus();
      closeQuickView();
    });
    document.addEventListener("click", (event) => {
      const recent = event.target.closest("[data-recent-search]");
      if (!recent) return;
      const input = document.getElementById("searchInput");
      if (!input) return;
      input.value = recent.dataset.recentSearch;
      renderSearch(input.value);
      saveRecentSearch(input.value);
      input.focus();
    });
    window.addEventListener("popstate", () => {
      closeSearch();
      closeCart();
      closeMobileNav();
      closeSaved();
      closeQuickView();
    });
  }

  function handleGlobalClick(event) {
    const messageButton = event.target.closest("[data-demo-message]");
    if (messageButton) showToast(messageButton.dataset.demoMessage);

    const showcase = event.target.closest("[data-showcase]");
    if (showcase) showToast(`${showcase.dataset.showcase} is shown as a menu item in this prototype.`);

    const quickView = event.target.closest("[data-quick-view]");
    if (quickView) openQuickView(findProduct(quickView.dataset.quickView));

    const quickAdd = event.target.closest("[data-quick-add]");
    if (quickAdd) {
      const product = findProduct(quickAdd.dataset.quickAdd);
      if (product.sizingMode === "none") addToCart(product, { options: { Size: product.sizes[0] } });
      else window.location.href = productUrl(product.handle);
    }

    const wishlist = event.target.closest("[data-wishlist]");
    if (wishlist) toggleWishlist(wishlist.dataset.wishlist);

    const mobileSubmit = event.target.closest("[data-mobile-submit]");
    if (mobileSubmit?.dataset.mobileSubmit === "gift") document.getElementById("giftForm")?.requestSubmit();

    const minus = event.target.closest("[data-cart-minus]");
    if (minus) updateCartItem(minus.dataset.cartMinus, "minus");
    const plus = event.target.closest("[data-cart-plus]");
    if (plus) updateCartItem(plus.dataset.cartPlus, "plus");
    const remove = event.target.closest("[data-cart-remove]");
    if (remove) updateCartItem(remove.dataset.cartRemove, "remove");

    if (!event.target.closest("#accountPopover") && !event.target.closest("#accountOpen")) closeAccount();
  }

  function openMobileNav() {
    closeSearch();
    closeCart();
    closeSaved();
    closeAccount();
    mobileSurfaceLastFocused = document.activeElement;
    document.getElementById("mobileNav")?.classList.add("is-open");
    document.getElementById("mobileNav")?.setAttribute("aria-hidden", "false");
    document.getElementById("mobileMenuOpen")?.setAttribute("aria-expanded", "true");
    document.getElementById("siteBackdrop")?.classList.add("is-open");
    document.body.classList.add("is-locked");
    markMobileSurface("menu");
    window.setTimeout(() => document.getElementById("mobileMenuClose")?.focus(), 0);
  }

  function closeMobileNav(restoreFocus) {
    const nav = document.getElementById("mobileNav");
    const wasOpen = nav?.classList.contains("is-open");
    nav?.classList.remove("is-open");
    nav?.setAttribute("aria-hidden", "true");
    document.getElementById("mobileMenuOpen")?.setAttribute("aria-expanded", "false");
    if (!document.getElementById("cartDrawer")?.classList.contains("is-open") && !document.getElementById("savedSheet")?.classList.contains("is-open")) document.getElementById("siteBackdrop")?.classList.remove("is-open");
    if (wasOpen) document.body.classList.remove("is-locked");
    if (wasOpen && restoreFocus !== false) mobileSurfaceLastFocused?.focus();
  }

  function categoryCard(category) {
    const artwork = category.image
      ? `<div class="category-art has-photo"><img src="${category.image}" alt="${escapeHtml(category.label)}" loading="lazy"></div>`
      : `<div class="category-art tone-${category.tone}"><svg viewBox="0 0 170 260" aria-hidden="true"><path d="${category.path}"/></svg></div>`;
    return `<a class="category-card" href="${collectionUrl(category.handle)}">
      ${artwork}
      <div class="category-name"><span>${escapeHtml(category.label)}</span>${icon("arrow-up-right")}</div>
    </a>`;
  }

  function renderHome() {
    const categoryMount = document.getElementById("categoryRail");
    if (categoryMount) categoryMount.innerHTML = D.CATEGORY_ARTWORK.map(categoryCard).join("");

    const tabs = document.querySelectorAll("[data-home-tab]");
    const renderTab = (tab) => {
      const products = tab === "best"
        ? D.PRODUCTS.filter((product) => product.bestseller)
        : tab === "ready"
          ? D.PRODUCTS.filter((product) => product.readyToShip)
          : D.PRODUCTS.filter((product) => product.newArrival);
      const mount = document.getElementById("homeProductRail");
      if (mount) mount.innerHTML = products.map((product) => productCard(product)).join("");
      tabs.forEach((button) => button.classList.toggle("is-active", button.dataset.homeTab === tab));
      initReveals();
      syncIcons();
    };
    tabs.forEach((button) => button.addEventListener("click", () => renderTab(button.dataset.homeTab)));
    renderTab("new");

    const focusProducts = (D.FEATURED_FOCUS || []).map(findProduct).filter(Boolean);
    let focusIndex = 0;
    const renderFocusProduct = () => {
      const mount = document.getElementById("focusProduct");
      const product = focusProducts[focusIndex];
      if (!mount || !product) return;
      mount.innerHTML = `<a class="focus-product-link" href="${productUrl(product.handle)}">
        <img src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy">
        <div class="focus-product-info"><h3>${escapeHtml(product.name)}</h3>${product.badge === "Edition of One" ? `<div class="product-edition"><span>✢</span> Edition of one <span>✢</span></div>` : ""}<p class="money" data-inr="${product.priceINR}" data-usd="${product.priceUSD}">${formatMoney(product.priceINR, product.priceUSD)}</p></div>
      </a>`;
    };
    document.getElementById("focusPrev")?.addEventListener("click", () => {
      focusIndex = (focusIndex - 1 + focusProducts.length) % focusProducts.length;
      renderFocusProduct();
    });
    document.getElementById("focusNext")?.addEventListener("click", () => {
      focusIndex = (focusIndex + 1) % focusProducts.length;
      renderFocusProduct();
    });
    renderFocusProduct();

    const jewelleryMount = document.getElementById("jewelleryGrid");
    if (jewelleryMount) {
      const objectHandles = ["beaded-necklace", "cottage-blossom-bag", "vanilla-bloom-bag", "celestial-signet-ring", "luna-ring"];
      jewelleryMount.innerHTML = objectHandles
        .map((handle) => D.PRODUCTS.find((product) => product.handle === handle))
        .filter(Boolean)
        .map((product, index) => {
          if (index === 1) return { ...product, image: "assets/small-objects-cottage-editorial.jpg" };
          if (index === 2) return { ...product, image: product.hoverImage || product.image, hoverImage: product.image };
          return product;
        })
        .map((product) => productCard(product, { quickAdd: false }))
        .join("");
    }

    const communityTabs = document.querySelectorAll("[data-community-tab]");
    const renderCommunity = (tab) => {
      const entries = D.COMMUNITY[tab] || D.COMMUNITY.creators;
      const mount = document.getElementById("communityGrid");
      if (mount) mount.innerHTML = entries.map((entry) => `<article class="community-card reveal"><figure><img src="${entry.image}" alt="${escapeHtml(entry.name)}" loading="lazy"></figure><h3>${escapeHtml(entry.name)}</h3><p>${escapeHtml(entry.role)}</p><a class="text-link" href="${entry.product ? productUrl(entry.product) : collectionUrl(entry.handle)}">Get the look ${icon("arrow-up-right")}</a></article>`).join("");
      communityTabs.forEach((button) => button.classList.toggle("is-active", button.dataset.communityTab === tab));
      initReveals();
      syncIcons();
    };
    communityTabs.forEach((button) => button.addEventListener("click", () => renderCommunity(button.dataset.communityTab)));
    renderCommunity("creators");

    const reelsMount = document.getElementById("reelsGrid");
    if (reelsMount) {
      reelsMount.innerHTML = D.REELS.map((reel) => {
        const product = findProduct(reel.product);
        return `<article class="reel-card reveal"><a href="${productUrl(product.handle)}"><video muted loop playsinline preload="none" poster="${reel.poster}" data-autoplay-video><source src="${reel.video}" type="video/mp4"></video><h3>${escapeHtml(product.name)}</h3><div class="reel-meta"><span class="money" data-inr="${product.priceINR}" data-usd="${product.priceUSD}">${formatMoney(product.priceINR, product.priceUSD)}</span><span class="text-link">View ${icon("arrow-up-right")}</span></div></a></article>`;
      }).join("");
    }
  }

  function collectionProducts(collection) {
    let products = D.PRODUCTS.slice();
    if (collection.category) products = products.filter((product) => product.category === collection.category);
    if (collection.filter) products = products.filter((product) => Boolean(product[collection.filter]));
    const charBagh = findProduct("char-bagh-kurta-set");
    products = products.filter((product) => product.handle !== charBagh.handle);
    return [charBagh].concat(products);
  }

  function renderCollection() {
    const params = new URLSearchParams(window.location.search);
    const handle = params.get("handle") || "all";
    const collection = D.COLLECTIONS[handle] || D.COLLECTIONS.all;
    const title = document.getElementById("collectionTitle");
    const description = document.getElementById("collectionDescription");
    if (title) title.textContent = collection.title;
    if (description) description.textContent = collection.description || "Handworked clothing and objects for days that refuse to be ordinary.";
    document.title = `${collection.title} - Ode to Odd`;
    const subnav = document.getElementById("collectionSubnav");
    if (subnav) {
      const activeHandle = ["all", "shop", "new", "collections"].includes(handle) ? "all" : handle;
      const coreHandles = ["all", "dresses", "co-ord-sets", "kurta-sets", "shirts", "jewellery"];
      const visibleHandles = coreHandles.includes(activeHandle)
        ? coreHandles
        : coreHandles.slice(0, 4).concat(activeHandle, "jewellery");
      const navItems = visibleHandles.map((itemHandle) => D.COLLECTION_NAV.find((item) => item.handle === itemHandle)).filter(Boolean);
      subnav.innerHTML = `<div class="collection-subnav-track">${navItems.map((item) => `<a class="${item.handle === activeHandle ? "is-active" : ""}" href="${collectionUrl(item.handle)}"${item.handle === activeHandle ? " aria-current=\"page\"" : ""}>${escapeHtml(item.label)}</a>`).join("")}</div>`;
      const activeLink = subnav.querySelector(".is-active");
      const track = subnav.querySelector(".collection-subnav-track");
      if (activeLink && track) track.scrollLeft = Math.max(0, activeLink.offsetLeft - (track.clientWidth - activeLink.clientWidth) / 2);
    }

    const categoryFilter = document.getElementById("categoryFilter");
    const sizeFilter = document.getElementById("sizeFilter");
    const priceFilter = document.getElementById("priceFilter");
    const sortFilter = document.getElementById("sortFilter");
    const readyFilter = document.getElementById("readyFilter");
    const sampleFilter = document.getElementById("sampleFilter");
    const sampleSaleFilter = sampleFilter?.querySelector("input");
    const filterOpen = document.getElementById("filterOpen");
    const sortOpen = document.getElementById("sortOpen");
    const filterCurtain = document.getElementById("filterCurtain");
    const sortCurtain = document.getElementById("sortCurtain");
    const curtainBackdrop = document.getElementById("collectionCurtainBackdrop");
    const activeFilterCount = document.getElementById("activeFilterCount");
    const sortCurrent = document.getElementById("sortCurrent");
    const sortOptions = Array.from(document.querySelectorAll("[data-sort-value]"));
    let lastCurtainTrigger = null;
    if (sampleFilter) sampleFilter.hidden = !D.SITE_CONFIG.sampleSaleEnabled;

    const source = collectionProducts(collection);
    const closeCurtains = (restoreFocus = true) => {
      [filterCurtain, sortCurtain].forEach((curtain) => {
        curtain?.classList.remove("is-open");
        curtain?.setAttribute("aria-hidden", "true");
      });
      curtainBackdrop?.classList.remove("is-open");
      filterOpen?.setAttribute("aria-expanded", "false");
      sortOpen?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("is-locked");
      if (restoreFocus && lastCurtainTrigger) lastCurtainTrigger.focus();
      lastCurtainTrigger = null;
    };
    const openCurtain = (curtain, trigger) => {
      closeCurtains(false);
      lastCurtainTrigger = trigger;
      curtain?.classList.add("is-open");
      curtain?.setAttribute("aria-hidden", "false");
      curtainBackdrop?.classList.add("is-open");
      trigger?.setAttribute("aria-expanded", "true");
      document.body.classList.add("is-locked");
      markMobileSurface(curtain === filterCurtain ? "filter" : "sort");
      window.setTimeout(() => curtain?.querySelector("button")?.focus(), 80);
    };
    const syncControls = () => {
      const activeCount = [categoryFilter?.value, sizeFilter?.value, priceFilter?.value].filter(Boolean).length
        + Number(Boolean(readyFilter?.checked))
        + Number(Boolean(D.SITE_CONFIG.sampleSaleEnabled && sampleSaleFilter?.checked));
      if (activeFilterCount) {
        activeFilterCount.textContent = String(activeCount);
        activeFilterCount.hidden = activeCount === 0;
      }
      const activeSort = sortOptions.find((option) => option.dataset.sortValue === sortFilter?.value) || sortOptions[0];
      sortOptions.forEach((option) => {
        const isActive = option === activeSort;
        option.classList.toggle("is-active", isActive);
        option.setAttribute("aria-checked", String(isActive));
      });
      if (sortCurrent && activeSort) sortCurrent.textContent = activeSort.querySelector("span")?.textContent || "Featured";
    };
    const render = () => {
      let products = source.slice();
      if (categoryFilter?.value) products = products.filter((product) => product.category === categoryFilter.value);
      if (sizeFilter?.value) products = products.filter((product) => product.sizes?.includes(sizeFilter.value));
      if (priceFilter?.value === "under-25000") products = products.filter((product) => product.priceINR < 25000);
      if (priceFilter?.value === "25000-50000") products = products.filter((product) => product.priceINR >= 25000 && product.priceINR <= 50000);
      if (priceFilter?.value === "over-50000") products = products.filter((product) => product.priceINR > 50000);
      if (readyFilter?.checked) products = products.filter((product) => product.readyToShip);
      if (D.SITE_CONFIG.sampleSaleEnabled && sampleSaleFilter?.checked) products = products.filter((product) => product.sampleSale);
      if (sortFilter?.value === "price-low") products.sort((a, b) => a.priceINR - b.priceINR);
      if (sortFilter?.value === "price-high") products.sort((a, b) => b.priceINR - a.priceINR);
      if (sortFilter?.value === "name") products.sort((a, b) => a.name.localeCompare(b.name));
      const mount = document.getElementById("collectionGrid");
      const count = document.getElementById("collectionCount");
      if (count) count.innerHTML = `<span class="collection-count-number">${products.length}</span><span class="collection-count-label"> ${products.length === 1 ? "piece" : "pieces"}</span>`;
      if (mount) mount.innerHTML = products.length ? products.map((product) => productCard(product)).join("") : `<div class="no-results"><p class="eyebrow">No pieces found</p><h2 class="display">Try another filter</h2></div>`;
      syncControls();
      initReveals();
      syncIcons();
    };
    [categoryFilter, sizeFilter, priceFilter, sortFilter, readyFilter, sampleSaleFilter].forEach((control) => control?.addEventListener("change", render));
    filterOpen?.addEventListener("click", () => openCurtain(filterCurtain, filterOpen));
    sortOpen?.addEventListener("click", () => openCurtain(sortCurtain, sortOpen));
    document.getElementById("filterClose")?.addEventListener("click", () => requestSurfaceClose("filter", closeCurtains));
    document.getElementById("sortClose")?.addEventListener("click", () => requestSurfaceClose("sort", closeCurtains));
    document.getElementById("filterApply")?.addEventListener("click", () => requestSurfaceClose("filter", closeCurtains));
    document.getElementById("filterReset")?.addEventListener("click", () => {
      [categoryFilter, sizeFilter, priceFilter].forEach((control) => { if (control) control.value = ""; });
      if (readyFilter) readyFilter.checked = false;
      if (sampleSaleFilter) sampleSaleFilter.checked = false;
      render();
    });
    sortOptions.forEach((option) => option.addEventListener("click", () => {
      if (sortFilter) sortFilter.value = option.dataset.sortValue;
      render();
      requestSurfaceClose("sort", closeCurtains);
    }));
    curtainBackdrop?.addEventListener("click", () => requestSurfaceClose(history.state?.otoSurface || "filter", closeCurtains));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && (filterCurtain?.classList.contains("is-open") || sortCurtain?.classList.contains("is-open"))) requestSurfaceClose(history.state?.otoSurface || "filter", closeCurtains);
    });
    window.addEventListener("popstate", () => closeCurtains(false));
    render();
  }

  function renderGiftCard() {
    const form = document.getElementById("giftForm");
    if (!form) return;
    const preview = document.getElementById("giftPreview");
    const previewMessage = document.getElementById("giftPreviewMessage");
    const previewAmount = document.getElementById("giftPreviewAmount");
    const amountInput = document.getElementById("giftAmount");
    const message = document.getElementById("giftMessage");
    const recipient = document.getElementById("giftRecipient");
    const delivery = document.getElementById("giftDelivery");
    let design = "garden";

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const earliest = tomorrow.toISOString().slice(0, 10);
    delivery.min = earliest;
    if (!delivery.value) delivery.value = earliest;

    const update = () => {
      const amount = Math.max(1, Number(amountInput.value || 5000));
      preview.dataset.design = design;
      previewMessage.textContent = message.value.trim() || "For something beautifully, entirely your own.";
      previewAmount.textContent = `\u20B9 ${amount.toLocaleString("en-IN")}`;
      document.querySelectorAll("[data-gift-gallery-design]").forEach((element) => { element.dataset.giftGalleryDesign = design; });
      const galleryAmount = document.getElementById("giftGalleryAmount");
      const galleryRecipient = document.getElementById("giftGalleryRecipient");
      const galleryMessage = document.getElementById("giftGalleryMessage");
      if (galleryAmount) galleryAmount.textContent = `\u20B9 ${amount.toLocaleString("en-IN")}`;
      if (galleryRecipient) galleryRecipient.textContent = recipient.value.trim() || "Someone special";
      if (galleryMessage) galleryMessage.textContent = message.value.trim() || "For something beautifully, entirely your own.";
      setMobilePageAction(`<div class="mobile-action-summary"><span>Gift card</span><strong>\u20B9 ${amount.toLocaleString("en-IN")}</strong></div><button class="button-solid" type="button" data-mobile-submit="gift">Personalise & Add</button>`);
    };

    document.querySelectorAll("[data-gift-design]").forEach((button) => button.addEventListener("click", () => {
      design = button.dataset.giftDesign;
      document.querySelectorAll("[data-gift-design]").forEach((item) => item.classList.toggle("is-active", item === button));
      update();
    }));
    document.querySelectorAll("[data-gift-amount]").forEach((button) => button.addEventListener("click", () => {
      amountInput.value = button.dataset.giftAmount;
      document.querySelectorAll("[data-gift-amount]").forEach((item) => item.classList.toggle("is-active", item === button));
      update();
    }));
    [amountInput, message, recipient].forEach((control) => control.addEventListener("input", update));
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      addGiftCard({
        amount: Number(amountInput.value),
        currency: "INR",
        design,
        recipient: document.getElementById("giftRecipient").value,
        email: document.getElementById("giftEmail").value,
        sender: document.getElementById("giftSender").value,
        message: message.value,
        delivery: delivery.value
      });
    });
    update();
  }

  function renderCartPage() {
    if (document.body.dataset.page !== "cart") return;
    const mount = document.getElementById("cartPageItems");
    const summary = document.getElementById("cartPageSummary");
    const count = document.getElementById("cartPageCount");
    if (!mount || !summary) return;
    if (count) count.textContent = `${cartCount()} ${cartCount() === 1 ? "item" : "items"}`;
    if (!state.cart.length) {
      mount.innerHTML = `<div class="empty-state"><div><p class="eyebrow">Your cart is quiet</p><h2 class="display">There is room for a story.</h2><p>Explore handworked pieces and small objects from the studio.</p><a class="button" href="${collectionUrl("shop")}">Shop all</a></div></div>`;
      summary.innerHTML = `<h2>Summary</h2><p class="muted">Your order details will appear here.</p>`;
      clearMobilePageAction();
      return;
    }
    mount.innerHTML = state.cart.map(cartLineMarkup).join("");
    const subtotal = formatMoney(cartSubtotal("INR"), cartSubtotal("USD"));
    summary.innerHTML = `<h2>Summary</h2><div class="cart-summary-row"><span>Subtotal</span><span>${subtotal}</span></div><div class="cart-summary-row"><span>Shipping</span><span>Calculated later</span></div><div class="cart-summary-row total"><span>Total</span><strong>${subtotal}</strong></div><button class="button-solid" type="button" data-demo-message="Checkout is intentionally disabled in this static prototype.">Proceed to Checkout</button><p class="prototype-note">Prototype only. No payment or order will be created.</p>`;
    setMobilePageAction(`<div class="mobile-action-summary"><span>Subtotal</span><strong>${subtotal}</strong></div><button class="button-solid" type="button" data-demo-message="Checkout is intentionally disabled in this static prototype.">Checkout</button>`);
  }

  function renderEditorialPage() {
    const mount = document.getElementById("editorialMount");
    if (!mount) return;
    const handle = document.body.dataset.editorial || "our-story";
    const page = D.EDITORIAL_PAGES[handle] || D.EDITORIAL_PAGES["our-story"];
    document.title = `${page.title} - Ode to Odd`;
    if (page.panels) {
      mount.innerHTML = `<header class="editorial-hero reveal"><p class="eyebrow">${escapeHtml(page.eyebrow)}</p><h1 class="display">Our <em>Story</em></h1><p>${escapeHtml(page.intro)}</p><div class="stitch-motif" aria-hidden="true"><span>×</span><span>×</span><span>×</span><span>×</span><span>×</span></div></header>
        <section class="story-panels shell" aria-label="The Ode to Odd story">${page.panels.map((panel, index) => `<figure class="story-panel reveal"><img src="${panel.image}" alt="${escapeHtml(panel.alt)}" ${index ? "loading=\"lazy\"" : "fetchpriority=\"high\""}></figure>`).join("")}</section>
        <section class="editorial-next reveal"><p class="script">from the studio</p><h2 class="display">Beauty lives in the <em>particular</em>.</h2><a class="button" href="designers-note.html">Read the designer's note</a></section>`;
      return;
    }
    mount.innerHTML = `<section class="designer-note-layout">
      <div class="designer-note-portrait reveal"><img src="${page.portrait}" alt="${escapeHtml(page.portraitAlt)}" fetchpriority="high"></div>
      <article class="designer-note-letter reveal"><p class="eyebrow">${escapeHtml(page.eyebrow)}</p><h1 class="display">Designer's <em>Note</em></h1>${page.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}<p class="designer-signoff">${escapeHtml(page.signoff).replace(/\n/g, "<br>")}</p></article>
    </section>
    <div class="editorial-garland reveal"><img src="assets/beauty-imperfect-garland.png" alt="" aria-hidden="true"></div>
    <section class="editorial-next reveal"><p class="script">cross by cross</p><h2 class="display">Follow the story to <em>its roots</em>.</h2><a class="button" href="our-story.html">Our story</a></section>`;
  }

  function initReveals() {
    const elements = document.querySelectorAll(".reveal:not([data-reveal-bound])");
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
    elements.forEach((element) => {
      element.dataset.revealBound = "true";
      observer.observe(element);
    });
  }

  function initVideos() {
    const videos = document.querySelectorAll("[data-autoplay-video]");
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.play().catch(() => {});
        else entry.target.pause();
      });
    }, { threshold: 0.35 });
    videos.forEach((video) => observer.observe(video));
  }

  function initPage() {
    injectSiteShell();
    applyReviewPreferences();
    bindShellEvents();
    renderCartDrawer();
    renderSavedSheet();
    syncWishlistButtons();
    syncMobileBadges();
    renderSearch("");
    if (document.body.dataset.page === "home") renderHome();
    if (document.body.dataset.page === "collection") renderCollection();
    if (document.body.dataset.page === "gift-card") renderGiftCard();
    if (document.body.dataset.page === "cart") renderCartPage();
    if (document.body.dataset.page === "editorial") renderEditorialPage();
    document.querySelector(".newsletter form")?.addEventListener("submit", (event) => {
      event.preventDefault();
      showToast("Thank you. A quiet letter will find you soon.");
      event.target.reset();
    });
    syncIcons();
    syncHeader();
    initReveals();
    initVideos();
  }

  D.ui = {
    state,
    formatMoney,
    findProduct,
    productCard,
    productUrl,
    collectionUrl,
    addToCart,
    addGiftCard,
    openCart,
    closeCart,
    openSaved,
    closeSaved,
    setMobilePageAction,
    clearMobilePageAction,
    markMobileSurface,
    requestSurfaceClose,
    showToast,
    syncIcons,
    initReveals,
    initVideos,
    getCurrency: () => state.currency,
    getCart: () => state.cart,
    getRecent: () => readStorage(STORAGE.recent, []),
    setRecent: (recent) => writeStorage(STORAGE.recent, recent)
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initPage);
  else initPage();
})();
