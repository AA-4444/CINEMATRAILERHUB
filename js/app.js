
function formatViews(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toString();
}

function formatRating(r) {
  return parseFloat(r).toFixed(1);
}

function getYouTubeId(url) {
  const match = url.match(/embed\/([^?]+)/);
  return match ? match[1] : null;
}

function getYouTubeThumbnail(url) {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

function slugify(str) {
  return str.toLowerCase()
    .replace(/[^a-zа-яёіїєґ0-9\s-]/gi, '')
    .replace(/\s+/g, '-');
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function setQueryParam(name, value) {
  const url = new URL(window.location.href);
  if (value) {
    url.searchParams.set(name, value);
  } else {
    url.searchParams.delete(name);
  }
  window.history.pushState({}, '', url);
}

// CARDS / КАРТОЧКИ
function renderMovieCard(movie, options = {}) {
  const { showNew = true, linkTarget = '' } = options;

  // Теги: жанри + країни (максимум 6)
  const allTags = [...movie.genres, ...movie.countries].slice(0, 6);
  const tagsHtml = allTags.map(t =>
    `<a href="index.html?genre=${encodeURIComponent(t)}" class="movie-card__tag" onclick="event.stopPropagation()">${t}</a>`
  ).join('');

  const newBadge = (showNew && movie.isNew)
    ? `<span class="movie-card__new-badge">Нове</span>` : '';

  const ratingColor = movie.rating >= 8 ? '#4caf50' : movie.rating >= 6 ? '#f5c518' : '#e57373';

  return `
    <div class="movie-card" onclick="openMovie(${movie.id})" data-id="${movie.id}">
      <div class="movie-card__poster-wrap">
        <img
          class="movie-card__poster"
          src="${movie.poster}"
          alt="${movie.title}"
          loading="lazy"
          onerror="this.style.display='none'; this.parentNode.querySelector('.poster-placeholder').style.display='flex';"
        />
        <div class="poster-placeholder" style="display:none"><i class="fas fa-film"></i></div>
        <div class="movie-card__overlay"></div>
        <div class="movie-card__play-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
        </div>
        <div class="movie-card__rating" style="color:${ratingColor}">
          ★ ${formatRating(movie.rating)}
        </div>
        <div class="movie-card__age">${movie.ageRating}</div>
        ${newBadge}
      </div>
      <div class="movie-card__body">
        <div class="movie-card__tags">${tagsHtml}</div>
        <div class="movie-card__title">${movie.title} (${movie.year})</div>
        <div class="movie-card__meta">
          <span class="movie-card__views">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            ${formatViews(movie.views)}
          </span>
          <span>${movie.translation}</span>
        </div>
      </div>
    </div>
  `;
}

/*
 Рендер карточки 
 */
function renderSkeletonCard() {
  return `
    <div class="skeleton-card">
      <div class="skeleton-poster skeleton"></div>
      <div class="skeleton-line skeleton"></div>
      <div class="skeleton-line skeleton skeleton-line--short"></div>
    </div>
  `;
}



function openMovie(id) {
  window.location.href = `movie.html?id=${id}`;
}

function openGenre(genre) {
  window.location.href = `index.html?genre=${encodeURIComponent(genre)}`;
}

function openYear(year) {
  window.location.href = `index.html?year=${year}`;
}

function openSearch(query) {
  window.location.href = `search.html?q=${encodeURIComponent(query)}`;
}


// HEADER & SIDEBAR COMPONENT


function renderHeader() {
  const genres = getAllGenres().slice(0, 12);
  const years = getAllYears().slice(0, 8);

  return `
    <header class="header">
      <a href="index.html" class="header-logo">
        <div class="header-logo__icon">🎬</div>
        <span class="header-logo__text">CINEMATRAILER<span>HUB</span></span>
      </a>

      <nav class="header-nav">
        <div class="nav-item">
          <a href="index.html" class="nav-link ${!getQueryParam('genre') && !getQueryParam('year') && window.location.pathname.includes('index') ? 'active' : ''}">
            Головна
          </a>
        </div>
        <div class="nav-item">
          <a href="movies.html" class="nav-link ${window.location.pathname.includes('movies') ? 'active' : ''}">
            Фільми
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
          </a>
          <div class="nav-dropdown">
            <strong style="display:block;padding:6px 12px;font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.8px;">Жанри</strong>
            ${genres.map(g => `<a href="index.html?genre=${encodeURIComponent(g)}">${g}</a>`).join('')}
            <a href="movies.html" style="color:var(--accent);margin-top:4px;">Всі фільми →</a>
          </div>
        </div>
        <div class="nav-item">
          <a href="index.html" class="nav-link">
            За часом
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
          </a>
          <div class="nav-dropdown">
            <strong style="display:block;padding:6px 12px;font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.8px;">Роки</strong>
            ${years.map(y => `<a href="index.html?year=${y}">${y}</a>`).join('')}
          </div>
        </div>
      </nav>

      <div class="header-search-wrap">
        <div class="header-search" id="headerSearch">
          <input
            type="text"
            id="headerSearchInput"
            placeholder="Пошук фільмів..."
            autocomplete="off"
          />
          <button onclick="handleSearchSubmit()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </button>
        </div>
        <div class="search-dropdown" id="searchDropdown"></div>
      </div>

      <button class="header-burger" id="burgerBtn" onclick="toggleSidebar()">
        <span></span><span></span><span></span>
      </button>
    </header>
  `;
}

function renderSidebar() {
  const genres = getAllGenres();
  const currentGenre = getQueryParam('genre') || '';

  const genreIcons = {
    'Трилер': 'fa-knife', 'Драма': 'fa-masks-theater', 'Комедія': 'fa-face-grin', 'Бойовик': 'fa-explosion',
    'Фантастика': 'fa-rocket', 'Жахи': 'fa-ghost', 'Романтика': 'fa-heart', 'Пригоди': 'fa-map',
    'Біографія': 'fa-book', 'Документальний': 'fa-video', 'Анімація': 'fa-paintbrush',
    'Сімейний': 'fa-people', 'Фентезі': 'fa-wand-magic-sparkles', 'Мюзикл': 'fa-music',
    'Детектив': 'fa-magnifying-glass', 'Вестерн': 'fa-horse', 'Злочин': 'fa-gavel',
    'Спорт': 'fa-football', 'Військовий': 'fa-medal', 'Містика': 'fa-moon',
    'Мелодрама': 'fa-heart-crack', 'Кримінал': 'fa-gun', 'Історія': 'fa-landmark'
  };

  return `
    <aside class="sidebar" id="sidebar">
      <!-- Mobile search -->
      <div class="sidebar-search">
        <input type="text" id="mobileSearchInput" placeholder="Пошук..." autocomplete="off" />
        <button onclick="handleMobileSearch()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
        </button>
      </div>

      <div class="sidebar-title">Популярні категорії</div>
      <ul class="sidebar-list">
        <li>
          <a href="index.html" class="sidebar-link ${!currentGenre ? 'active' : ''}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Всі фільми
          </a>
        </li>
        ${genres.map(g => `
          <li>
            <a href="index.html?genre=${encodeURIComponent(g)}" class="sidebar-link ${currentGenre === g ? 'active' : ''}">
              <i class="fas ${genreIcons[g] || 'fa-film'}" style="font-size:14px"></i>
              ${g}
            </a>
          </li>
        `).join('')}
      </ul>
    </aside>
    <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>
  `;
}


// SIDEBAR TOGGLE


function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const burger = document.getElementById('burgerBtn');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
  burger.classList.toggle('active');
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const burger = document.getElementById('burgerBtn');
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
  burger.classList.remove('active');
}


// SEARCH LOGIC

function handleSearchSubmit() {
  const input = document.getElementById('headerSearchInput');
  const q = input ? input.value.trim() : '';
  if (q) openSearch(q);
}

function handleMobileSearch() {
  const input = document.getElementById('mobileSearchInput');
  const q = input ? input.value.trim() : '';
  if (q) openSearch(q);
}

function initSearchDropdown() {
  const input = document.getElementById('headerSearchInput');
  const dropdown = document.getElementById('searchDropdown');
  if (!input || !dropdown) return;

  let timeout;

  input.addEventListener('input', () => {
    clearTimeout(timeout);
    const q = input.value.trim();
    if (q.length < 2) {
      dropdown.classList.remove('open');
      return;
    }
    timeout = setTimeout(() => {
      const results = filterMovies({ search: q }).slice(0, 6);
      renderSearchDropdown(results, q, dropdown);
    }, 200);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      dropdown.classList.remove('open');
      handleSearchSubmit();
    }
    if (e.key === 'Escape') {
      dropdown.classList.remove('open');
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header-search-wrap')) {
      dropdown.classList.remove('open');
    }
  });

  // Mobile search
  const mobileInput = document.getElementById('mobileSearchInput');
  if (mobileInput) {
    mobileInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleMobileSearch();
    });
  }
}

