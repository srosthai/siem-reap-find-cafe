// SRCafe main app
const { useState, useEffect, useMemo } = React;

function App() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(null);
  const [view, setView] = useState(() => localStorage.getItem('srcafe-view') || 'grid');
  const [sort, setSort] = useState('trending');
  const [saved, setSaved] = useState(new Set());
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [detailId, setDetailId] = useState(() => {
    const id = parseInt(localStorage.getItem('srcafe-detail'));
    return Number.isFinite(id) && id > 0 ? id : null;
  });
  const [tweaks, setTweaks] = useState(() => {
    const saved = localStorage.getItem('srcafe-tweaks');
    return saved ? JSON.parse(saved) : { accent: '#C2502B', dark: false, live: true, density: 'comfy' };
  });

  useEffect(() => localStorage.setItem('srcafe-view', view), [view]);
  useEffect(() => localStorage.setItem('srcafe-tweaks', JSON.stringify(tweaks)), [tweaks]);
  useEffect(() => {
    if (detailId) localStorage.setItem('srcafe-detail', String(detailId));
    else localStorage.removeItem('srcafe-detail');
  }, [detailId]);

  // scroll-reveal observer
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [view, filter, search]);

  // apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tweaks.dark ? 'dark' : 'light');
    document.documentElement.style.setProperty('--accent', tweaks.accent);
  }, [tweaks]);

  // tweaks protocol
  useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({type: '__edit_mode_available'}, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const onSave = (id) => {
    setSaved(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    let list = [...window.CAFES];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.tagline.toLowerCase().includes(q) || c.vibes.some(v => v.toLowerCase().includes(q)));
    }
    if (filter === 'trending') list = list.filter(c => c.trending);
    if (filter === 'wifi') list = list.filter(c => c.wifi >= 70);
    if (filter === 'cheap') list = list.filter(c => c.cheap);
    if (filter === 'open') list = list.filter(c => c.open);

    if (sort === 'trending') list.sort((a,b) => b.rating - a.rating);
    if (sort === 'distance') list.sort((a,b) => a.distance - b.distance);
    if (sort === 'wifi') list.sort((a,b) => b.wifi - a.wifi);
    if (sort === 'price') list.sort((a,b) => a.price.length - b.price.length);
    return list;
  }, [search, filter, sort]);

  const views = [
    { id: 'grid', label: 'Grid', icon: Icon.grid },
    { id: 'list', label: 'List', icon: Icon.list },
    { id: 'map', label: 'Map', icon: Icon.map },
    { id: 'split', label: 'Split', icon: Icon.split },
  ];

  return (
    <>
      <DynamicIsland dark={tweaks.dark} onToggleDark={() => setTweaks({...tweaks, dark: !tweaks.dark})} />
      {detailId ? (
        <DetailPage
          cafe={window.CAFES.find(c => c.id === detailId) || window.CAFES[0]}
          onBack={() => setDetailId(null)}
          onNav={(dir) => {
            const ids = window.CAFES.map(c => c.id);
            const i = ids.indexOf(detailId);
            const next = ids[(i + dir + ids.length) % ids.length];
            setDetailId(next);
          }}
        />
      ) : (
      <>
      <Hero search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} />

      <section className="results reveal">
        <div className="results-head">
          <div>
            <h2 className="results-title">
              {filter === 'trending' ? 'Trending this week' :
               filter === 'wifi' ? 'Fast wifi spots' :
               filter === 'cheap' ? 'Easy on the wallet' :
               filter === 'open' ? 'Open right now' :
               'All cafes'}
            </h2>
            <p className="results-count">
              {filtered.length} {filtered.length === 1 ? 'café' : 'cafés'} · sorted by {sort}
            </p>
          </div>
          <div className="results-controls">
            <button className="sort-select" onClick={() => {
              const opts = ['trending','distance','wifi','price'];
              setSort(opts[(opts.indexOf(sort) + 1) % opts.length]);
            }}>
              Sort: {sort}
              <div style={{width: 14, height: 14}}>{Icon.chevron}</div>
            </button>
            <div className="view-toggle">
              {views.map(v => (
                <button
                  key={v.id}
                  className={view === v.id ? 'active' : ''}
                  onClick={() => setView(v.id)}
                >
                  {v.icon}
                  <span style={{display: view === v.id ? 'inline' : 'none'}}>{v.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {view === 'grid' && (
          <div className="grid">
            {filtered.map(c => <CafeCard key={c.id} cafe={c} saved={saved.has(c.id)} onSave={onSave} onOpen={() => setDetailId(c.id)}/>)}
          </div>
        )}
        {view === 'list' && (
          <div className="list">
            {filtered.map(c => <ListRow key={c.id} cafe={c} saved={saved.has(c.id)} onSave={onSave} onOpen={() => setDetailId(c.id)}/>)}
          </div>
        )}
        {view === 'map' && <MapView cafes={filtered} saved={saved} onSave={onSave} />}
        {view === 'split' && <SplitView cafes={filtered} saved={saved} onSave={onSave} />}

        {filtered.length === 0 && (
          <div style={{padding: '80px 20px', textAlign: 'center', color: 'var(--ink-soft)'}}>
            <div className="serif" style={{fontSize: 40, marginBottom: 8}}>No matches.</div>
            <p>Try clearing a filter, or search a different neighborhood.</p>
          </div>
        )}
      </section>

      <footer style={{borderTop: '1px solid var(--line)', padding: '40px 32px', maxWidth: 1440, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, color: 'var(--ink-soft)', fontSize: 13}}>
        <div className="serif" style={{fontSize: 24, color: 'var(--ink)'}}>SRCafe</div>
        <div style={{display: 'flex', gap: 24}}>
          <a href="#">Add your café</a>
          <a href="#">Guides</a>
          <a href="#">About</a>
          <a href="#">hello@srcafe.com</a>
        </div>
        <div className="mono" style={{fontSize: 11}}>Siem Reap, Cambodia · MMXXVI</div>
      </footer>

      <Tweaks open={tweaksOpen} tweaks={/*EDITMODE-BEGIN*/tweaks/*EDITMODE-END*/} setTweaks={setTweaks} onClose={() => setTweaksOpen(false)} />
      </>
      )}
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
