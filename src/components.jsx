// SRCafe components
const { useState, useEffect, useRef, useMemo } = React;

// ---------- ICONS ----------
const Icon = {
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>,
  arrow: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>,
  flame: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1 3 4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 2-4-1 3 1 4 2 4s-2-4 0-8Zm-6 14a6 6 0 0 0 12 0c0-2-1-4-3-5 1 3-1 5-3 5s-4-2-3-5c-2 1-3 3-3 5Z"/></svg>,
  wifi: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 9a16 16 0 0 1 20 0M5 12.5a11 11 0 0 1 14 0M8.5 16a6 6 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1" fill="currentColor"/></svg>,
  tag: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41 13 21l-9-9V4h8l8.59 8.59a2 2 0 0 1 0 2.82Z"/><circle cx="7.5" cy="7.5" r="1" fill="currentColor"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
  pin: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-6-7-12a7 7 0 1 1 14 0c0 6-7 12-7 12Z"/><circle cx="12" cy="9" r="2.5"/></svg>,
  star: <svg viewBox="0 0 24 24"><path d="m12 2 3 7 7.5.6-5.7 5 1.8 7.4L12 18l-6.6 4 1.8-7.4-5.7-5L9 9l3-7Z"/></svg>,
  heart: <svg viewBox="0 0 24 24"><path d="M12 21s-7-5-9.5-10A5 5 0 0 1 12 6a5 5 0 0 1 9.5 5C19 16 12 21 12 21Z"/></svg>,
  grid: <svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/></svg>,
  list: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>,
  map: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z"/><path d="M9 3v15M15 6v15"/></svg>,
  split: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="8" height="16" rx="1.5"/><rect x="13" y="4" width="8" height="16" rx="1.5"/></svg>,
  chevron: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 9 6 6 6-6"/></svg>,
  dollar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2v20M16 6H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H7"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m4 12 5 5L20 6"/></svg>,
  x: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>,
};

// ---------- DROPDOWN ----------
function Dropdown({ label, icon, value, activeLabel, align = 'right', badge = null, children, renderItems }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className={`dd ${open ? 'dd-open' : ''}`} ref={wrapRef}>
      <button className="dd-trigger" onClick={() => setOpen(v => !v)} aria-expanded={open}>
        {icon && <span className="dd-trigger-icon">{icon}</span>}
        <span className="dd-trigger-label">
          {label}{activeLabel && <span className="dd-trigger-value"> {activeLabel}</span>}
        </span>
        {badge != null && <span className="dd-trigger-badge">{badge}</span>}
        <span className="dd-chev" style={{width: 12, height: 12}}>{Icon.chevron}</span>
      </button>
      {open && (
        <div className={`dd-menu dd-menu-${align}`} role="menu">
          {renderItems ? renderItems({ close, value }) : children}
        </div>
      )}
    </div>
  );
}

function DropdownItem({ active, onClick, icon, children, trailing }) {
  return (
    <button className={`dd-item ${active ? 'dd-item-active' : ''}`} role="menuitem" onClick={onClick}>
      {icon && <span className="dd-item-icon">{icon}</span>}
      <span className="dd-item-label">{children}</span>
      {trailing != null ? trailing : (active && <span className="dd-item-check" style={{width: 14, height: 14}}>{Icon.check}</span>)}
    </button>
  );
}

// ---------- DYNAMIC ISLAND NAV ----------
function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
}

