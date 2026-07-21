(function () {
  const STANDARD_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
  const GROUPED_SIZES = ["XS-S", "M-L", "XL-XXL", "XXXL"];
  const LENGTHS = ["Standard", "Shorten", "Lengthen", "Custom"];

  const PRODUCTS = [
    {
      handle: "char-bagh-kurta-set",
      name: "Char Bagh Kurta Set",
      category: "Kurta Sets",
      collection: "Ode to India",
      priceINR: 59500,
      priceUSD: 700,
      badge: "Edition of One",
      image: "assets/product-char-bagh-kurta-set.jpg",
      hoverImage: "assets/product-char-bagh-kurta-set-detail.jpg",
      gallery: [
        "assets/char-bagh-01.jpg",
        "assets/char-bagh-02.jpg",
        "assets/char-bagh-03.jpg",
        "assets/char-bagh-04.jpg",
        "assets/char-bagh-05.jpg",
        "assets/char-bagh-06.jpg",
        "assets/char-bagh-07.jpg",
        "assets/char-bagh-08.jpg",
        "assets/char-bagh-09.jpg"
      ],
      sizingMode: "standard",
      sizes: STANDARD_SIZES,
      lengthOptions: LENGTHS,
      readyToShip: false,
      leadTimeDays: 28,
      customisable: true,
      newArrival: true,
      bestseller: true,
      featuredEverywhere: true,
      poem: "A silk bib kurta set where cross stitch meets bugle-bead light.",
      description: "A hand-embroidered silk kurta set shaped for ceremonial ease. Fine bugle beads reinterpret cross stitch across the bib while the straight silhouette and fluid trousers keep the piece quietly modern.",
      craft: "Handwoven mulberry silk with a Bemberg silk lining. The embroidered bib requires approximately 90 hours of handwork.",
      fit: "True to size with a long, straight silhouette. The model is 5'5\" and wears size S.",
      care: "Professional dry clean only. Store flat in a muslin cover and avoid direct steam on the hand-beaded surface.",
      related: ["pakeezah-kurta-set", "aprajita-odhani", "phulwari-set"]
    },
    {
      handle: "pakeezah-kurta-set",
      name: "Pakeezah Kurta Set",
      category: "Kurta Sets",
      collection: "Ode to India",
      priceINR: 59500,
      priceUSD: 700,
      badge: "Edition of One",
      image: "assets/product-pakeezah-kurta-set.jpg",
      hoverImage: "assets/product-pakeezah-kurta-set-detail.jpg",
      sizingMode: "standard",
      sizes: STANDARD_SIZES,
      lengthOptions: LENGTHS,
      leadTimeDays: 28,
      customisable: true,
      newArrival: true,
      bestseller: true,
      poem: "A garden worked patiently into silk.",
      related: ["char-bagh-kurta-set", "aprajita-odhani", "sunhari-kurta-set"]
    },
    {
      handle: "tarini-kurta-set",
      name: "Tarini Kurta Set",
      category: "Kurta Sets",
      collection: "Ode to India",
      priceINR: 27900,
      priceUSD: 328,
      badge: "Ready to Ship",
      image: "assets/product-tarini-kurta-set.jpg",
      hoverImage: "assets/product-tarini-kurta-set-detail.jpg",
      sizingMode: "standard",
      sizes: STANDARD_SIZES,
      lengthOptions: LENGTHS,
      readyToShip: true,
      leadTimeDays: 1,
      customisable: true,
      bestseller: true,
      related: ["char-bagh-kurta-set", "son-champa-kurta-set"]
    },
    {
      handle: "padmini-dress",
      name: "Padmini Dress",
      category: "Dresses",
      collection: "Modern Indian",
      priceINR: 24500,
      priceUSD: 288,
      badge: "New",
      image: "assets/product-padmini-dress.jpg",
      hoverImage: "assets/product-padmini-dress-detail.jpg",
      sizingMode: "standard",
      sizes: STANDARD_SIZES,
      lengthOptions: LENGTHS,
      leadTimeDays: 21,
      customisable: true,
      newArrival: true,
      related: ["shwet-pankh-dress", "fitoor-shirt"]
    },
    {
      handle: "tara-sitara-skirt",
      name: "Tara Sitara Skirt",
      category: "Skirts",
      collection: "The First Ballad",
      priceINR: 24500,
      priceUSD: 288,
      image: "assets/product-tara-sitara-skirt.jpg",
      hoverImage: "assets/product-tara-sitara-skirt-detail.jpg",
      sizingMode: "standard",
      sizes: STANDARD_SIZES,
      lengthOptions: LENGTHS,
      leadTimeDays: 21,
      customisable: true,
      newArrival: true,
      related: ["fitoor-skirt", "fitoor-shirt"]
    },
    {
      handle: "shwet-pankh-dress",
      name: "Shwet Pankh Dress",
      category: "Dresses",
      collection: "Modern Indian",
      priceINR: 24900,
      priceUSD: 293,
      badge: "Relaxed Fit",
      image: "assets/product-shwet-pankh-dress.jpg",
      hoverImage: "assets/product-shwet-pankh-dress-detail.jpg",
      sizingMode: "grouped",
      sizes: GROUPED_SIZES,
      lengthOptions: LENGTHS,
      readyToShip: true,
      leadTimeDays: 1,
      customisable: true,
      bestseller: true,
      related: ["padmini-dress", "fitoor-skirt"]
    },
    {
      handle: "son-champa-kurta-set",
      name: "Son Champa Kurta Set",
      category: "Kurta Sets",
      collection: "Ode to India",
      priceINR: 66500,
      priceUSD: 782,
      badge: "Handworked",
      image: "assets/product-son-champa-kurta-set.jpg",
      hoverImage: "assets/product-son-champa-kurta-set-detail.jpg",
      sizingMode: "standard",
      sizes: STANDARD_SIZES,
      lengthOptions: LENGTHS,
      leadTimeDays: 28,
      customisable: true,
      newArrival: true,
      related: ["char-bagh-kurta-set", "sunhari-kurta-set"]
    },
    {
      handle: "aprajita-kurta-set",
      name: "Aprajita Kurta Set",
      category: "Kurta Sets",
      collection: "Ode to India",
      priceINR: 38500,
      priceUSD: 453,
      image: "assets/product-aprajita-kurta-set.jpg",
      hoverImage: "assets/product-aprajita-kurta-set-detail.jpg",
      sizingMode: "standard",
      sizes: STANDARD_SIZES,
      lengthOptions: LENGTHS,
      leadTimeDays: 28,
      customisable: true,
      related: ["aprajita-odhani", "char-bagh-kurta-set"]
    },
    {
      handle: "aprajita-odhani",
      name: "Aprajita Odhani",
      category: "Odhani",
      collection: "Ode to India",
      priceINR: 25900,
      priceUSD: 305,
      badge: "One Size",
      image: "assets/product-aprajita-odhani.jpg",
      hoverImage: "assets/product-aprajita-odhani-detail.jpg",
      sizingMode: "none",
      sizes: ["One Size"],
      leadTimeDays: 21,
      customisable: false,
      bestseller: true,
      related: ["aprajita-kurta-set", "char-bagh-kurta-set"]
    },
    {
      handle: "phulwari-set",
      name: "Phulwari Set",
      category: "Co-ord Sets",
      collection: "Modern Indian",
      priceINR: 47900,
      priceUSD: 564,
      badge: "Separate Sizing",
      image: "assets/product-phulwari-set.jpg",
      hoverImage: "assets/product-phulwari-set-detail.jpg",
      sizingMode: "split",
      sizes: STANDARD_SIZES,
      lengthOptions: LENGTHS,
      leadTimeDays: 28,
      customisable: true,
      newArrival: true,
      bestseller: true,
      related: ["fitoor-set", "son-chidaiya-set"]
    },
    {
      handle: "kamal-nayan-kurta-set",
      name: "Kamal Nayan Kurta Set",
      category: "Kurta Sets",
      collection: "Ode to India",
      priceINR: 41500,
      priceUSD: 488,
      image: "assets/product-kamal-nayan-kurta-set.jpg",
      hoverImage: "assets/product-kamal-nayan-kurta-set-detail.jpg",
      sizingMode: "standard",
      sizes: STANDARD_SIZES,
      lengthOptions: LENGTHS,
      leadTimeDays: 28,
      customisable: true,
      related: ["char-bagh-kurta-set", "aprajita-odhani"]
    },
    {
      handle: "son-chidaiya-set",
      name: "Son Chidaiya Set",
      category: "Co-ord Sets",
      collection: "Ode to India",
      priceINR: 41500,
      priceUSD: 488,
      image: "assets/product-son-chidaiya-set.jpg",
      hoverImage: "assets/product-son-chidaiya-set-detail.jpg",
      sizingMode: "split",
      sizes: STANDARD_SIZES,
      lengthOptions: LENGTHS,
      leadTimeDays: 21,
      customisable: true,
      bestseller: true,
      related: ["phulwari-set", "fitoor-set"]
    },
    {
      handle: "sunhari-kurta-set",
      name: "Sunhari Kurta Set",
      category: "Kurta Sets",
      collection: "Ode to India",
      priceINR: 38500,
      priceUSD: 453,
      badge: "New",
      image: "assets/product-sunhari-kurta-set.jpg",
      hoverImage: "assets/product-sunhari-kurta-set-detail.jpg",
      sizingMode: "standard",
      sizes: STANDARD_SIZES,
      lengthOptions: LENGTHS,
      readyToShip: true,
      leadTimeDays: 1,
      customisable: true,
      newArrival: true,
      related: ["son-champa-kurta-set", "char-bagh-kurta-set"]
    },
    {
      handle: "fitoor-set",
      name: "Fitoor Set",
      category: "Co-ord Sets",
      collection: "Modern Indian",
      priceINR: 46500,
      priceUSD: 547,
      image: "assets/product-fitoor-set.jpg",
      hoverImage: "assets/product-fitoor-set-detail.jpg",
      sizingMode: "split",
      sizes: STANDARD_SIZES,
      lengthOptions: LENGTHS,
      leadTimeDays: 21,
      customisable: true,
      bestseller: true,
      related: ["fitoor-shirt", "fitoor-skirt", "phulwari-set"]
    },
    {
      handle: "fitoor-skirt",
      name: "Fitoor Skirt",
      category: "Skirts",
      collection: "Modern Indian",
      priceINR: 24500,
      priceUSD: 288,
      image: "assets/product-fitoor-skirt.jpg",
      hoverImage: "assets/product-fitoor-skirt-detail.jpg",
      sizingMode: "standard",
      sizes: STANDARD_SIZES,
      lengthOptions: LENGTHS,
      readyToShip: true,
      leadTimeDays: 1,
      customisable: true,
      related: ["fitoor-shirt", "fitoor-set"]
    },
    {
      handle: "fitoor-shirt",
      name: "Fitoor Shirt",
      category: "Shirts",
      collection: "Modern Indian",
      priceINR: 19500,
      priceUSD: 229,
      image: "assets/product-fitoor-shirt.jpg",
      hoverImage: "assets/product-fitoor-shirt-detail.jpg",
      sizingMode: "grouped",
      sizes: GROUPED_SIZES,
      leadTimeDays: 21,
      customisable: true,
      newArrival: true,
      related: ["fitoor-skirt", "fitoor-set"]
    },
    {
      handle: "beaded-necklace",
      name: "Beaded Necklace",
      category: "Jewellery",
      collection: "Jewellery",
      priceINR: 8500,
      priceUSD: 100,
      badge: "Hand Beaded",
      image: "assets/jewellery-beaded-necklace.jpg",
      hoverImage: "assets/jewellery-beaded-necklace-detail.jpg",
      sizingMode: "none",
      sizes: ["One Size"],
      readyToShip: true,
      leadTimeDays: 1,
      customisable: false,
      newArrival: true,
      bestseller: true,
      poem: "A single-count garden of beads, tied softly at the back.",
      related: ["celestial-signet-ring", "luna-ring"]
    },
    {
      handle: "celestial-signet-ring",
      name: "Celestial Signet Ring",
      category: "Jewellery",
      collection: "Jewellery",
      priceINR: 5500,
      priceUSD: 65,
      badge: "Lost-wax Cast",
      image: "assets/jewellery-celestial-ring.jpg",
      hoverImage: "assets/jewellery-celestial-ring-detail.jpg",
      sizingMode: "standard",
      sizes: ["S", "M", "L"],
      readyToShip: true,
      leadTimeDays: 1,
      customisable: false,
      bestseller: true,
      related: ["beaded-necklace", "luna-ring"]
    },
    {
      handle: "luna-ring",
      name: "Luna Ring",
      category: "Jewellery",
      collection: "Jewellery",
      priceINR: 4500,
      priceUSD: 53,
      badge: "18K Plated Brass",
      image: "assets/jewellery-luna-ring.jpg",
      hoverImage: "assets/jewellery-luna-ring-detail.jpg",
      sizingMode: "standard",
      sizes: ["S", "M", "L"],
      readyToShip: true,
      leadTimeDays: 1,
      customisable: false,
      newArrival: true,
      related: ["beaded-necklace", "celestial-signet-ring"]
    },
    {
      handle: "cottage-blossom-bag",
      name: "Cottage Blossom Bag",
      category: "Bags",
      collection: "Accessories",
      priceINR: 9500,
      priceUSD: 112,
      badge: "Printed Canvas",
      image: "assets/bag-cottage-blossom.jpg",
      hoverImage: "assets/bag-cottage-blossom-detail.jpg",
      gallery: ["assets/bag-cottage-blossom.jpg", "assets/bag-cottage-blossom-detail.jpg"],
      sizingMode: "none",
      sizes: ["One Size"],
      readyToShip: true,
      leadTimeDays: 1,
      customisable: false,
      newArrival: true,
      poem: "A cottage garden carried into the everyday.",
      description: "A structured everyday bag printed with cottage blossoms and shaped to hold daily essentials with ease.",
      craft: "Durable printed canvas with a smooth modal silk lining, finished in a small batch in India.",
      fit: "One size. 42.5 cm wide, 36 cm high, and 14 cm deep.",
      care: "Professional dry clean only. Store filled and upright to preserve its structured form.",
      related: ["vanilla-bloom-bag", "beaded-necklace", "luna-ring"]
    },
    {
      handle: "vanilla-bloom-bag",
      name: "Vanilla Bloom Bag",
      category: "Bags",
      collection: "Accessories",
      priceINR: 25900,
      priceUSD: 305,
      badge: "Hand Beaded",
      image: "assets/bag-vanilla-bloom.jpg",
      hoverImage: "assets/bag-vanilla-bloom-detail.jpg",
      gallery: ["assets/bag-vanilla-bloom.jpg", "assets/bag-vanilla-bloom-detail.jpg"],
      sizingMode: "none",
      sizes: ["One Size"],
      readyToShip: true,
      leadTimeDays: 1,
      customisable: false,
      newArrival: true,
      poem: "Velvet, blossoms, and a fringe that moves with you.",
      description: "A soft velvet bag embroidered with blooming floral motifs, cascading beadwork, and a hand-twisted handle.",
      craft: "Premium velvet, modal silk lining, hand-beaded fringe, and a hand-twisted beaded handle.",
      fit: "One size. Approximately 26.5 cm long and 25.5 cm wide, excluding the handle and fringe.",
      care: "Handle the beadwork gently and professional dry clean only. Store flat in a protective pouch.",
      related: ["cottage-blossom-bag", "beaded-necklace", "celestial-signet-ring"]
    }
  ];

  const CATEGORY_ARTWORK = [
    { handle: "dresses", label: "Dresses", image: "assets/category-dresses.jpg", tone: "blush", path: "M75 48c18 20 25 32 34 57l26 93-30 24-20-80-20 80-30-24 26-93c9-25 16-37 34-57Z" },
    { handle: "co-ord-sets", label: "Co-ord Sets", image: "assets/category-coord-sets.jpg", tone: "sage", path: "M54 52h62l12 62-25 8-7-40v57l18 75H56l18-75V82l-7 40-25-8 12-62Zm20 87h22" },
    { handle: "kurta-sets", label: "Kurta Sets", image: "assets/category-kurta-sets.jpg", tone: "butter", path: "M52 46h66l17 40-24 12-9-22 6 140H62l6-140-9 22-24-12 17-40Zm30 0v74m-11 5h22" },
    { handle: "shirts", label: "Shirts", image: "assets/category-shirts.jpg", tone: "powder", path: "M55 48h60l25 24-17 31-16-15v128H63V88l-16 15-17-31 25-24Zm20 0 10 18 10-18m-10 18v88" },
    { handle: "trousers", label: "Trousers", image: "assets/category-trousers.jpg", tone: "terra", path: "M59 48h52l4 168H88l-3-112-3 112H55l4-168Zm0 24h52" },
    { handle: "skirts", label: "Skirts", image: "assets/category-skirts.jpg", tone: "lilac", path: "M64 48h42l27 168H37L64 48Zm-5 26h52" },
    { handle: "kaftans", label: "Kaftans", tone: "rose", path: "M50 48h70l33 44-23 22-23-27 15 129H48L63 87l-23 27-23-22 33-44Zm35 0v168" },
    { handle: "jumpsuits", label: "Jumpsuits", tone: "sage", path: "M58 48h54l18 56-23 8-9-34-2 56 18 82H87l-2-70-2 70H56l18-82-2-56-9 34-23-8 18-56Z" },
    { handle: "outerwear", label: "Outerwear", tone: "butter", path: "M50 48h70l19 42-24 13-12-27 10 140H57L67 76l-12 27-24-13 19-42Zm35 0v168m0-85 28-25M85 131l-28-25" }
  ];

  const COLLECTIONS = {
    all: { handle: "all", title: "All Pieces", description: "An evolving archive of handworked clothing and objects." },
    new: { handle: "new", title: "New In", description: "New chapters, made slowly and released in small numbers.", filter: "newArrival" },
    shop: { handle: "shop", title: "Shop", description: "Quietly expressive pieces made for keeping." },
    collections: { handle: "collections", title: "Once Upon a Time", description: "A collection about remembering, wandering, and beginning again." },
    dresses: { handle: "dresses", title: "Dresses", category: "Dresses" },
    "co-ord-sets": { handle: "co-ord-sets", title: "Co-ord Sets", category: "Co-ord Sets" },
    "kurta-sets": { handle: "kurta-sets", title: "Kurta Sets", category: "Kurta Sets" },
    shirts: { handle: "shirts", title: "Shirts", category: "Shirts" },
    trousers: { handle: "trousers", title: "Trousers", category: "Trousers" },
    skirts: { handle: "skirts", title: "Skirts", category: "Skirts" },
    jewellery: { handle: "jewellery", title: "Jewellery", category: "Jewellery", description: "Small sculptures, cast and beaded by hand." },
    bags: { handle: "bags", title: "Bags", category: "Bags", description: "Hand-beaded and printed objects for carrying the everyday." },
    kaftans: { handle: "kaftans", title: "Kaftans", category: "Kaftans" },
    jumpsuits: { handle: "jumpsuits", title: "Jumpsuits", category: "Jumpsuits" },
    outerwear: { handle: "outerwear", title: "Outerwear", category: "Outerwear" },
    "ready-to-ship": { handle: "ready-to-ship", title: "Ready to Ship", description: "Pieces currently resting in the studio, ready to begin their journey.", filter: "readyToShip" }
  };

  const COLLECTION_NAV = [
    { label: "All", handle: "all" },
    { label: "Dresses", handle: "dresses" },
    { label: "Co-ord Sets", handle: "co-ord-sets" },
    { label: "Kurta Sets", handle: "kurta-sets" },
    { label: "Shirts", handle: "shirts" },
    { label: "Trousers", handle: "trousers" },
    { label: "Skirts", handle: "skirts" },
    { label: "Kaftans", handle: "kaftans" },
    { label: "Jumpsuits", handle: "jumpsuits" },
    { label: "Outerwear", handle: "outerwear" },
    { label: "Jewellery", handle: "jewellery" },
    { label: "Bags", handle: "bags" }
  ];

  const FEATURED_FOCUS = [
    "char-bagh-kurta-set",
    "pakeezah-kurta-set",
    "phulwari-set",
    "padmini-dress"
  ];

  const COMMUNITY = {
    creators: [
      { name: "The Campaign Muse", role: "Artist and collaborator", image: "assets/col-1.jpg", look: "Ode to India", handle: "collections" },
      { name: "A Study in Red", role: "Creator portrait", image: "assets/collection-2-square-poster.jpg", look: "Modern Indian", handle: "shop" },
      { name: "In Her Own Light", role: "Campaign diary", image: "assets/reel-2-poster.jpg", look: "Once Upon a Time", handle: "collections" }
    ],
    people: [
      { name: "An Ode, Worn", role: "From the community", image: "assets/char-bagh-05.jpg", look: "Char Bagh", product: "char-bagh-kurta-set" },
      { name: "A Sunday Ritual", role: "From the community", image: "assets/product-phulwari-set.jpg", look: "Phulwari", product: "phulwari-set" },
      { name: "Quiet Celebration", role: "From the community", image: "assets/product-padmini-dress.jpg", look: "Padmini", product: "padmini-dress" }
    ],
    influencers: [
      { name: "A Study in Red", role: "Style creator", image: "assets/collection-2-square-poster.jpg", look: "Modern Indian", handle: "shop" },
      { name: "A Travel Note", role: "Travel storyteller", image: "assets/reel-1-poster.jpg", look: "Once Upon a Time", handle: "collections" },
      { name: "In Her Own Light", role: "Independent creator", image: "assets/reel-2-poster.jpg", look: "The new chapter", handle: "new" }
    ]
  };

  const REELS = [
    { product: "char-bagh-kurta-set", video: "assets/reel-1-web.mp4", poster: "assets/reel-1-poster.jpg" },
    { product: "padmini-dress", video: "assets/reel-2.mp4", poster: "assets/reel-2-poster.jpg" },
    { product: "aprajita-odhani", video: "assets/reel-3.mp4", poster: "assets/reel-3-poster.jpg" },
    { product: "fitoor-skirt", video: "assets/reel-4.mp4", poster: "assets/reel-4-poster.jpg" },
    { product: "fitoor-shirt", video: "assets/reel-5-web.mp4", poster: "assets/reel-5-poster.jpg" }
  ];

  const DISCOVER_MENU = [
    { title: "Craft", links: ["Textiles", "Embroidery", "Handwork", "Product Care", "Size Guide"] },
    { title: "Journal", links: ["Stories", "Lookbooks", "Travel Notes", "Letters from the Studio"] },
    { title: "About", links: ["Designer's Note", "Our Story", "Our Roots", "Stockists", "Contact"] }
  ];

  const SHOP_MENU = {
    callout: { label: "Shop All", handle: "shop" },
    groups: [
      { title: "Clothing", links: [
        { label: "Dresses", handle: "dresses" }, { label: "Co-ord Sets", handle: "co-ord-sets" },
        { label: "Kurta Sets", handle: "kurta-sets" }, { label: "Shirts", handle: "shirts" },
        { label: "Trousers", handle: "trousers" }, { label: "Skirts", handle: "skirts" },
        { label: "Kaftans", handle: "kaftans" }, { label: "Jumpsuits", handle: "jumpsuits" },
        { label: "Outerwear", handle: "outerwear" }
      ] },
      { title: "Accessories", links: [
        { label: "Bags", handle: "bags" }, { label: "Scarves" }, { label: "Jewellery", handle: "jewellery" },
        { label: "Odhani", handle: "shop" }, { label: "Bibs / Gilet" }
      ] },
      { title: "Edits", links: [
        { label: "Festive" }, { label: "Travel Edit" }, { label: "Modern Indian", handle: "shop" },
        { label: "Limited Edition", handle: "collections" }
      ] }
    ],
    spots: [
      { image: "assets/category-dresses.jpg", label: "New silhouettes", handle: "new" },
      { image: "assets/jewellery-beaded-necklace.jpg", label: "Objects and adornment", handle: "jewellery" }
    ]
  };

  const COLLECTION_MENU = {
    groups: [
      { title: "Collections", links: [
        { label: "Once Upon a Time", handle: "collections" }, { label: "A Thing of Beauty", handle: "collections" },
        { label: "Into The Woods", handle: "collections" }, { label: "The First Ballad", handle: "collections" }
      ] },
      { title: "Archive", links: [
        { label: "The Secret Garden", handle: "collections" }, { label: "Musafir - An Ode To Travels", handle: "collections" },
        { label: "Bloom", handle: "collections" }, { label: "Language of Flowers is Infinite", handle: "collections" }
      ] }
    ],
    spots: [
      { image: "assets/col-1.jpg", label: "Once Upon a Time", handle: "collections" },
      { image: "assets/flying.png", label: "The collection archive", handle: "collections" }
    ]
  };

  const SECTIONS = {
    manifesto: { enabled: true, eyebrow: "An ode", heading: "Beauty, in the imperfect.", copy: "For the unique and the uneven; for garments that carry the memory of the hands that made them." },
    categories: { enabled: true, heading: "Find your form" },
    products: { enabled: true, heading: "The Odd Edit" },
    collection: { enabled: true, heading: "Ode to India" },
    jewellery: { enabled: true, heading: "Small Objects, Lasting Stories" },
    craft: { enabled: true, heading: "Slow by intention" },
    community: { enabled: true, heading: "People of Ode to Odd" },
    reels: { enabled: true, heading: "Worn in Motion" }
  };

  const EDITORIAL_PAGES = {
    "our-story": {
      title: "Our Story",
      eyebrow: "The garden of love",
      intro: "A story rooted in cross stitch, carried from Ranchi into an evolving language of flowers.",
      panels: [
        { image: "assets/editorial/our-story-01.jpg", alt: "Ode to Odd, The Garden of Love" },
        { image: "assets/editorial/our-story-02.jpg", alt: "Cross-stitch studies and a handworked floral panel" },
        { image: "assets/editorial/our-story-03.jpg", alt: "Map tracing Ode to Odd from Ranchi to Patna and Siliguri" },
        { image: "assets/editorial/our-story-04.jpg", alt: "The beginnings of Ode to Odd cross-stitch craft in Ranchi" },
        { image: "assets/editorial/our-story-05.jpg", alt: "Floral artwork and an Ode to Odd campaign portrait" },
        { image: "assets/editorial/our-story-06.jpg", alt: "Ode to Odd floral design and craft moodboard" },
        { image: "assets/editorial/our-story-07.jpg", alt: "A handworked Ode to Odd shirt moving in the open sky" }
      ]
    },
    "designers-note": {
      title: "Designer's Note",
      eyebrow: "From Shreya and Priyal",
      portrait: "assets/editorial/designers-portrait.jpg",
      portraitAlt: "Ode to Odd designers Shreya and Priyal",
      paragraphs: [
        "We have always sought beauty in every little thing. It has been the most powerful force behind our work. Through making, we have learnt that imperfection is the truest paradigm of beauty.",
        "Our mission is to create beautiful, quiet things that embody the odd and outnumbered: pieces that become part of you, gather meaning, and carry a meditative energy over time.",
        "Here is to shifting the perspective of beauty, one considered imperfection at a time."
      ],
      signoff: "Love & Light,\nShreya & Priyal"
    }
  };

  const SITE_CONFIG = {
    sampleSaleEnabled: false,
    defaultTheme: "porcelain",
    defaultFont: "instrument",
    defaultTypeSize: "current",
    announcement: "Handcrafted in small batches - worldwide shipping, with love from India.",
    freeShippingThreshold: 50000,
    currencies: ["INR", "USD"]
  };

  const MOBILE_NAV = [
    { id: "home", label: "Home", icon: "house", href: "index.html" },
    { id: "shop", label: "Shop", icon: "layout-grid", href: "collection.html?handle=shop" },
    { id: "search", label: "Search", icon: "search", action: "search" },
    { id: "saved", label: "Saved", icon: "heart", action: "saved", badge: "wishlist" },
    { id: "bag", label: "Bag", icon: "shopping-bag", action: "cart", badge: "cart" }
  ];

  window.OTO = {
    SITE_CONFIG,
    SECTIONS,
    COLLECTIONS,
    COLLECTION_NAV,
    PRODUCTS,
    COMMUNITY,
    CATEGORY_ARTWORK,
    REELS,
    DISCOVER_MENU,
    SHOP_MENU,
    COLLECTION_MENU,
    FEATURED_FOCUS,
    EDITORIAL_PAGES,
    STANDARD_SIZES,
    GROUPED_SIZES,
    LENGTHS,
    MOBILE_NAV
  };
})();
