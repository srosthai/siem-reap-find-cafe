// Detail page components
const { useState: useStateD, useEffect: useEffectD, useMemo: useMemoD, useRef: useRefD } = React;

function MiniMap({ cafe }) {
  const ref = useRefD(null);
  const mapRef = useRefD(null);
  const tileRef = useRefD(null);

  useEffectD(() => {
    if (!window.L || !ref.current || mapRef.current) return;
    const map = window.L.map(ref.current, {
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: false,
      dragging: true,
      doubleClickZoom: true,
    }).setView([cafe.lat, cafe.lng], 15);
    window.L.control.zoom({ position: 'topright' }).addTo(map);
    const setTiles = () => {
      if (tileRef.current) tileRef.current.remove();
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      tileRef.current = window.L.tileLayer(
        dark
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        { attribution: '&copy; OSM &copy; CARTO', maxZoom: 19, subdomains: 'abcd' }
      ).addTo(map);
    };
    setTiles();
    const iconHtml = `<div class="leaf-pin active"><span class="leaf-pin-dot"></span><span class="leaf-pin-label">${cafe.name.replace(/"/g, '&quot;')}</span></div>`;
    const icon = window.L.divIcon({
      className: 'leaf-pin-wrap',
      html: iconHtml,
      iconSize: [220, 28],
      iconAnchor: [7, 14],
    });
    window.L.marker([cafe.lat, cafe.lng], { icon }).addTo(map);
    const obs = new MutationObserver(setTiles);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 80);
    return () => { obs.disconnect(); map.remove(); mapRef.current = null; tileRef.current = null; };
  }, [cafe.id]);

  return <div ref={ref} className="leaf-canvas" />;
}