function renderSearchDropdown(results, query, dropdown) {
  if (results.length === 0) {
    dropdown.innerHTML = `<div class="search-dropdown-empty">Нічого не знайдено за запитом «${query}»</div>`;
    dropdown.classList.add('open');
    return;
  }

  const items = results.map(m => `
    <div class="search-dropdown-item" onclick="openMovie(${m.id})">
      <img src="${m.poster}" alt="${m.title}" onerror="this.src=''" />
      <div class="search-dropdown-item__info">
        <div class="search-dropdown-item__title">${m.title}</div>
        <div class="search-dropdown-item__meta">
          <span>${m.year}</span>
          ${m.genres.slice(0, 2).map(g => `<span>${g}</span>`).join('')}
          <span>★ ${formatRating(m.rating)}</span>
        </div>
      </div>
    </div>
  `).join('');

  dropdown.innerHTML = items + `
    <a href="search.html?q=${encodeURIComponent(query)}" class="search-dropdown-all">
      Показати всі результати →
    </a>
  `;
  dropdown.classList.add('open');
}

// INIT COMMON (header + sidebar + search)

function initCommon() {
  // Inject header
  const headerEl = document.getElementById('app-header');
  if (headerEl) headerEl.innerHTML = renderHeader();

  // Inject sidebar
  const sidebarEl = document.getElementById('app-sidebar');
  if (sidebarEl) sidebarEl.innerHTML = renderSidebar();

  // Init search
  initSearchDropdown();
}


