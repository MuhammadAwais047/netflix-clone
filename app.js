/* CineWave — Netflix-style streaming UI, 100% client-side.
   Titles are demo data; images come from picsum.photos (no key). */
(() => {
  "use strict";

  /* ---------- helpers ---------- */
  const $ = (sel) => document.querySelector(sel);
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  };
  const rndInt = (max) => Math.floor(Math.random() * max);

  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        /* session-only fallback */
      }
    },
  };

  const PLACEHOLDER =
    "data:image/svg+xml," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225"><rect width="400" height="225" fill="#181820"/><text x="200" y="118" font-family="sans-serif" font-size="16" fill="#555" text-anchor="middle">CINEWAVE</text></svg>'
    );
  const onImgError = (img) => {
    img.onerror = null;
    img.src = PLACEHOLDER;
  };

  const img = (seed, w, h) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

  /* ---------- catalogue (demo data) ---------- */
  const T = (t, ty, y, age, d, g, m, x) => ({ t, ty, y, age, d, g, m, x });

  const CATALOGUE = [
    T("The Last Orbit", "show", 2026, "TV-14", "2 Seasons", ["Sci-Fi", "Drama"], "Cerebral, Suspenseful", "Astronauts stranded on a dying station discover the void is watching back."),
    T("Nightfall Drive", "movie", 2025, "R", "1h 58m", ["Thriller", "Crime"], "Dark, Gritty", "A getaway driver takes one last job through a city that never sleeps."),
    T("Paper Kingdoms", "show", 2024, "TV-MA", "3 Seasons", ["Drama", "Crime"], "Soapy, Addictive", "Two rival families fight over a crumbling media empire in Mumbai."),
    T("Sunfruit", "movie", 2026, "PG-13", "1h 42m", ["Romance", "Drama"], "Heartfelt, Warm", "Two rival orchard farmers fall for each other during the worst drought in decades."),
    T("Voltage", "show", 2025, "TV-14", "1 Season", ["Action", "Sci-Fi"], "Exciting, Stylized", "An electrician gains dangerous powers after touching a fallen satellite."),
    T("The Quiet Coast", "movie", 2023, "PG-13", "2h 04m", ["Drama"], "Slow-burn, Moving", "A widowed lighthouse keeper takes in a mysterious sailor."),
    T("Ghost Frequency", "show", 2026, "TV-MA", "2 Seasons", ["Horror", "Mystery"], "Chilling, Eerie", "A late-night radio host starts receiving calls from the dead."),
    T("Blue Kites", "movie", 2024, "PG", "1h 36m", ["Drama", "Family"], "Feel-Good, Tender", "Two boys chase the city's last blue kite across a changing Karachi."),
    T("Zero Day Camp", "show", 2025, "TV-MA", "1 Season", ["Thriller", "Drama"], "Twisty, Techy", "A summer coding camp for teens uncovers a hack that topples governments."),
    T("Dust & Diamonds", "movie", 2022, "R", "2h 21m", ["Crime", "Drama"], "Gritty, Epic", "A diamond courier double-crosses both the mine owner and the cartel."),
    T("Marathon Mondays", "show", 2026, "TV-PG", "1 Season", ["Comedy"], "Silly, Charming", "An office running club slowly becomes a cult of questionable cardio."),
    T("The Salt Crown", "movie", 2025, "PG-13", "2h 12m", ["Fantasy", "Adventure"], "Epic, Sweeping", "A fisher-girl discovers the drowned kingdom's crown has chosen her."),
    T("Backline", "show", 2024, "TV-MA", "2 Seasons", ["Drama", "Music"], "Backstage, Loud", "The roadies behind the world's biggest tour keep it from imploding."),
    T("Cold Open", "movie", 2026, "TV-MA", "1h 34m", ["Comedy"], "Satirical, Sharp", "A late-night writers' room sabotages its own host live on air."),
    T("Northguard", "show", 2023, "TV-14", "4 Seasons", ["Action", "Drama"], "Rousing, Sweeping", "Border rangers guard the last neutral pass in a fractured world."),
    T("Glasshouse", "movie", 2024, "R", "1h 51m", ["Thriller", "Mystery"], "Unsettling, Clever", "An architect realizes her smart home is redesigning itself around her fears."),
    T("The Understudy", "show", 2025, "TV-MA", "1 Season", ["Drama", "Thriller"], "Ominous, Twisty", "A theatre understudy will do anything to keep the lead role."),
    T("Static Bloom", "movie", 2026, "PG-13", "1h 47m", ["Sci-Fi", "Romance"], "Dreamy, Bittersweet", "In a post-signal world, two strangers fall in love over a broken radio."),
    T("Iron Lullaby", "movie", 2023, "R", "2h 08m", ["Action", "Crime"], "Brutal, Tense", "A retired safe-cracker's quiet farm life ends with a knock at midnight."),
    T("Room 404", "show", 2024, "TV-MA", "2 Seasons", ["Horror"], "Terrifying, Anthology", "Each guest of a cursed motel lives their own worst review."),
    T("The Cartographer", "movie", 2025, "PG-13", "2h 16m", ["Adventure", "Drama"], "Grand, Wonderous", "A mapmaker charts a river that keeps redrawing itself."),
    T("Punchline", "show", 2026, "TV-MA", "1 Season", ["Comedy", "Drama"], "Raw, Funny", "An open-mic underdog claws her way through the comedy circuit."),
    T("Deep Signal", "movie", 2022, "PG-13", "1h 55m", ["Sci-Fi", "Thriller"], "Claustrophobic", "A submarine crew intercepts a transmission from a trench that shouldn't speak."),
    T("Halal Hunters", "show", 2025, "TV-PG", "2 Seasons", ["Documentary"], "Delicious, Fun", "Two foodies crisscross Lahore hunting the perfect plate."),
    T("The Fifth Wall", "movie", 2026, "R", "2h 02m", ["Drama", "Mystery"], "Cerebral, Slow-burn", "A restorer finds a fifth wall hidden behind a famous mural."),
    T("Gone Coaching", "show", 2024, "TV-14", "1 Season", ["Comedy", "Sport"], "Goofy, Warm", "A failed athlete becomes the worst-best coach in the league."),
    T("Emberwatch", "movie", 2023, "PG-13", "2h 29m", ["Fantasy", "Action"], "Epic, Fiery", "The last fire-watch must hold the wall against the ash tide."),
    T("Sugar Rush Riot", "show", 2026, "TV-G", "1 Season", ["Comedy", "Family"], "Sweet, Chaotic", "Kids turn a bake sale into a neighborhood empire."),
    T("The Long Con", "movie", 2024, "R", "2h 14m", ["Crime", "Comedy"], "Witty, Sleek", "Two grifters accidentally con an actual crime boss."),
    T("Monsoon Radio", "movie", 2025, "PG", "1h 44m", ["Romance", "Drama"], "Tender, Rainy", "A pirate radio DJ dedicates songs to a stranger on the same frequency."),
    T("Deadlift", "show", 2023, "TV-MA", "2 Seasons", ["Action", "Crime"], "Punchy, Dark", "A gym owner moonlights collecting debts for the neighborhood."),
    T("Solar Winds", "movie", 2026, "PG-13", "1h 59m", ["Sci-Fi"], "Awe, Cosmic", "The first crew to sail a solar wind returns older, wrong, and home."),
    T("The Quiet Part", "show", 2025, "TV-MA", "1 Season", ["Drama"], "Intense, Honest", "Group therapy gets a livestream nobody admitted to running."),
    T("Rooftop Kingdom", "movie", 2024, "PG-13", "1h 40m", ["Comedy", "Drama"], "Charming, Urban", "Two rivals race to build the city's tallest rooftop garden."),
    T("Winterhold", "show", 2022, "TV-MA", "3 Seasons", ["Fantasy", "Drama"], "Bleak, Magical", "The north's last academy trains the magicians who may cause the winter they study."),
    T("Overclocked", "movie", 2023, "R", "1h 46m", ["Thriller"], "Tense, Speedy", "A day trader's algorithm starts trading against him personally."),
    T("The Wallflower Heist", "movie", 2025, "PG-13", "1h 57m", ["Comedy", "Crime"], "Playful, Clever", "A shy librarian plans the perfect rare-book theft."),
    T("Sultans of Speed", "show", 2026, "TV-14", "1 Season", ["Documentary", "Sport"], "Adrenaline, Loud", "Inside Pakistan's underground street-racing scene."),
    T("Harvest of Thorns", "movie", 2022, "R", "2h 18m", ["Horror", "Drama"], "Bleak, Dread-soaked", "A farming village pays its harvest tithe to something in the woods."),
    T("Last Train to Multan", "movie", 2024, "PG-13", "2h 06m", ["Drama"], "Human, Warm", "Strangers stranded by a rail strike share one night of stories."),
    T("Neon Bazaar", "show", 2025, "TV-14", "2 Seasons", ["Sci-Fi", "Comedy"], "Neon, Witty", "Market vendors of a lunar bazaar out-hustle corporate raiders."),
    T("The Rehearsal Dinner", "movie", 2026, "TV-MA", "1h 38m", ["Romance", "Comedy"], "Awkward, Sweet", "Two exes are seated at the same table, with speeches planned."),
  ];

  const ITEMS = CATALOGUE.map((t, i) => ({
    id: `cw${i + 1}`,
    ...t,
    match: 70 + ((i * 13) % 29),
    seed: `cw${i + 1}`,
  }));
  const byId = (id) => ITEMS.find((it) => it.id === id);
  const cardImg = (it) => img(it.seed, 400, 225);
  const bigImg = (it) => img(`${it.seed}big`, 1280, 720);

  /* ---------- state ---------- */
  const KEY_LIST = "cinewave-mylist-v1";
  const myList = new Set(store.get(KEY_LIST, []));
  const saveList = () => store.set(KEY_LIST, [...myList]);

  const trending = [...ITEMS].sort(() => Math.random() - 0.5).slice(0, 14);

  /* ---------- toast ---------- */
  let toastTimer;
  const toast = (msg) => {
    const t = $("#toast");
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      t.hidden = true;
    }, 2200);
  };

  /* ---------- icons ---------- */
  const playSvg =
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4.5v15l13-7.5z"/></svg>';
  const addSvg =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  const checkSvg =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4.5 12.5 5 5 10-11"/></svg>';
  const likeSvg =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1zM7 11l4-7c1.5 0 2.5 1 2.5 2.5L13 10h5.5a1.5 1.5 0 0 1 1.5 1.7l-.9 6A2 2 0 0 1 17 19.5H7"/></svg>';

  /* ---------- view switching ---------- */
  const homeView = $("#home-view");
  const gridView = $("#grid-view");

  const showHome = () => {
    gridView.hidden = true;
    homeView.hidden = false;
    renderRows();
  };

  const showGrid = (title, items) => {
    homeView.hidden = true;
    gridView.hidden = false;
    $("#grid-title").textContent = title;
    const grid = $("#grid");
    grid.textContent = "";
    const frag = document.createDocumentFragment();
    items.forEach((it) => frag.append(makeCard(it)));
    grid.append(frag);
    $("#grid-empty").hidden = items.length > 0;
  };

  const setNav = (id) => {
    document.querySelectorAll(".nav-link").forEach((b) => {
      b.classList.toggle("is-active", b.id === id);
    });
  };

  $("#logo-link").addEventListener("click", (e) => {
    e.preventDefault();
    setNav("nav-home");
    showHome();
    window.scrollTo({ top: 0 });
  });
  $("#nav-home").addEventListener("click", () => {
    setNav("nav-home");
    showHome();
  });
  $("#nav-shows").addEventListener("click", () => {
    setNav("nav-shows");
    showGrid("TV Shows", ITEMS.filter((it) => it.ty === "show"));
  });
  $("#nav-movies").addEventListener("click", () => {
    setNav("nav-movies");
    showGrid("Movies", ITEMS.filter((it) => it.ty === "movie"));
  });
  $("#nav-mylist").addEventListener("click", () => {
    setNav("nav-mylist");
    showGrid("My List", ITEMS.filter((it) => myList.has(it.id)));
  });

  /* ---------- search ---------- */
  const searchbox = $("#searchbox");
  const searchInput = $("#search-input");
  $("#search-toggle").addEventListener("click", () => {
    const open = !searchbox.classList.contains("is-open");
    searchbox.classList.toggle("is-open", open);
    $("#search-toggle").setAttribute("aria-expanded", String(open));
    if (open) searchInput.focus();
    else if (searchInput.value.trim()) {
      searchInput.value = "";
      setNav("nav-home");
      showHome();
    }
  });
  searchInput.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) {
      setNav("nav-home");
      showHome();
      return;
    }
    setNav(null);
    const hits = ITEMS.filter(
      (it) =>
        it.t.toLowerCase().includes(q) ||
        it.g.some((g) => g.toLowerCase().includes(q))
    );
    showGrid(`Results for “${searchInput.value.trim()}”`, hits);
  });

  /* ---------- topnav solid on scroll ---------- */
  window.addEventListener(
    "scroll",
    () => {
      $("#topnav").classList.toggle("is-solid", window.scrollY > 40);
    },
    { passive: true }
  );

  /* ---------- cards ---------- */
  const makeCard = (it) => {
    const card = el("button", "card");
    card.type = "button";
    card.setAttribute("aria-label", it.t);
    const im = el("img");
    im.src = cardImg(it);
    im.alt = "";
    im.loading = "lazy";
    im.onerror = () => onImgError(im);
    card.append(im);

    const ov = el("span", "card-overlay");
    ov.append(el("span", "card-title", it.t));
    const meta = el("span", "card-meta");
    meta.append(
      el("span", "match", `${it.match}% Match`),
      el("span", null, String(it.y)),
      el("span", "age", it.age)
    );
    ov.append(meta);
    const btns = el("span", "card-btns");

    const play = el("button", "mini-btn");
    play.type = "button";
    play.setAttribute("aria-label", `Play ${it.t}`);
    play.innerHTML = playSvg;
    play.addEventListener("click", (e) => {
      e.stopPropagation();
      openPlayer(it);
    });
    btns.append(play);

    const add = el("button", "mini-btn" + (myList.has(it.id) ? " is-added" : ""));
    add.type = "button";
    add.setAttribute("aria-label", myList.has(it.id) ? `Remove ${it.t} from My List` : `Add ${it.t} to My List`);
    add.innerHTML = myList.has(it.id) ? checkSvg : addSvg;
    add.addEventListener("click", (e) => {
      e.stopPropagation();
      const nowIn = !myList.has(it.id);
      if (nowIn) myList.add(it.id);
      else myList.delete(it.id);
      saveList();
      add.classList.toggle("is-added", nowIn);
      add.innerHTML = nowIn ? checkSvg : addSvg;
      add.setAttribute("aria-label", nowIn ? `Remove ${it.t} from My List` : `Add ${it.t} to My List`);
      toast(nowIn ? "Added to My List" : "Removed from My List");
      if (!$("#home-view").hidden) renderRows();
      if (currentModal === it.id) syncModalButtons(it);
    });
    btns.append(add);

    const like = el("button", "mini-btn");
    like.type = "button";
    like.setAttribute("aria-label", `Like ${it.t}`);
    like.innerHTML = likeSvg;
    like.addEventListener("click", (e) => {
      e.stopPropagation();
      toast("Thanks for the feedback 👍");
    });
    btns.append(like);

    ov.append(btns);
    card.append(ov);
    card.addEventListener("click", () => openModal(it));
    return card;
  };

  /* ---------- rows ---------- */
  const ROWS = () => {
    const rows = [
      ["Trending Now", trending],
      ["New Releases", ITEMS.filter((it) => it.y >= 2025)],
      ["Only on CineWave", [...ITEMS].sort((a, b) => b.match - a.match).slice(0, 12)],
      ["TV Shows", ITEMS.filter((it) => it.ty === "show")],
      ["Action & Adventure", ITEMS.filter((it) => it.g.includes("Action") || it.g.includes("Adventure"))],
      ["Sci-Fi & Fantasy", ITEMS.filter((it) => it.g.includes("Sci-Fi") || it.g.includes("Fantasy"))],
      ["Comedies", ITEMS.filter((it) => it.g.includes("Comedy"))],
    ];
    const mine = ITEMS.filter((it) => myList.has(it.id));
    if (mine.length) rows.unshift(["My List", mine]);
    return rows;
  };

  const renderRows = () => {
    const wrap = $("#rows");
    wrap.textContent = "";
    for (const [title, items] of ROWS()) {
      const block = el("section", "row-block");
      const head = el("div", "row-head");
      head.append(el("h2", null, title), el("span", "see-all", "Explore all ›"));
      block.append(head);

      const scroll = el("div", "row-scroll");
      const frag = document.createDocumentFragment();
      items.slice(0, 14).forEach((it) => frag.append(makeCard(it)));
      scroll.append(frag);
      block.append(scroll);

      const prev = el("button", "row-arrow prev");
      prev.type = "button";
      prev.setAttribute("aria-label", `Scroll ${title} left`);
      prev.textContent = "‹";
      prev.addEventListener("click", () => {
        scroll.scrollBy({ left: -scroll.clientWidth * 0.85, behavior: "smooth" });
      });
      const next = el("button", "row-arrow next");
      next.type = "button";
      next.setAttribute("aria-label", `Scroll ${title} right`);
      next.textContent = "›";
      next.addEventListener("click", () => {
        scroll.scrollBy({ left: scroll.clientWidth * 0.85, behavior: "smooth" });
      });
      block.append(prev, next);
      wrap.append(block);
    }
  };

  /* ---------- hero ---------- */
  const FEATURED = ["cw1", "cw27", "cw32"];
  const heroItem = byId(FEATURED[rndInt(FEATURED.length)]);

  const paintHero = (it) => {
    const hi = $("#hero-img");
    hi.src = bigImg(it);
    hi.alt = `${it.t} backdrop`;
    hi.onerror = () => onImgError(hi);
    $("#hero-tag").textContent = it.ty === "show" ? "CineWave Series" : "CineWave Film";
    $("#hero-title").textContent = it.t;
    $("#hero-match").textContent = `${it.match}% Match`;
    $("#hero-year").textContent = it.y;
    $("#hero-age").textContent = it.age;
    $("#hero-dur").textContent = it.d;
    $("#hero-desc").textContent = it.x;
    $("#hero-play").onclick = () => openPlayer(it);
    $("#hero-info").onclick = () => openModal(it);
  };
  paintHero(heroItem);

  /* ---------- detail modal ---------- */
  const modal = $("#modal");
  let currentModal = null;

  const syncModalButtons = (it) => {
    const addBtn = $("#m-add");
    const inList = myList.has(it.id);
    addBtn.classList.toggle("is-on", inList);
    addBtn.innerHTML = inList ? checkSvg : addSvg;
    addBtn.setAttribute("aria-label", inList ? "Remove from My List" : "Add to My List");
    $("#m-like").classList.remove("is-on");
  };

  const openModal = (it) => {
    currentModal = it.id;
    const mi = $("#m-img");
    mi.src = img(`${it.seed}big`, 900, 450);
    mi.alt = `${it.t} backdrop`;
    mi.onerror = () => onImgError(mi);
    $("#m-title").textContent = it.t;
    $("#m-match").textContent = `${it.match}% Match`;
    $("#m-year").textContent = it.y;
    $("#m-age").textContent = it.age;
    $("#m-dur").textContent = it.d;
    $("#m-desc").textContent = it.x;
    $("#m-genres").textContent = it.g.join(", ");
    $("#m-mood").textContent = it.m;
    $("#m-play").onclick = () => openPlayer(it);
    syncModalButtons(it);

    const similar = ITEMS.filter((o) => o.id !== it.id && o.g.some((g) => it.g.includes(g))).slice(0, 6);
    const wrap = $("#m-similar");
    wrap.textContent = "";
    for (const s of similar) {
      const sim = el("button", "sim-card");
      sim.type = "button";
      sim.setAttribute("aria-label", s.t);
      const im = el("img");
      im.src = img(s.seed, 320, 180);
      im.alt = "";
      im.loading = "lazy";
      im.onerror = () => onImgError(im);
      sim.append(im);
      const body = el("div", "sim-body");
      const meta = el("div", "sim-meta");
      meta.append(
        el("span", "match", `${s.match}%`),
        el("span", null, String(s.y)),
        el("span", "age", s.age)
      );
      body.append(meta, el("p", null, s.x));
      sim.append(body);
      sim.addEventListener("click", () => openModal(s));
      wrap.append(sim);
    }

    modal.hidden = false;
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.hidden = true;
    currentModal = null;
    document.body.style.overflow = "";
  };

  $("#modal-close").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target.hasAttribute("data-close")) closeModal();
  });
  $("#m-add").addEventListener("click", () => {
    const it = byId(currentModal);
    if (!it) return;
    const nowIn = !myList.has(it.id);
    if (nowIn) myList.add(it.id);
    else myList.delete(it.id);
    saveList();
    syncModalButtons(it);
    toast(nowIn ? "Added to My List" : "Removed from My List");
    if (!$("#home-view").hidden) renderRows();
  });
  $("#m-like").addEventListener("click", () => {
    $("#m-like").classList.toggle("is-on");
    toast("Thanks for the feedback 👍");
  });

  /* ---------- player ---------- */
  const player = $("#player");
  let playerTimer;

  const openPlayer = (it) => {
    closeModal();
    const pi = $("#player-img");
    pi.src = bigImg(it);
    pi.alt = "";
    $("#player-title").textContent = it.t;
    $("#player-progress").style.width = "0%";
    player.hidden = false;
    document.body.style.overflow = "hidden";
    let w = 0;
    clearInterval(playerTimer);
    playerTimer = setInterval(() => {
      w = Math.min(100, w + 2.5);
      $("#player-progress").style.width = `${w}%`;
      if (w >= 100) clearInterval(playerTimer);
    }, 900);
  };

  const closePlayer = () => {
    clearInterval(playerTimer);
    player.hidden = true;
    document.body.style.overflow = "";
  };

  $("#player-close").addEventListener("click", closePlayer);
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!player.hidden) closePlayer();
    else if (!modal.hidden) closeModal();
  });

  /* ---------- boot ---------- */
  showHome();
})();