function DetailPage({ cafe, onBack, onNav }) {
  const d = window.CAFE_DETAILS[cafe.id] || {};
  const [activePhoto, setActivePhoto] = useStateD(0);
  const [lightbox, setLightbox] = useStateD(null);
  const [saved, setSaved] = useStateD(false);

  useEffectD(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [cafe.id]);

  const similar = window.CAFES.filter(c => c.id !== cafe.id).slice(0, 3);
  const today = new Date().getDay(); // 0=Sun
  const todayIdx = today === 0 ? 6 : today - 1;
  const maxBusy = Math.max(...(d.busyHours || [5]));
  const currentHour = new Date().getHours();
  const currentBucket = Math.min(11, Math.max(0, Math.floor((currentHour - 8) / 1.5)));

  return (
    <div className="detail">
      {/* breadcrumb */}
      <div className="detail-breadcrumb reveal">
        <button onClick={onBack} className="dp-back">
          <div style={{width: 14, height: 14, transform: 'rotate(180deg)'}}>{Icon.arrow}</div>
          Back to results
        </button>
        <div className="dp-breadcrumb-trail">
          <a href="#">Discover</a> <span>/</span> <a href="#">Siem Reap</a> <span>/</span> <strong>{cafe.name}</strong>
        </div>
        <div className="dp-nav">
          <button onClick={() => onNav(-1)} title="Previous">
            <div style={{width: 14, height: 14, transform: 'rotate(180deg)'}}>{Icon.arrow}</div>
          </button>
          <button onClick={() => onNav(1)} title="Next">
            <div style={{width: 14, height: 14}}>{Icon.arrow}</div>
          </button>
        </div>
      </div>

      {/* collage hero */}
      <div className="dp-collage reveal">
        <div className="dp-tile dp-tile-hero" onClick={() => setLightbox(0)}>
          <img src={d.gallery?.[0] || cafe.photo} alt={cafe.name}/>
          {cafe.trending && <span className="badge trending" style={{position: 'absolute', top: 16, left: 16, fontSize: 11}}>
            <span style={{color: '#D9B877'}}>●</span> Trending
          </span>}
        </div>
        <div className="dp-tile" onClick={() => setLightbox(1)}><img src={d.gallery?.[1]} alt=""/></div>
        <div className="dp-tile" onClick={() => setLightbox(2)}><img src={d.gallery?.[2]} alt=""/></div>
        <div className="dp-tile" onClick={() => setLightbox(3)}><img src={d.gallery?.[3]} alt=""/></div>
        <div className="dp-tile dp-tile-more" onClick={() => setLightbox(4)}>
          <img src={d.gallery?.[4]} alt=""/>
          <div className="dp-tile-more-overlay">
            <span>+{(d.gallery?.length || 5) + 8} photos</span>
          </div>
        </div>
      </div>

      {/* title + meta bar */}
      <div className="dp-header reveal">
        <div>
          <div className="dp-vibes">
            {cafe.vibes.map(v => <span key={v} className="vibe-tag">{v}</span>)}
          </div>
          <h1 className="dp-title">{cafe.name}</h1>
          <p className="dp-tagline">{cafe.tagline}</p>
          <div className="dp-metarow">
            <PriceDots price={cafe.price} />
            <span className="dp-dot">·</span>
            <span className="card-meta-item"><div style={{width: 14, height: 14}}>{Icon.pin}</div>{d.address}</span>
            <span className="dp-dot">·</span>
            <span className="card-meta-item" style={{color: cafe.open ? 'var(--moss)' : 'var(--accent)'}}>
              <span style={{width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block'}}/>
              {cafe.open ? 'Open now' : 'Closed'} · {cafe.hours}
            </span>
          </div>
        </div>
      </div>

      {/* two-col */}
      <div className="dp-grid">
        <div className="dp-main">
          {/* About */}
          <section className="dp-section reveal">
            <h2 className="dp-h2">About</h2>
            <p className="dp-body">{d.about}</p>
          </section>

          {/* Live status */}
          <section className="dp-section reveal">
            <h2 className="dp-h2">Live right now</h2>
            <div className="dp-live-grid">
              <div className="dp-live-card">
                <div className="dp-live-label">Wifi speed</div>
                <div className="dp-live-value">{cafe.wifi}<span className="dp-live-unit">mbps</span></div>
                <div className="wifi-bar" style={{width: '100%', height: 6, marginTop: 8}}>
                  <div className="wifi-bar-fill" style={{width: `${cafe.wifi}%`, transition: 'width 1.2s cubic-bezier(.34,1.4,.64,1)'}}/>
                </div>
                <div className="dp-live-sub">Tested 14 min ago</div>
              </div>
              <div className="dp-live-card">
                <div className="dp-live-label">How busy</div>
                <div className="dp-live-value" style={{color: (d.busyHours?.[currentBucket] || 0) > 6 ? 'var(--accent)' : 'var(--moss)'}}>
                  {(d.busyHours?.[currentBucket] || 0) > 6 ? 'Busy' : (d.busyHours?.[currentBucket] || 0) > 3 ? 'Moderate' : 'Quiet'}
                </div>
                <div className="dp-busy-chart">
                  {(d.busyHours || []).map((h, i) => (
                    <div key={i} className={`dp-busy-bar ${i === currentBucket ? 'now' : ''}`}>
                      <div className="dp-busy-bar-fill" style={{height: `${(h/maxBusy)*100}%`, transitionDelay: `${i*40}ms`}}/>
                    </div>
                  ))}
                </div>
                <div className="dp-busy-axis"><span>8am</span><span>12pm</span><span>5pm</span><span>10pm</span></div>
              </div>
              <div className="dp-live-card">
                <div className="dp-live-label">Avg wait</div>
                <div className="dp-live-value">~{Math.round(cafe.wifi < 60 ? 2 : cafe.trending ? 12 : 5)}<span className="dp-live-unit">min</span></div>
                <div className="dp-live-sub">For a seat right now</div>
              </div>
            </div>
          </section>

          {/* Menu */}
          <section className="dp-section reveal">
            <h2 className="dp-h2">Menu highlights</h2>
            <div className="dp-menu">
              {(d.menu || []).map((item, i) => (
                <div key={i} className="dp-menu-item">
                  <div className="dp-menu-row">
                    <h3 className="dp-menu-name">{item.name}</h3>
                    <span className="dp-menu-dots" aria-hidden/>
                    <span className="dp-menu-price">{item.price}</span>
                  </div>
                  <p className="dp-menu-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Amenities */}
          <section className="dp-section reveal">
            <h2 className="dp-h2">Amenities</h2>
            <div className="dp-amenities">
              {(d.amenities || []).map(a => (
                <div key={a} className="dp-amenity">
                  <div className="dp-amenity-check">
                    <div style={{width: 12, height: 12}}>{Icon.check}</div>
                  </div>
                  {a}
                </div>
              ))}
            </div>
          </section>

          {/* Location */}
          <section className="dp-section reveal">
            <h2 className="dp-h2">Location</h2>
            <div className="dp-map-block">
              <div className="dp-minimap">
                <MiniMap cafe={cafe} />
              </div>
              <div className="dp-location-info">
                <div className="dp-li-label">Address</div>
                <div className="dp-li-value">{d.address}</div>
                <div className="dp-li-label" style={{marginTop: 16}}>Phone</div>
                <div className="dp-li-value">{d.phone}</div>
                <div className="dp-li-label" style={{marginTop: 16}}>Getting there</div>
                <div className="dp-li-value" style={{fontSize: 13, color: 'var(--ink-soft)'}}>{cafe.distance}km from Old Market · ~{Math.round(cafe.distance * 4)} min by tuk-tuk</div>
                <button className="search-btn" style={{marginTop: 20, width: '100%', justifyContent: 'center'}}>
                  Get directions
                  <div style={{width: 14, height: 14}}>{Icon.arrow}</div>
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* sticky sidebar */}
        <aside className="dp-sidebar">
          <div className="dp-sidebar-card">
            <div className="dp-sidebar-price">
              <span className="dp-sidebar-price-num">{cafe.price}</span>
              <span className="dp-sidebar-price-label">average spend</span>
            </div>
            <div className="dp-sidebar-actions">
              <button className="search-btn" style={{width: '100%', justifyContent: 'center', padding: '14px 16px'}}>
                Reserve a table
                <div style={{width: 14, height: 14}}>{Icon.arrow}</div>
              </button>
              <div className="dp-sidebar-row">
                <button className={`dp-sidebar-btn ${saved ? 'saved' : ''}`} onClick={() => setSaved(!saved)}>
                  <div style={{width: 16, height: 16}}>{Icon.heart}</div>
                  {saved ? 'Saved' : 'Save'}
                </button>
                <button className="dp-sidebar-btn">
                  <div style={{width: 16, height: 16}}>{Icon.pin}</div>
                  Directions
                </button>
                <button className="dp-sidebar-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{width: 16, height: 16}}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>
                  Share
                </button>
              </div>
            </div>

            <div className="dp-sidebar-divider"/>

            <div className="dp-hours">
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10}}>
                <strong>Opening hours</strong>
                <span style={{color: cafe.open ? 'var(--moss)' : 'var(--accent)', fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6}}>
                  <span style={{width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block'}}/>
                  {cafe.open ? 'Open' : 'Closed'}
                </span>
              </div>
              {(d.weeklyHours || []).map(([day, h], i) => (
                <div key={day} className={`dp-hour-row ${i === todayIdx ? 'today' : ''}`}>
                  <span>{day}{i === todayIdx ? ' · today' : ''}</span>
                  <span className="mono">{h}</span>
                </div>
              ))}
            </div>

            <div className="dp-sidebar-divider"/>

            <div className="dp-signature-box">
              <div className="dp-li-label">Signature</div>
              <div className="serif" style={{fontSize: 22, marginTop: 4, lineHeight: 1.2}}>"{cafe.signature}"</div>
            </div>
          </div>
        </aside>
      </div>

      {/* Similar */}
      <section className="dp-section reveal dp-similar">
        <div className="dp-similar-head">
          <h2 className="dp-h2" style={{margin: 0}}>You might also like</h2>
          <a href="#" className="dp-link">Browse all →</a>
        </div>
        <div className="grid dp-similar-grid">
          {similar.map(c => <CafeCard key={c.id} cafe={c} saved={false} onSave={()=>{}} />)}
        </div>
      </section>

      {/* lightbox */}
      {lightbox !== null && (
        <div className="dp-lightbox" onClick={() => setLightbox(null)}>
          <button className="dp-lightbox-close" onClick={() => setLightbox(null)}>
            <div style={{width: 20, height: 20}}>{Icon.x}</div>
          </button>
          <img src={d.gallery?.[lightbox]} alt="" onClick={e => e.stopPropagation()}/>
          <div className="dp-lightbox-nav">
            <button onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + d.gallery.length) % d.gallery.length); }}>
              <div style={{width: 16, height: 16, transform: 'rotate(180deg)'}}>{Icon.arrow}</div>
            </button>
            <span className="mono">{lightbox + 1} / {d.gallery?.length || 1}</span>
            <button onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % d.gallery.length); }}>
              <div style={{width: 16, height: 16}}>{Icon.arrow}</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

window.DetailPage = DetailPage;
