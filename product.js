(function () {
  const D = window.OTO;
  let product;
  let selected = {};
  let lastFocused = null;

  const SIZE_DATA = {
    in: {
      label: "Inches",
      sizes: ["XS | EU 34 | UK 8", "S | EU 36 | UK 10", "M | EU 38 | UK 12", "L | EU 40 | UK 14", "XL | EU 42 | UK 16", "XXL | EU 44 | UK 18"],
      rows: [
        ["Bust", "32", "34", "36", "38", "40", "42"],
        ["Waist", "25", "26.5", "28.5", "30.5", "32.5", "34.5"],
        ["Hips", "35", "36.5", "38.5", "40.5", "42.5", "44.5"]
      ]
    },
    cm: {
      label: "Centimetres",
      sizes: ["XS | EU 34 | UK 8", "S | EU 36 | UK 10", "M | EU 38 | UK 12", "L | EU 40 | UK 14", "XL | EU 42 | UK 16", "XXL | EU 44 | UK 18"],
      rows: [
        ["Bust", "81", "86", "91", "96.5", "102", "107"],
        ["Waist", "63.5", "67", "72", "77", "82.5", "88"],
        ["Hips", "89", "92", "98", "103", "108", "113"]
      ]
    }
  };

  function renderGallery() {
    const gallery = product.gallery?.length ? product.gallery : [product.image, product.hoverImage].filter(Boolean);
    const mount = document.getElementById("pdpGallery");
    mount.classList.toggle("two-images", gallery.length <= 2);
    mount.innerHTML = gallery.map((image, index) => `<figure class="pdp-media"><img src="${image}" alt="${product.name}${index ? ` detail ${index + 1}` : ""}" ${index ? "loading=\"lazy\"" : "fetchpriority=\"high\""}></figure>`).join("");
    document.getElementById("pdpGalleryDots")?.remove();
    mount.insertAdjacentHTML("afterend", `<div class="pdp-gallery-dots" id="pdpGalleryDots" aria-label="Product gallery pages">${gallery.map((image, index) => `<button class="${index === 0 ? "is-active" : ""}" type="button" data-gallery-page="${index}" aria-label="View image ${index + 1}"${index === 0 ? " aria-current=\"true\"" : ""}></button>`).join("")}</div>`);
    let frame = 0;
    mount.addEventListener("scroll", () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const index = Math.max(0, Math.min(gallery.length - 1, Math.round(mount.scrollLeft / Math.max(1, mount.clientWidth))));
        document.querySelectorAll("[data-gallery-page]").forEach((dot) => {
          const active = Number(dot.dataset.galleryPage) === index;
          dot.classList.toggle("is-active", active);
          if (active) dot.setAttribute("aria-current", "true");
          else dot.removeAttribute("aria-current");
        });
      });
    }, { passive: true });
    document.getElementById("pdpGalleryDots")?.addEventListener("click", (event) => {
      const dot = event.target.closest("[data-gallery-page]");
      if (!dot) return;
      mount.scrollTo({ left: Number(dot.dataset.galleryPage) * mount.clientWidth, behavior: "smooth" });
    });
  }

  function renderDetails() {
    document.title = `${product.name} - Ode to Odd`;
    document.getElementById("pdpBreadcrumbs").innerHTML = `<a href="index.html">Home</a> · <a href="collection.html?handle=shop">${product.collection}</a> · ${product.category}`;
    document.getElementById("pdpTitle").textContent = product.name;
    const price = document.getElementById("pdpPrice");
    price.dataset.inr = product.priceINR;
    price.dataset.usd = product.priceUSD;
    price.textContent = D.ui.formatMoney(product.priceINR, product.priceUSD);
    document.getElementById("pdpPoem").textContent = `“${product.poem || "A handworked piece with its own quiet rhythm."}”`;
    renderDispatch();
    renderUsps();
    renderOptions();
    renderAccordions();
    updateAddButton();
  }

  function addDays(date, days, businessOnly) {
    const next = new Date(date);
    let remaining = days;
    while (remaining > 0) {
      next.setDate(next.getDate() + 1);
      if (!businessOnly || ![0, 6].includes(next.getDay())) remaining -= 1;
    }
    return next;
  }

  function renderDispatch() {
    const date = addDays(new Date(), product.readyToShip ? 1 : product.leadTimeDays || 28, Boolean(product.readyToShip));
    const formatted = date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    const copy = product.readyToShip
      ? `Ready in the studio · place your order now for dispatch by ${formatted}`
      : `Made to order · estimated dispatch by ${formatted}`;
    document.querySelector("#dispatchNote span").textContent = copy;
  }

  function renderUsps() {
    const isCharBagh = product.handle === "char-bagh-kurta-set";
    const isJewellery = product.category === "Jewellery";
    const usps = isCharBagh
      ? [
          ["sparkles", "90 hours of handwork", "Fine bugle beads placed one by one."],
          ["waves", "Handwoven mulberry silk", "A luminous, naturally elegant foundation."],
          ["layers-3", "Bemberg silk lining", "Finished for a soft, easy drape."],
          ["calendar-clock", "Made to order", "Cut and finished for you in 4-5 weeks."]
        ]
      : isJewellery
        ? [
            ["gem", "Made by hand", "Subtle variations make every object individual."],
            ["shield-check", "Nickel conscious", "Designed for considered, occasional wear."],
            ["package-check", "Ready to ship", "Currently resting in the studio."],
            ["refresh-cw", "Re-plating support", "The atelier can help renew plated pieces."]
          ]
        : [
            ["hand", "Handworked", "Built slowly by skilled hands in India."],
            ["waves", "Natural textile", "A foundation with character and movement."],
            ["scissors", "Small batch", "Cut and finished in limited numbers."],
            ["calendar-clock", product.readyToShip ? "Ready to ship" : "Made to order", product.readyToShip ? "Available for prompt dispatch." : "Please allow time for considered making."]
          ];
    document.getElementById("pdpUsps").innerHTML = usps.map(([icon, title, copy]) => `<article class="usp"><i data-lucide="${icon}" aria-hidden="true"></i><h3>${title}</h3><p>${copy}</p></article>`).join("");
  }

  function optionButtons(name, values) {
    return `<div class="option-row" data-option-group="${name}">${values.map((value) => `<button class="option-button${selected[name] === value ? " is-active" : ""}" type="button" data-option-name="${name}" data-option-value="${value}">${value}</button>`).join("")}</div>`;
  }

  function renderOptions() {
    const mount = document.getElementById("productOptions");
    selected = {};
    const blocks = [];
    const guide = `<button class="text-link" id="sizeGuideOpen" type="button">View size guide</button>`;

    if (product.sizingMode === "none") {
      selected.Size = product.sizes?.[0] || "One Size";
      blocks.push(`<div class="option-block"><div class="option-head"><span class="option-label">Size</span></div>${optionButtons("Size", [selected.Size])}</div>`);
    } else if (product.sizingMode === "split") {
      blocks.push(`<div class="option-block"><div class="option-head"><span class="option-label">Select top size</span>${guide}</div>${optionButtons("Top size", product.sizes)}</div>`);
      blocks.push(`<div class="option-block"><div class="option-head"><span class="option-label">Select bottom size</span></div>${optionButtons("Bottom size", product.sizes)}</div>`);
      if (product.customisable) blocks.push(`<div class="option-block option-block-custom"><div class="option-head"><span class="option-label">Made to measure</span></div>${optionButtons("Customisation", ["Custom"])}</div>`);
    } else {
      const sizes = product.customisable ? product.sizes.concat("Custom") : product.sizes;
      blocks.push(`<div class="option-block"><div class="option-head"><span class="option-label">Select size</span>${guide}</div>${optionButtons("Size", sizes)}</div>`);
    }
    mount.innerHTML = blocks.join("");
    mount.querySelectorAll("[data-option-name]").forEach((button) => button.addEventListener("click", () => selectOption(button)));
    document.getElementById("sizeGuideOpen")?.addEventListener("click", openSizeGuide);
    if (product.sizingMode === "none") {
      mount.querySelector("[data-option-name]")?.classList.add("is-active");
    }
  }

  function selectOption(button) {
    const name = button.dataset.optionName;
    if (button.dataset.optionValue === "Custom") {
      openCustomDrawer();
      return;
    }
    selected[name] = button.dataset.optionValue;
    document.querySelectorAll(`[data-option-name="${name}"]`).forEach((item) => item.classList.toggle("is-active", item === button));
    if (name === "Size" || name === "Top size") {
      const base = document.getElementById("customBaseSize");
      const value = button.dataset.optionValue.split("-")[0];
      if (base && [...base.options].some((option) => option.value === value)) base.value = value;
    }
    updateAddButton();
  }

  function requiredOptionsSelected() {
    if (product.sizingMode === "split") return Boolean(selected["Top size"] && selected["Bottom size"]);
    return product.sizingMode === "none" || Boolean(selected.Size);
  }

  function updateAddButton() {
    const button = document.getElementById("addProduct");
    const ready = requiredOptionsSelected();
    button.disabled = !ready;
    button.textContent = ready ? `Add to Cart · ${D.ui.formatMoney(product.priceINR, product.priceUSD)}` : "Select options";
    const selection = Object.values(selected).filter(Boolean).join(" · ") || "Select size";
    D.ui.setMobilePageAction(`<div class="mobile-action-summary"><span>${selection}</span><strong>${D.ui.formatMoney(product.priceINR, product.priceUSD)}</strong></div><button class="button-solid" id="mobileAddProduct" type="button">${ready ? "Add to Bag" : "Choose Options"}</button>`);
    document.getElementById("mobileAddProduct")?.addEventListener("click", () => {
      if (!requiredOptionsSelected()) {
        document.getElementById("productOptions")?.scrollIntoView({ behavior: "smooth", block: "center" });
        document.querySelector("#productOptions button")?.focus({ preventScroll: true });
        return;
      }
      button.click();
    });
    const customSubmit = document.getElementById("customSubmit");
    if (customSubmit) customSubmit.textContent = `Add Custom Piece · ${D.ui.formatMoney(Math.round(product.priceINR * 1.1), Math.round(product.priceUSD * 1.1))}`;
  }

  function renderAccordions() {
    const entries = [
      ["Description", product.description || `A quietly expressive ${product.category.toLowerCase()} shaped in natural textiles and finished by hand.`],
      ["Craft & Fabric", product.craft || "Made in India using natural textiles, hand embroidery, and small-batch finishing."],
      ["Size & Fit", product.fit || (product.sizingMode === "grouped" ? "A relaxed silhouette offered in flexible grouped sizing." : "Designed true to size. Use the size guide or choose custom measurements for an individual fit.")],
      ["Care & Shipping", product.care || `${product.readyToShip ? "Ready for prompt dispatch." : "Made to order in approximately 4-5 weeks."} Professional dry clean recommended.`]
    ];
    document.getElementById("productAccordions").innerHTML = entries.map(([title, copy], index) => `<article class="accordion-item${index === 0 ? " is-open" : ""}"><button class="accordion-trigger" type="button" aria-expanded="${index === 0}"><span>${title}</span><i data-lucide="plus" aria-hidden="true"></i></button><div class="accordion-content"><p>${copy}</p></div></article>`).join("");
    document.querySelectorAll(".accordion-trigger").forEach((button) => button.addEventListener("click", () => {
      const item = button.closest(".accordion-item");
      item.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(item.classList.contains("is-open")));
    }));
  }

  function renderRecommendations() {
    const uniqueProducts = (items, limit) => {
      const seen = new Set([product.handle]);
      return items.filter((item) => {
        if (!item || seen.has(item.handle)) return false;
        seen.add(item.handle);
        return true;
      }).slice(0, limit);
    };
    const relatedSeed = (product.related || []).map((handle) => D.PRODUCTS.find((item) => item.handle === handle))
      .concat(D.PRODUCTS.filter((item) => item.category === product.category))
      .concat(D.PRODUCTS.filter((item) => item.collection === product.collection))
      .concat(D.PRODUCTS);
    const related = uniqueProducts(relatedSeed, 8);
    document.getElementById("recommendationRail").innerHTML = related.map((item) => D.ui.productCard(item)).join("");

    const recentHandles = D.ui.getRecent().filter((handle) => handle !== product.handle);
    const recentSeed = recentHandles.map((handle) => D.PRODUCTS.find((item) => item.handle === handle))
      .concat(D.PRODUCTS.filter((item) => item.category === product.category))
      .concat(D.PRODUCTS);
    const recent = uniqueProducts(recentSeed, 8);
    document.getElementById("recentRail").innerHTML = recent.map((item) => D.ui.productCard(item)).join("");

    const nextRecent = [product.handle].concat(recentHandles).slice(0, 8);
    D.ui.setRecent(nextRecent);
    D.ui.initReveals();
  }

  function renderSizeTable(unit) {
    const data = SIZE_DATA[unit];
    document.getElementById("sizeTableWrap").innerHTML = `<table class="size-table"><caption class="sr-only">Size guide in ${data.label}</caption><thead><tr><th scope="col">Measurement</th>${data.sizes.map((size) => `<th scope="col">${size}</th>`).join("")}</tr></thead><tbody>${data.rows.map((row) => `<tr><th scope="row">${row[0]}</th>${row.slice(1).map((value) => `<td>${value}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
    document.querySelectorAll("[data-measure-unit]").forEach((button) => button.classList.toggle("is-active", button.dataset.measureUnit === unit));
  }

  function openSizeGuide() {
    lastFocused = document.activeElement;
    renderSizeTable("in");
    const modal = document.getElementById("sizeGuideModal");
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    D.ui.markMobileSurface("size-guide");
    window.setTimeout(() => document.getElementById("sizeGuideClose").focus(), 0);
  }

  function closeSizeGuide() {
    const modal = document.getElementById("sizeGuideModal");
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
    lastFocused?.focus();
  }

  function openCustomDrawer() {
    if (!product.customisable) return;
    lastFocused = document.activeElement;
    const drawer = document.getElementById("customDrawer");
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.getElementById("customBackdrop").classList.add("is-open");
    document.body.classList.add("is-locked");
    D.ui.markMobileSurface("customisation");
    window.setTimeout(() => document.getElementById("customName").focus(), 0);
  }

  function closeCustomDrawer() {
    const drawer = document.getElementById("customDrawer");
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.getElementById("customBackdrop").classList.remove("is-open");
    document.body.classList.remove("is-locked");
    lastFocused?.focus();
  }

  function keepFocusInside(event, container) {
    if (event.key !== "Tab") return;
    const focusable = Array.from(container.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'))
      .filter((element) => element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!container.contains(document.activeElement)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  async function shareProduct() {
    const share = { title: product.name, text: `Discover ${product.name} by Ode to Odd.`, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(share);
      else {
        await navigator.clipboard.writeText(window.location.href);
        D.ui.showToast("Product link copied.");
      }
    } catch (error) {
      if (error.name !== "AbortError") D.ui.showToast("The product link is ready in your address bar.");
    }
  }

  function submitCustomisation(event) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const formData = Object.fromEntries(new FormData(event.currentTarget).entries());
    closeCustomDrawer();
    D.ui.addToCart(product, {
      options: { Size: formData.baseSize, Fit: "Custom" },
      customisation: formData
    });
    event.currentTarget.reset();
  }

  function bindEvents() {
    document.getElementById("addProduct").addEventListener("click", () => {
      if (!requiredOptionsSelected()) return;
      D.ui.addToCart(product, { options: Object.assign({}, selected) });
    });
    document.getElementById("customClose").addEventListener("click", () => D.ui.requestSurfaceClose("customisation", closeCustomDrawer));
    document.getElementById("customBackdrop").addEventListener("click", () => D.ui.requestSurfaceClose("customisation", closeCustomDrawer));
    document.getElementById("customForm").addEventListener("submit", submitCustomisation);
    document.getElementById("sizeGuideClose").addEventListener("click", () => D.ui.requestSurfaceClose("size-guide", closeSizeGuide));
    document.getElementById("sizeGuideModal").addEventListener("click", (event) => {
      if (event.target === event.currentTarget) D.ui.requestSurfaceClose("size-guide", closeSizeGuide);
    });
    document.querySelectorAll("[data-measure-unit]").forEach((button) => button.addEventListener("click", () => renderSizeTable(button.dataset.measureUnit)));
    document.getElementById("shareProduct").addEventListener("click", shareProduct);
    document.addEventListener("oto:currency", updateAddButton);
    document.addEventListener("keydown", (event) => {
      const sizeGuide = document.getElementById("sizeGuideModal");
      const customDrawer = document.getElementById("customDrawer");
      const openDialog = customDrawer.classList.contains("is-open") ? customDrawer : sizeGuide.classList.contains("is-open") ? sizeGuide : null;
      if (!openDialog) return;
      if (event.key === "Escape") {
        if (openDialog === customDrawer) D.ui.requestSurfaceClose("customisation", closeCustomDrawer);
        else D.ui.requestSurfaceClose("size-guide", closeSizeGuide);
        return;
      }
      keepFocusInside(event, openDialog);
    });
    window.addEventListener("popstate", () => {
      closeCustomDrawer();
      closeSizeGuide();
    });
  }

  function init() {
    const handle = new URLSearchParams(window.location.search).get("handle") || "char-bagh-kurta-set";
    product = D.ui.findProduct(handle);
    renderGallery();
    renderDetails();
    renderRecommendations();
    renderSizeTable("in");
    bindEvents();
    D.ui.syncIcons();
    D.ui.initReveals();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