function DynamicIsland({ dark, onToggleDark, page = 'discover', onNavigate = () => {}, savedCount = 0 }) {
  const [live, setLive] = useState({ name: "Temple Coffee", busy: "Moderately busy · 12 min wait" });
  const [idx, setIdx] = useState(0);
  const scrolled = useScrolled(60);
  const messages = [
    { name: "Temple Coffee", busy: "Moderately busy · 12 min wait" },
    { name: "Little Red Fox", busy: "Quiet right now" },
    { name: "Sister Srey", busy: "New review · 5★" },
    { name: "Miss Wong", busy: "Happy hour starts 5pm" },
  ];
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % messages.length;
      setIdx(i);
      setLive(messages[i]);
    }, 4200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="di-wrap">
      <div className={`di ${scrolled ? 'di-compact' : ''}`}>
        <button className="di-logo" onClick={() => onNavigate('discover')} title="Home">
          <span className="di-logo-dot" />
          <span>SRCafe</span>
        </button>
        <nav className="di-nav">
          <button
            className={page === 'discover' ? 'active' : ''}
            onClick={() => onNavigate('discover')}
            aria-label="Discover"
          >
            <span className="di-nav-icon">{Icon.grid}</span>
            <span className="di-nav-label">Discover</span>
          </button>
          <button
            className={page === 'saved' ? 'active' : ''}
            onClick={() => onNavigate('saved')}
            aria-label="Saved"
          >
            <span className="di-nav-icon">{Icon.heart}</span>
            <span className="di-nav-label">Saved</span>
            {savedCount > 0 && <span className="di-count">{savedCount}</span>}
          </button>
          <button
            className={page === 'guides' ? 'active' : ''}
            onClick={() => onNavigate('guides')}
            aria-label="Guides"
          >
            <span className="di-nav-icon">{Icon.list}</span>
            <span className="di-nav-label">Guides</span>
          </button>
        </nav>
        <div className="di-live" key={idx}>
          <span className="di-live-dot" />
          <span><strong style={{fontWeight: 600, color: '#F6F1E8'}}>{live.name}</strong> · {live.busy}</span>
        </div>
        <button className="di-theme" onClick={onToggleDark} title={dark ? 'Light mode' : 'Dark mode'} aria-label="Toggle theme">
          {dark ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>
          )}
        </button>
      </div>
    </div>
  );
}

// ---------- COUNT UP ----------
function CountUp({ end, duration = 1400, suffix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setVal(Math.round(end * eased));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{val}<span style={{color: 'var(--ink-faint)'}}>{suffix}</span></span>;
}

// ---------- HERO ----------
const MORE_FILTERS = [
  { id: "work-friendly", label: "Work-friendly", icon: Icon.wifi },
  { id: "quiet",         label: "Quiet",         icon: Icon.list },
  { id: "outdoor",       label: "Outdoor",       icon: Icon.pin },
  { id: "date night",    label: "Date night",    icon: Icon.heart },
  { id: "brunch",        label: "Brunch",        icon: Icon.clock },
  { id: "books",         label: "Books",         icon: Icon.tag },
];

function Hero({ search, setSearch, filter, setFilter }) {
  const chips = [
    { id: "trending", label: "Trending", icon: Icon.flame },
    { id: "wifi", label: "Fast Wifi", icon: Icon.wifi },
    { id: "cheap", label: "Low Price", icon: Icon.tag },
    { id: "open", label: "Open Now", icon: Icon.clock },
  ];
  return (
    <header className="hero">
      <div className="hero-eyebrow">
        <span className="hero-eyebrow-dot" />
        <span>Siem Reap · 312 cafes indexed</span>
      </div>
      <h1 className="hero-title">
        Every good café in{' '}<br/>Siem Reap, <em>mapped.</em>
      </h1>
      <p className="hero-sub">
        Skip the tripadvisor rabbit hole. Find specialty coffee, 50mbps wifi, and riverside brunch — filtered the way nomads actually search.
      </p>

      <div className="search-wrap">
        <div style={{padding: '0 4px 0 12px', color: 'var(--ink-faint)', display: 'flex'}}>
          <div style={{width: 20, height: 20}}>{Icon.search}</div>
        </div>
        <input
          className="search-input"
          placeholder="Search by name, neighborhood, or vibe…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="search-btn">
          <span className="search-btn-label">Search</span>
          <div style={{width: 16, height: 16}}>{Icon.arrow}</div>
        </button>
      </div>

      <div className="filter-chips">
        {chips.map(c => (
          <button
            key={c.id}
            className={`chip ${filter === c.id ? 'active' : ''}`}
            onClick={() => setFilter(filter === c.id ? null : c.id)}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
              e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
            }}
          >
            {c.icon}
            {c.label}
            {filter === c.id && <div style={{width: 14, height: 14, marginLeft: 2}}>{Icon.x}</div>}
          </button>
        ))}
        <Dropdown
          label="More filters"
          align="left"
          badge={MORE_FILTERS.some(m => m.id === filter) ? 1 : null}
          renderItems={({ close }) => (
            <>
              <div className="dd-section-label">Refine by vibe</div>
              {MORE_FILTERS.map(m => (
                <DropdownItem
                  key={m.id}
                  active={filter === m.id}
                  onClick={() => { setFilter(filter === m.id ? null : m.id); close(); }}
                  icon={m.icon}
                >
                  {m.label}
                </DropdownItem>
              ))}
              {filter && (
                <>
                  <div className="dd-divider"/>
                  <button className="dd-clear" onClick={() => { setFilter(null); close(); }}>
                    Clear filter
                    <div style={{width: 12, height: 12}}>{Icon.x}</div>
                  </button>
                </>
              )}
            </>
          )}
        />
      </div>

      <div className="hero-stats">
        <div>
          <div className="stat-num"><CountUp end={312} /></div>
          <div className="stat-label">Cafés indexed</div>
        </div>
        <div>
          <div className="stat-num"><CountUp end={48} suffix="k" /></div>
          <div className="stat-label">Verified reviews</div>
        </div>
        <div>
          <div className="stat-num">24<span style={{color: 'var(--ink-faint)'}}>/7</span></div>
          <div className="stat-label">Wifi speed-tested</div>
        </div>
        <div>
          <div className="stat-num"><CountUp end={6} /></div>
          <div className="stat-label">Neighborhoods</div>
        </div>
      </div>
    </header>
  );
}

