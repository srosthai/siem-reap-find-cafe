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

function DynamicIsland({ dark, onToggleDark }) {
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
        <div className="di-logo">
          <span className="di-logo-dot" />
          <span>SRCafe</span>
        </div>
        {!scrolled && <nav className="di-nav">
          <a href="#" className="active">Discover</a>
          <a href="#">Saved</a>
          <a href="#">Guides</a>
        </nav>}
        <div className="di-live" key={idx}>
          <span className="di-live-dot" />
          <span><strong style={{fontWeight: 600, color: '#F6F1E8'}}>{live.name}</strong> · {live.busy}</span>
        </div>
        {!scrolled && (
          <button className="di-theme" onClick={onToggleDark} title={dark ? 'Light mode' : 'Dark mode'}>
            {dark ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>
            )}
          </button>
        )}
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
        Every good café in<br/>
        Siem Reap, <em>mapped.</em>
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
          Search
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
        <button className="chip" style={{color: 'var(--ink-faint)'}}>
          More filters
          <div style={{width: 12, height: 12}}>{Icon.chevron}</div>
        </button>
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
          <div className="card-rating">
            <div style={{width: 14, height: 14}}>{Icon.star}</div>
            {cafe.rating}
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
        <div className="list-rating-big">{cafe.rating}</div>
        <div className="list-rating-sub">{cafe.reviews.toLocaleString()} reviews</div>
        <button className={`card-save ${saved ? 'saved' : ''}`} style={{position: 'static', marginTop: 4}} onClick={() => onSave(cafe.id)}>
          {Icon.heart}
        </button>
      </div>
    </div>
  );
}

// ---------- MAP ----------
function MapView({ cafes, saved, onSave, compact = false }) {
  const [active, setActive] = useState(cafes[0]?.id ?? null);
  const activeCafe = cafes.find(c => c.id === active);

  return (
    <div className={compact ? "split-map" : "map-wrap"} style={compact ? {height: '100%'} : {}}>
      <div className="map-canvas" />
      <div className="map-grid" />
      <div className="map-river" />
      {/* roads */}
      <div className="map-road" style={{top: '30%', left: '10%', right: '10%', height: 3}}/>
      <div className="map-road" style={{top: '65%', left: '5%', right: '20%', height: 3, transform: 'rotate(-2deg)'}}/>
      <div className="map-road" style={{top: '15%', bottom: '15%', left: '60%', width: 3, transform: 'rotate(4deg)'}}/>

      {/* labels */}
      <div className="map-label" style={{top: '12%', left: '15%'}}>Pub Street</div>
      <div className="map-label" style={{top: '55%', left: '70%'}}>Wat Bo</div>
      <div className="map-label" style={{top: '78%', left: '20%'}}>Kingdom Rd</div>
      <div className="map-label" style={{top: '35%', left: '40%'}}>Siem Reap River →</div>

      {/* pins */}
      {cafes.map(c => (
        <div
          key={c.id}
          className={`map-pin ${active === c.id ? 'active' : ''}`}
          style={{ left: `${c.lng}%`, top: `${c.lat}%` }}
          onClick={() => setActive(c.id)}
        >
          <div className="map-pin-body">
            <span className="map-pin-dot" />
            {c.name.split(' ').slice(0, 2).join(' ')}
          </div>
        </div>
      ))}

      {/* controls */}
      <div className="map-controls">
        <button>+</button>
        <button>−</button>
      </div>

      {/* peek */}
      {activeCafe && !compact && (
        <div className="map-peek" key={activeCafe.id}>
          <div className="map-peek-photo"><img src={activeCafe.photo} alt=""/></div>
          <div className="map-peek-body">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
              <h4 className="card-name" style={{fontSize: 22}}>{activeCafe.name}</h4>
              <div className="card-rating"><div style={{width: 14, height: 14}}>{Icon.star}</div>{activeCafe.rating}</div>
            </div>
            <p className="card-tag">{activeCafe.tagline}</p>
            <div className="card-meta" style={{marginTop: 10, paddingTop: 10}}>
              <PriceDots price={activeCafe.price} />
              <span className="card-meta-sep">·</span>
              <WifiMeter speed={activeCafe.wifi} />
              <span className="card-meta-sep">·</span>
              <span className="card-meta-item"><div style={{width: 12, height: 12}}>{Icon.pin}</div>{activeCafe.distance}km</span>
            </div>
            <button className="search-btn" style={{marginTop: 12, width: '100%', justifyContent: 'center', padding: '10px 16px', fontSize: 13}}>
              View details
              <div style={{width: 14, height: 14}}>{Icon.arrow}</div>
            </button>
          </div>
        </div>
      )}

      {/* attribution */}
      <div style={{position: 'absolute', bottom: 8, right: 8, fontSize: 10, color: 'rgba(27,24,20,.35)', fontFamily: 'Geist Mono'}}>
        SRCafe Maps · © OpenStreet-ish
      </div>
    </div>
  );
}

// ---------- SPLIT VIEW ----------
function SplitView({ cafes, saved, onSave }) {
  const [active, setActive] = useState(cafes[0]?.id ?? null);
  return (
    <div className="split">
      <div className="split-list">
        {cafes.map(c => (
          <div
            key={c.id}
            className={`split-card ${active === c.id ? 'active' : ''}`}
            onClick={() => setActive(c.id)}
          >
            <div className="split-card-photo"><img src={c.photo} alt={c.name} loading="lazy"/></div>
            <div style={{padding: '4px 6px 4px 0', display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0}}>
              <div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8}}>
                  <h4 className="card-name" style={{fontSize: 20}}>{c.name}</h4>
                  <div className="card-rating" style={{fontSize: 13}}>
                    <div style={{width: 12, height: 12}}>{Icon.star}</div>{c.rating}
                  </div>
                </div>
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
      <MapView cafes={cafes} saved={saved} onSave={onSave} compact />
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

Object.assign(window, {
  Icon, DynamicIsland, Hero, CafeCard, ListRow, MapView, SplitView, Tweaks
});