// MOBILE BOTTOM NAV


function injectMobileNav() {
  // Remove existing
  const existing = document.getElementById('mobile-bottom-nav');
  if (existing) existing.remove();

  const nav = document.createElement('nav');
  nav.className = 'mobile-bottom-nav';
  nav.id = 'mobile-bottom-nav';
  nav.innerHTML = `
    <div class="mobile-bottom-nav__items">
      <a href="index.html" class="mobile-bottom-nav__item ${window.location.pathname.includes('index') || window.location.pathname === '/' ? 'active' : ''}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        Головна
      </a>
      <a href="movies.html" class="mobile-bottom-nav__item ${window.location.pathname.includes('movies') ? 'active' : ''}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/>
        </svg>
        Фільми
      </a>
      <a href="search.html" class="mobile-bottom-nav__item ${window.location.pathname.includes('search') ? 'active' : ''}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        Пошук
      </a>
      <a href="#" class="mobile-bottom-nav__item" onclick="toggleSidebar(); return false;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
        Категорії
      </a>
    </div>
  `;
  document.body.appendChild(nav);
}


// HOME 


function initHomePage() {
  initCommon();

  const genre = getQueryParam('genre');
  const year = getQueryParam('year') ? parseInt(getQueryParam('year')) : null;

  const mainEl = document.getElementById('main-content');
  if (!mainEl) return;

  // Filter mode
  if (genre || year) {
    let filtered = filterMovies({ genre, year });
    const title = genre ? `Жанр: ${genre}` : `Рік: ${year}`;

    mainEl.innerHTML = `
      <div class="breadcrumb">
        <a href="index.html">Головна</a>
        <span class="breadcrumb-sep">›</span>
        <span class="breadcrumb-current">${title}</span>
      </div>
      <div class="section-header">
        <h1 class="section-title">${title}</h1>
        <a href="index.html" class="section-link">← Назад</a>
      </div>
      <p class="results-count">Знайдено: <strong>${filtered.length}</strong> фільмів</p>
      <div class="movies-grid" id="filtered-grid"></div>
    `;

    const grid = document.getElementById('filtered-grid');
    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <h3>Нічого не знайдено</h3>
          <p>Спробуйте інший жанр або рік</p>
        </div>
      `;
    } else {
      grid.innerHTML = filtered.map(m => renderMovieCard(m)).join('');
    }
    return;
  }

  // Inject mobile bottom nav
  injectMobileNav();

  // Normal home page
  const newMovies = MOVIES_DATA.filter(m => m.isNew);
  const popularMovies = MOVIES_DATA.filter(m => m.isPopular);
  const featuredMovie = popularMovies.sort((a,b) => b.rating - a.rating)[0];

  // Group by genre for sections
  const genreSections = {};
  MOVIES_DATA.forEach(m => {
    m.genres.forEach(g => {
      if (!genreSections[g]) genreSections[g] = [];
      if (genreSections[g].length < 10) genreSections[g].push(m);
    });
  });

  // Pick top 3 genres with enough films
  const topGenres = Object.entries(genreSections)
    .filter(([, arr]) => arr.length >= 4)
    .slice(0, 3);

  mainEl.innerHTML = `
    <!-- Hero Banner -->
    <div class="hero-banner" onclick="openMovie(${featuredMovie.id})" style="cursor:pointer">
      <img class="hero-banner__poster" src="${featuredMovie.poster}" alt="${featuredMovie.title}" onerror="this.style.display='none'" />
      <div class="hero-banner__decoration"></div>
      <div class="hero-banner__content">
        <span class="hero-banner__badge"><i class="fas fa-fire"></i> Топ рейтингу</span>
        <h2 class="hero-banner__title">${featuredMovie.title} (${featuredMovie.year})</h2>
        <p class="hero-banner__desc">${featuredMovie.description.slice(0, 120)}...</p>
        <a class="hero-banner__btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
          Дивитися трейлер
        </a>
      </div>
    </div>

    <!-- New movies -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">Нові фільми</h2>
        <a href="movies.html" class="section-link">Дивитися всі →</a>
      </div>
      <div class="movies-grid">
        ${newMovies.map(m => renderMovieCard(m)).join('')}
      </div>
    </section>

    <!-- Popular movies (horizontal scroll) -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">Популярні фільми</h2>
        <a href="movies.html" class="section-link">Дивитися всі →</a>
      </div>
      <div class="movies-scroll-wrap">
        <button class="scroll-arrow scroll-arrow--left" onclick="scrollSection('popular-scroll', -1)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div class="movies-scroll" id="popular-scroll">
          ${popularMovies.map(m => renderMovieCard(m)).join('')}
        </div>
        <button class="scroll-arrow scroll-arrow--right" onclick="scrollSection('popular-scroll', 1)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
    </section>

    <!-- Genre sections -->
    ${topGenres.map(([genre, movies], i) => `
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">${genre}</h2>
          <a href="index.html?genre=${encodeURIComponent(genre)}" class="section-link">Дивитися всі →</a>
        </div>
        <div class="movies-scroll-wrap">
          <button class="scroll-arrow scroll-arrow--left" onclick="scrollSection('genre-scroll-${i}', -1)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div class="movies-scroll" id="genre-scroll-${i}">
            ${movies.map(m => renderMovieCard(m)).join('')}
          </div>
          <button class="scroll-arrow scroll-arrow--right" onclick="scrollSection('genre-scroll-${i}', 1)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </section>
    `).join('')}
  `;
}

function scrollSection(id, dir) {
  const el = document.getElementById(id);
  if (el) el.scrollBy({ left: dir * 500, behavior: 'smooth' });
}


// MOVIES LIST PAGE


function initMoviesPage() {
  initCommon();
  injectMobileNav();

  const mainEl = document.getElementById('main-content');
  if (!mainEl) return;

  const genres = getAllGenres();
  const years = getAllYears();
  const countries = getAllCountries();

  // Read filters from URL
  let currentGenre = getQueryParam('genre') || '';
  let currentYear = getQueryParam('year') || '';
  let currentCountry = getQueryParam('country') || '';

  function renderPage() {
    const filtered = filterMovies({
      genre: currentGenre || undefined,
      year: currentYear ? parseInt(currentYear) : undefined,
      country: currentCountry || undefined
    });

    const gridEl = document.getElementById('movies-grid');
    const countEl = document.getElementById('results-count');

    if (countEl) countEl.innerHTML = `Знайдено: <strong>${filtered.length}</strong> фільмів`;

    if (gridEl) {
      if (filtered.length === 0) {
        gridEl.innerHTML = `
          <div class="empty-state" style="grid-column:1/-1">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <h3>Нічого не знайдено</h3>
            <p>Спробуйте змінити фільтри</p>
          </div>
        `;
      } else {
        gridEl.innerHTML = filtered.map(m => renderMovieCard(m)).join('');
      }
    }
  }

  mainEl.innerHTML = `
    <div class="breadcrumb">
      <a href="index.html">Головна</a>
      <span class="breadcrumb-sep">›</span>
      <span class="breadcrumb-current">Фільми</span>
    </div>

    <h1 class="page-title">Фільми</h1>

    <div class="filters-bar">
      <div class="filter-group">
        <label class="filter-label">Жанр</label>
        <select class="filter-select" id="filterGenre">
          <option value="">Всі жанри</option>
          ${genres.map(g => `<option value="${g}" ${currentGenre === g ? 'selected' : ''}>${g}</option>`).join('')}
        </select>
      </div>
      <div class="filter-group">
        <label class="filter-label">Рік</label>
        <select class="filter-select" id="filterYear">
          <option value="">Всі роки</option>
          ${years.map(y => `<option value="${y}" ${currentYear == y ? 'selected' : ''}>${y}</option>`).join('')}
        </select>
      </div>
      <div class="filter-group">
        <label class="filter-label">Країна</label>
        <select class="filter-select" id="filterCountry">
          <option value="">Всі країни</option>
          ${countries.map(c => `<option value="${c}" ${currentCountry === c ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
      </div>
      <button class="filter-btn" onclick="applyFilters()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
        Фільтрувати
      </button>
      <button class="filter-reset" onclick="resetFilters()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
        Скинути
      </button>
    </div>

    <p class="results-count" id="results-count"></p>
    <div class="movies-grid" id="movies-grid"></div>
  `;

  // Apply filters
  window.applyFilters = function() {
    currentGenre = document.getElementById('filterGenre').value;
    currentYear = document.getElementById('filterYear').value;
    currentCountry = document.getElementById('filterCountry').value;
    setQueryParam('genre', currentGenre);
    setQueryParam('year', currentYear);
    setQueryParam('country', currentCountry);
    renderPage();
  };

  window.resetFilters = function() {
    currentGenre = '';
    currentYear = '';
    currentCountry = '';
    document.getElementById('filterGenre').value = '';
    document.getElementById('filterYear').value = '';
    document.getElementById('filterCountry').value = '';
    setQueryParam('genre', '');
    setQueryParam('year', '');
    setQueryParam('country', '');
    renderPage();
  };

  renderPage();
}


// MOVIE DETAIL PAGE


function initMoviePage() {
  initCommon();
  injectMobileNav();

  const mainEl = document.getElementById('main-content');
  if (!mainEl) return;

  const id = getQueryParam('id');
  const movie = getMovieById(id);

  if (!movie) {
    mainEl.innerHTML = `
      <div class="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
        </svg>
        <h3>Фільм не знайдено</h3>
        <p>Можливо, він був видалений або посилання невірне</p>
        <a href="index.html" class="btn btn-primary" style="margin-top:20px;display:inline-flex">← На головну</a>
      </div>
    `;
    return;
  }

  document.title = `${movie.title} (${movie.year}) — Filmoteka`;

  const similar = getSimilarMovies(movie, 8);
  const recommended = getRecommendedMovies(movie, 4);

  const starsHtml = Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.round(movie.rating / 2);
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="${filled ? 'var(--star-color)' : 'none'}" stroke="var(--star-color)" stroke-width="1.5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>`;
  }).join('');

  mainEl.innerHTML = `
    <div class="movie-detail">
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <a href="index.html">Головна</a>
        <span class="breadcrumb-sep">›</span>
        <a href="movies.html">Фільми</a>
        <span class="breadcrumb-sep">›</span>
        <span class="breadcrumb-current">${movie.title} (${movie.year})</span>
      </div>

      <!-- Trailer -->
      <div class="trailer-section">
        <div class="trailer-wrap">
          <iframe
            src="${movie.trailerUrl}?autoplay=0&rel=0&modestbranding=1"
            title="${movie.title} — Трейлер"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>

      <!-- Movie info -->
      <div class="movie-info">
        <div class="movie-info__poster">
          <img
            src="${movie.poster}"
            alt="${movie.title}"
            onerror="this.style.display='none'"
          />
        </div>
        <div class="movie-info__content">
          <h1 class="movie-info__title">${movie.title} (${movie.year})</h1>

          <div class="movie-rating">
            <div class="rating-stars">${starsHtml}</div>
            <span class="rating-value">★ ${formatRating(movie.rating)}</span>
            <span class="rating-count">${movie.votes} оцінок</span>
          </div>

          <div class="movie-meta-list">
            <div class="movie-meta-row">
              <span class="movie-meta-row__label">Рік:</span>
              <span class="movie-meta-row__value">
                <a href="index.html?year=${movie.year}" class="meta-tag">${movie.year}</a>
              </span>
            </div>
            <div class="movie-meta-row">
              <span class="movie-meta-row__label">Тривалість:</span>
              <span class="movie-meta-row__value">${movie.duration}</span>
            </div>
            <div class="movie-meta-row">
              <span class="movie-meta-row__label">Жанри:</span>
              <span class="movie-meta-row__value">
                ${movie.genres.map(g => `<a href="index.html?genre=${encodeURIComponent(g)}" class="meta-tag">${g}</a>`).join('')}
              </span>
            </div>
            <div class="movie-meta-row">
              <span class="movie-meta-row__label">Країни:</span>
              <span class="movie-meta-row__value">
                ${movie.countries.map(c => `<span class="meta-tag">${c}</span>`).join('')}
              </span>
            </div>
            <div class="movie-meta-row">
              <span class="movie-meta-row__label">Переклад:</span>
              <span class="movie-meta-row__value">
                <span class="meta-tag" style="background:var(--accent-light);color:var(--accent)">${movie.translation}</span>
              </span>
            </div>
          </div>

          <div class="movie-stats">
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              ${formatViews(movie.views)} переглядів
            </span>
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
              ${movie.ageRating}
            </span>
          </div>


        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button class="tab-btn active" onclick="switchTab('desc', this)">Опис</button>
        <button class="tab-btn" onclick="switchTab('similar', this)">Схожі фільми (${similar.length})</button>
      </div>

      <div class="tab-content active" id="tab-desc">
        <p class="movie-description">${movie.description}</p>
      </div>

      <div class="tab-content" id="tab-similar">
        <div class="movies-grid">
          ${similar.map(m => renderMovieCard(m)).join('')}
        </div>
      </div>

      <div class="divider"></div>

      <!-- Recommendations -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Вам також може сподобатися</h2>
        </div>
        <div class="movies-scroll-wrap">
          <button class="scroll-arrow scroll-arrow--left" onclick="scrollSection('similar-scroll', -1)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div class="movies-scroll" id="similar-scroll">
            ${similar.map(m => renderMovieCard(m)).join('')}
          </div>
          <button class="scroll-arrow scroll-arrow--right" onclick="scrollSection('similar-scroll', 1)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </section>

      <div class="divider"></div>

      <!-- We recommend -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Ми рекомендуємо</h2>
        </div>
        <div class="recommend-grid">
          ${recommended.map(m => `
            <div class="recommend-card" onclick="openMovie(${m.id})">
              <div class="recommend-card__poster">
                <img src="${m.poster}" alt="${m.title}" loading="lazy" onerror="this.style.display='none'" />
              </div>
              <div class="recommend-card__body">
                <div class="recommend-card__title">${m.title} (${m.year})</div>
                <div class="recommend-card__desc">${m.description}</div>
                <a class="recommend-card__btn">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                  Дивитися зараз
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    </div>
  `;
}

function switchTab(tabId, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-' + tabId).classList.add('active');
}


// SEARCH PAGE


function initSearchPage() {
  initCommon();
  injectMobileNav();

  const mainEl = document.getElementById('main-content');
  if (!mainEl) return;

  const query = getQueryParam('q') || '';
  let currentGenre = getQueryParam('genre') || '';
  let currentYear = getQueryParam('year') || '';

  // Pre-fill search input
  const headerInput = document.getElementById('headerSearchInput');
  if (headerInput) headerInput.value = query;

  const genres = getAllGenres();
  const years = getAllYears();

  function renderResults() {
    const results = filterMovies({
      search: query || undefined,
      genre: currentGenre || undefined,
      year: currentYear ? parseInt(currentYear) : undefined
    });

    const gridEl = document.getElementById('search-results');
    const countEl = document.getElementById('search-count');

    if (countEl) {
      countEl.innerHTML = query
        ? `Результати пошуку за запитом «<strong>${query}</strong>»: ${results.length} фільмів`
        : `Знайдено: <strong>${results.length}</strong> фільмів`;
    }

    if (gridEl) {
      if (results.length === 0) {
        gridEl.innerHTML = `
          <div class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <h3>Нічого не знайдено</h3>
            <p>Спробуйте інший запит або оберіть інший жанр</p>
          </div>
        `;
      } else {
        gridEl.innerHTML = results.map(m => renderMovieCard(m)).join('');
      }
    }

    // Update active filter buttons
    document.querySelectorAll('.filter-tag-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.value === currentGenre || btn.dataset.value === currentYear);
    });
  }

  mainEl.innerHTML = `
    <div class="breadcrumb">
      <a href="index.html">Головна</a>
      <span class="breadcrumb-sep">›</span>
      <span class="breadcrumb-current">Пошук</span>
    </div>

    <div class="search-page-header">
      <h1 class="search-page-title">
        ${query ? `Пошук: <span class="search-page-query">${query}</span>` : 'Всі фільми'}
      </h1>
    </div>

    <div class="search-layout">
      <!-- Sidebar filters -->
      <div class="search-sidebar">
        <div class="search-sidebar-title">Категорії фільмів</div>
        <div class="filter-tags" id="genre-filters">
          <button class="filter-tag-btn ${!currentGenre ? 'active' : ''}" data-value="" onclick="setGenreFilter('')">
            Всі жанри
            <span class="filter-tag-count">${MOVIES_DATA.length}</span>
          </button>
          ${genres.map(g => {
            const count = MOVIES_DATA.filter(m => m.genres.includes(g)).length;
            return `
              <button class="filter-tag-btn ${currentGenre === g ? 'active' : ''}" data-value="${g}" onclick="setGenreFilter('${g}')">
                ${g}
                <span class="filter-tag-count">${count}</span>
              </button>
            `;
          }).join('')}
        </div>

        <div class="search-sidebar-title" style="margin-top:20px">За часом</div>
        <div class="filter-tags" id="year-filters">
          <button class="filter-tag-btn ${!currentYear ? 'active' : ''}" data-value="" onclick="setYearFilter('')">
            Всі роки
          </button>
          ${years.map(y => `
            <button class="filter-tag-btn ${currentYear == y ? 'active' : ''}" data-value="${y}" onclick="setYearFilter(${y})">
              ${y}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Results -->
      <div>
        <p class="results-count" id="search-count"></p>
        <div class="movies-grid" id="search-results"></div>
      </div>
    </div>
  `;

  window.setGenreFilter = function(genre) {
    currentGenre = genre;
    setQueryParam('genre', genre);
    renderResults();
  };

  window.setYearFilter = function(year) {
    currentYear = year ? year.toString() : '';
    setQueryParam('year', currentYear);
    renderResults();
  };

  renderResults();
}


// RENDER FOOTER


function renderFooter() {
  const footerEl = document.getElementById('app-footer');
  if (!footerEl) return;

  footerEl.innerHTML = `
    <footer class="footer">
      <div class="footer-inner">
        <a href="index.html" class="footer-logo">
         
          <span class="footer-logo__text">CINEMATRAILER<span>HUB</span></span>
        </a>
        <div class="footer-links">
          <a href="#">Питання</a>
          <a href="#">Політика конфіденційності</a>
          <a href="#">Контакти</a>
          <a href="movies.html">Всі фільми</a>
        </div>
        <div class="footer-copy">
          © ${new Date().getFullYear()} CINEMATRAILERHUB. Всі права захищені.
        </div>
      </div>
    </footer>
  `;
}