// ---------- CAFE CARD ----------
function WifiMeter({ speed }) {
  const pct = Math.min(100, speed);
  return (
    <span className="card-meta-item" title={`${speed} mbps`}>
      <div style={{width: 13, height: 13, color: 'var(--moss)'}}>{Icon.wifi}</div>
      <div className="wifi-bar"><div className="wifi-bar-fill" style={{width: `${pct}%`}}/></div>
      <span className="mono" style={{fontSize: 11}}>{speed}</span>
    </span>
  );
}
function PriceDots({ price }) {
  const n = price.length;
  return (
    <span className="card-meta-item">
      <span className={n >= 1 ? 'price-on' : 'price-dim'}>$</span>
      <span className={n >= 2 ? 'price-on' : 'price-dim'}>$</span>
      <span className={n >= 3 ? 'price-on' : 'price-dim'}>$</span>
    </span>
  );
}

function CafeCard({ cafe, saved, onSave, onOpen }) {
  return (
    <article className="card" onClick={onOpen}>
      <div className="card-photo">
        <img src={cafe.photo} alt={cafe.name} loading="lazy"/>
        <div className="card-badges">
          {cafe.trending && <span className="badge trending">
            <span style={{color: '#D9B877'}}>●</span> Trending
          </span>}
          {!cafe.open && <span className="badge closed">Closed</span>}
          {cafe.wifi >= 80 && <span className="badge"><div style={{width: 12, height: 12}}>{Icon.wifi}</div> {cafe.wifi}mbps</span>}
        </div>
        <button className={`card-save ${saved ? 'saved' : ''}`} onClick={(e) => { e.stopPropagation(); onSave(cafe.id); }}>
          {Icon.heart}
        </button>
      </div>
      <div className="card-body">
        <div className="card-row">
          <div style={{minWidth: 0}}>
            <h3 className="card-name">{cafe.name}</h3>
            <p className="card-tag">{cafe.tagline}</p>
          </div>
        </div>
        <div className="card-vibes">
          {cafe.vibes.map(v => <span key={v} className="vibe-tag">{v}</span>)}
        </div>
        <div className="card-meta">
          <PriceDots price={cafe.price} />
          <span className="card-meta-sep">·</span>
          <WifiMeter speed={cafe.wifi} />
          <span className="card-meta-sep">·</span>
          <span className="card-meta-item">
            <div style={{width: 12, height: 12}}>{Icon.pin}</div>
            {cafe.distance}km
          </span>
          <span className="card-meta-sep">·</span>
          <span className="card-meta-item" style={{color: cafe.open ? 'var(--moss)' : 'var(--accent)'}}>
            <span style={{width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block'}}/>
            {cafe.open ? 'Open' : 'Closed'}
          </span>
        </div>
      </div>
    </article>
  );
}

// ---------- LIST ROW ----------
function ListRow({ cafe, saved, onSave, onOpen }) {
  return (
    <div className="list-row" onClick={onOpen}>
      <div className="list-photo"><img src={cafe.photo} alt={cafe.name} loading="lazy"/></div>
      <div className="list-body">
        <div className="list-head">
          <h3 className="list-name">{cafe.name}</h3>
          {cafe.trending && <span className="badge trending" style={{fontSize: 10}}>Trending</span>}
        </div>
        <p className="list-tag">{cafe.tagline}</p>
        <div className="list-meta">
          <span className="card-meta-item"><div style={{width: 12, height: 12}}>{Icon.pin}</div>{cafe.distance}km away</span>
          <WifiMeter speed={cafe.wifi} />
          <PriceDots price={cafe.price} />
          <span className="card-meta-item"><div style={{width: 12, height: 12}}>{Icon.clock}</div>{cafe.hours}</span>
          {cafe.vibes.slice(0, 2).map(v => <span key={v} className="vibe-tag">{v}</span>)}
        </div>
      </div>
      <div className="list-signature">"{cafe.signature}"</div>
      <div className="list-actions">
        <button className={`card-save ${saved ? 'saved' : ''}`} style={{position: 'static', marginTop: 4}} onClick={() => onSave(cafe.id)}>
          {Icon.heart}
        </button>
      </div>
    </div>
  );
}

// ---------- MAP ----------
// Tile URLs for light / dark themes
const TILE_LIGHT = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
const TILE_DARK  = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_ATTRIB = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

function useLeafletTheme(mapRef, tileRef) {
  useEffect(() => {
    const swap = () => {
      const map = mapRef.current;
      if (!map || !window.L) return;
      if (tileRef.current) tileRef.current.remove();
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      tileRef.current = window.L.tileLayer(dark ? TILE_DARK : TILE_LIGHT, {
        attribution: TILE_ATTRIB, maxZoom: 19, subdomains: 'abcd',
      }).addTo(map);
    };
    swap();
    const obs = new MutationObserver(swap);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);
}

function MapView({ cafes, saved, onSave, onOpen, compact = false }) {
  const [active, setActive] = useState(cafes[0]?.id ?? null);
  const activeCafe = cafes.find(c => c.id === active);
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const tileRef = useRef(null);
  const markersRef = useRef({});

  // init map once
  useEffect(() => {
    if (!window.L || !containerRef.current || mapRef.current) return;
    const map = window.L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: true,
      zoomSnap: 0.25,
    }).setView([13.3533, 103.858], 14);
    window.L.control.zoom({ position: 'topright' }).addTo(map);
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; tileRef.current = null; markersRef.current = {}; };
  }, []);

  useLeafletTheme(mapRef, tileRef);

  // rebuild markers when cafe list changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !window.L) return;
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};
    const coords = [];
    cafes.forEach(c => {
      if (typeof c.lat !== 'number' || typeof c.lng !== 'number') return;
      const html = `<div class="leaf-pin"><span class="leaf-pin-dot"></span><span class="leaf-pin-label">${c.name.replace(/"/g, '&quot;')}</span></div>`;
      const icon = window.L.divIcon({
        className: 'leaf-pin-wrap',
        html,
        iconSize: [220, 28],
        iconAnchor: [7, 14],
      });
      const marker = window.L.marker([c.lat, c.lng], { icon, riseOnHover: true }).addTo(map);
      marker.on('click', () => {
        setActive(c.id);
        map.panTo([c.lat, c.lng], { animate: true, duration: 0.4 });
      });
      markersRef.current[c.id] = marker;
      coords.push([c.lat, c.lng]);
    });
    if (coords.length > 0) {
      map.fitBounds(coords, { padding: [60, 60], maxZoom: 15, animate: false });
    }
    setTimeout(() => map.invalidateSize(), 80);
  }, [cafes]);

  // reflect active state on markers
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const el = marker.getElement();
      if (!el) return;
      const pin = el.querySelector('.leaf-pin');
      if (!pin) return;
      if (String(active) === id) {
        pin.classList.add('active');
        marker.setZIndexOffset(1000);
      } else {
        pin.classList.remove('active');
        marker.setZIndexOffset(0);
      }
    });
  }, [active, cafes]);

  return (
    <div className={compact ? "split-map" : "map-wrap"}>
      <div ref={containerRef} className="leaf-canvas" />

      {activeCafe && !compact && (
        <div className="map-peek" key={activeCafe.id}>
          <div className="map-peek-photo"><img src={activeCafe.photo} alt=""/></div>
          <div className="map-peek-body">
            <h4 className="card-name" style={{fontSize: 22}}>{activeCafe.name}</h4>
            <p className="card-tag">{activeCafe.tagline}</p>
            <div className="card-meta" style={{marginTop: 10, paddingTop: 10}}>
              <PriceDots price={activeCafe.price} />
              <span className="card-meta-sep">·</span>
              <WifiMeter speed={activeCafe.wifi} />
              <span className="card-meta-sep">·</span>
              <span className="card-meta-item"><div style={{width: 12, height: 12}}>{Icon.pin}</div>{activeCafe.distance}km</span>
            </div>
            <button
              className="search-btn"
              style={{marginTop: 12, width: '100%', justifyContent: 'center', padding: '10px 16px', fontSize: 13}}
              onClick={() => onOpen && onOpen(activeCafe.id)}
            >
              View details
              <div style={{width: 14, height: 14}}>{Icon.arrow}</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- SPLIT VIEW ----------
function SplitView({ cafes, saved, onSave, onOpen }) {
  const [active, setActive] = useState(cafes[0]?.id ?? null);
  return (
    <div className="split">
      <div className="split-list">
        {cafes.map(c => (
          <div
            key={c.id}
            className={`split-card ${active === c.id ? 'active' : ''}`}
            onClick={() => { setActive(c.id); if (onOpen) onOpen(c.id); }}
          >
            <div className="split-card-photo"><img src={c.photo} alt={c.name} loading="lazy"/></div>
            <div style={{padding: '4px 6px 4px 0', display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0}}>
              <div>
                <h4 className="card-name" style={{fontSize: 20}}>{c.name}</h4>
                <p className="card-tag" style={{fontSize: 12, marginTop: 2}}>{c.tagline}</p>
              </div>
              <div style={{display: 'flex', gap: 10, fontSize: 11, color: 'var(--ink-soft)', alignItems: 'center', flexWrap: 'wrap'}}>
                <PriceDots price={c.price} />
                <span className="card-meta-sep">·</span>
                <span className="card-meta-item"><div style={{width: 10, height: 10}}>{Icon.pin}</div>{c.distance}km</span>
                <span className="card-meta-sep">·</span>
                <WifiMeter speed={c.wifi} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <MapView cafes={cafes} saved={saved} onSave={onSave} onOpen={onOpen} compact />
    </div>
  );
}

// ---------- TWEAKS ----------
function Tweaks({ open, tweaks, setTweaks, onClose }) {
  if (!open) return null;
  const accents = [
    { id: 'terracotta', val: '#C2502B' },
    { id: 'moss', val: '#4F6B4A' },
    { id: 'sand', val: '#C79A3D' },
    { id: 'ink', val: '#1B1814' },
    { id: 'plum', val: '#6E3A5C' },
  ];
  return (
    <div className="tweaks">
      <div className="tweaks-title">
        <span>Tweaks</span>
        <button onClick={onClose} style={{width: 24, height: 24, borderRadius: 6, color: 'var(--ink-soft)'}}>
          <div style={{width: 14, height: 14, margin: 'auto'}}>{Icon.x}</div>
        </button>
      </div>
      <div className="tweak-row">
        <span className="tweak-label">Accent</span>
        <div className="tweak-swatches">
          {accents.map(a => (
            <button
              key={a.id}
              className={`swatch ${tweaks.accent === a.val ? 'active' : ''}`}
              style={{background: a.val}}
              onClick={() => setTweaks({...tweaks, accent: a.val})}
            />
          ))}
        </div>
      </div>
      <div className="tweak-row">
        <span className="tweak-label">Dark mode</span>
        <div className={`toggle ${tweaks.dark ? 'on' : ''}`} onClick={() => setTweaks({...tweaks, dark: !tweaks.dark})}/>
      </div>
      <div className="tweak-row">
        <span className="tweak-label">Show live status</span>
        <div className={`toggle ${tweaks.live ? 'on' : ''}`} onClick={() => setTweaks({...tweaks, live: !tweaks.live})}/>
      </div>
      <div className="tweak-row">
        <span className="tweak-label">Card density</span>
        <div style={{display: 'flex', gap: 4, background: 'var(--bg)', borderRadius: 8, padding: 2}}>
          {['cozy','comfy','roomy'].map(d => (
            <button
              key={d}
              onClick={() => setTweaks({...tweaks, density: d})}
              style={{
                padding: '4px 10px', borderRadius: 6,
                background: tweaks.density === d ? 'var(--ink)' : 'transparent',
                color: tweaks.density === d ? 'var(--bg)' : 'var(--ink-soft)',
                fontSize: 11, fontWeight: 500,
              }}
            >{d}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- SAVED PAGE ----------
function SavedPage({ cafes, saved, onSave, onOpen, onDiscover }) {
  const empty = cafes.length === 0;
  return (
    <section className="page page-saved">
      <header className="page-head reveal">
        <div className="hero-eyebrow">
          <span className="hero-eyebrow-dot" />
          <span>Your list · {cafes.length} {cafes.length === 1 ? 'café' : 'cafés'}</span>
        </div>
        <h1 className="page-title">
          {empty ? (<>Nothing saved.<br/><em>Yet.</em></>) : (<>Kept for <em>later</em>.</>)}
        </h1>
        <p className="page-sub">
          {empty
            ? 'Tap the heart on any café and it will land here. A quiet corner for the ones you want to circle back to.'
            : 'A private reading list of cafés you flagged. Re-open a card to see hours, signature drinks, and the wifi you remembered liking.'}
        </p>
      </header>

      {empty ? (
        <div className="saved-empty reveal">
          <div className="saved-empty-mark" aria-hidden>
            <svg viewBox="0 0 120 120" width="120" height="120" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M60 102s-34-20-42-46a20 20 0 0 1 42-12 20 20 0 0 1 42 12c-8 26-42 46-42 46Z"/>
            </svg>
            <span className="saved-empty-tag mono">0 cafés</span>
          </div>
          <div className="saved-empty-rule"/>
          <button className="btn-pill" onClick={onDiscover}>
            Start browsing
            <div style={{width: 14, height: 14}}>{Icon.arrow}</div>
          </button>
        </div>
      ) : (
        <div className="grid reveal">
          {cafes.map(c => (
            <CafeCard key={c.id} cafe={c} saved={saved.has(c.id)} onSave={onSave} onOpen={() => onOpen(c.id)} />
          ))}
        </div>
      )}
    </section>
  );
}

// ---------- GUIDES INDEX ----------
function GuidesPage({ guides, onOpenGuide }) {
  return (
    <section className="page page-guides">
      <header className="page-head reveal">
        <div className="hero-eyebrow">
          <span className="hero-eyebrow-dot" />
          <span>Volume 1 · MMXXVI</span>
        </div>
        <h1 className="page-title">
          The café <em>atlas</em>.
        </h1>
        <p className="page-sub">
          Three curated routes through Siem Reap — one for heads-down work, one for the river brunch ritual, one for the $2 coffee kind of day.
        </p>
      </header>

      <div className="guide-grid">
        {guides.map((g, i) => (
          <button
            key={g.id}
            className="guide-card reveal"
            style={{'--guide-tint': g.color}}
            onClick={() => onOpenGuide(g.id)}
          >
            <span className="guide-num mono">{String(i + 1).padStart(2, '0')}</span>
            <div className="guide-cover">
              <img src={g.cover} alt={g.title} loading="lazy"/>
              <div className="guide-cover-veil" />
            </div>
            <div className="guide-meta">
              <span className="guide-kicker mono">{g.kicker}</span>
              <h3 className="guide-title">{g.title}</h3>
              <p className="guide-sub">{g.subtitle}</p>
              <div className="guide-foot">
                <span>{g.cafeIds.length} cafés</span>
                <span className="guide-arrow" style={{width: 16, height: 16}}>{Icon.arrow}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

// ---------- GUIDE DETAIL ----------
function GuideDetail({ guide, saved, onSave, onOpen, onBack, onOpenGuide }) {
  const cafes = guide.cafeIds.map(id => window.CAFES.find(c => c.id === id)).filter(Boolean);
  const others = (window.GUIDES || []).filter(g => g.id !== guide.id);
  return (
    <section className="page page-guide-detail" style={{'--guide-tint': guide.color}}>
      <div className="detail-breadcrumb reveal">
        <button onClick={onBack} className="dp-back">
          <div style={{width: 14, height: 14, transform: 'rotate(180deg)'}}>{Icon.arrow}</div>
          All guides
        </button>
        <div className="dp-breadcrumb-trail">
          <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>Guides</a> <span>/</span> <strong>{guide.title}</strong>
        </div>
      </div>

      <div className="gd-hero reveal">
        <div className="gd-hero-cover">
          <img src={guide.cover} alt={guide.title} />
          <div className="gd-hero-veil" />
        </div>
        <div className="gd-hero-copy">
          <span className="guide-kicker mono">{guide.kicker}</span>
          <h1 className="gd-title">{guide.title}</h1>
          <p className="gd-lead serif">{guide.subtitle}</p>
        </div>
      </div>

      <div className="gd-body">
        <aside className="gd-note reveal">
          <span className="gd-note-label mono">Editor&apos;s note</span>
          <p>{guide.body}</p>
        </aside>

        <ol className="gd-list">
          {cafes.map((c, i) => (
            <li key={c.id} className="gd-row reveal" onClick={() => onOpen(c.id)}>
              <span className="gd-row-num serif">{String(i + 1).padStart(2, '0')}</span>
              <div className="gd-row-photo">
                <img src={c.photo} alt={c.name} loading="lazy"/>
                <button
                  className={`card-save ${saved.has(c.id) ? 'saved' : ''}`}
                  onClick={(e) => { e.stopPropagation(); onSave(c.id); }}
                  aria-label="Save"
                >
                  {Icon.heart}
                </button>
              </div>
              <div className="gd-row-body">
                <h3 className="gd-row-name serif">{c.name}</h3>
                <p className="gd-row-tag">{c.tagline}</p>
                <p className="gd-row-sig">&ldquo;{c.signature}&rdquo;</p>
                <div className="gd-row-meta">
                  <span><div style={{width: 12, height: 12}}>{Icon.pin}</div>{c.distance}km</span>
                  <span><div style={{width: 12, height: 12}}>{Icon.wifi}</div>{c.wifi} mbps</span>
                  <span>{c.price}</span>
                  <span style={{color: c.open ? 'var(--moss)' : 'var(--accent)'}}>
                    {c.open ? 'Open now' : 'Closed'}
                  </span>
                </div>
              </div>
              <div className="gd-row-go" style={{width: 16, height: 16}}>{Icon.arrow}</div>
            </li>
          ))}
        </ol>
      </div>

      {others.length > 0 && (
        <div className="gd-more reveal">
          <div className="gd-more-head">
            <span className="hero-eyebrow-dot" />
            <span className="mono" style={{fontSize: 12, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-soft)'}}>Keep reading</span>
          </div>
          <div className="gd-more-grid">
            {others.map(g => (
              <button key={g.id} className="gd-more-card" onClick={() => onOpenGuide(g.id)}>
                <div className="gd-more-cover"><img src={g.cover} alt={g.title} loading="lazy"/></div>
                <div>
                  <span className="guide-kicker mono">{g.kicker}</span>
                  <h4 className="serif" style={{fontSize: 28, lineHeight: 1, marginTop: 6, letterSpacing: '-.01em'}}>{g.title}</h4>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

Object.assign(window, {
  Icon, DynamicIsland, Hero, CafeCard, ListRow, MapView, SplitView, Tweaks,
  SavedPage, GuidesPage, GuideDetail, Dropdown, DropdownItem
});
