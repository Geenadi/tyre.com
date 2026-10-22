import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import TyreCard from '../components/TyreCard.jsx';
import Icon from '../components/Icon.jsx';
import { api } from '../api.js';
import { useCart } from '../context/CartContext.jsx';

const SORTS = [
  { value: 'popular', label: 'Most popular' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Highest rated' },
];

const PARAM_KEYS = ['width', 'profile', 'rim', 'size', 'brand', 'category', 'terrain', 'q', 'minPrice', 'maxPrice', 'onSale', 'inStock', 'sort'];

function FacetGroup({ title, name, options, selected, onToggle }) {
  if (!options.length) return null;
  return (
    <fieldset className="facet">
      <legend>{title}</legend>
      {options.map((o) => (
        <label key={o.value} className="check">
          <input type="checkbox" checked={selected.includes(o.value)} onChange={() => onToggle(name, o.value)} />
          <span>{o.label || o.value}</span>
          <span className="facet-count">{o.count}</span>
        </label>
      ))}
    </fieldset>
  );
}

export default function Tyres() {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { vehicle, setVehicle } = useCart();

  const query = Object.fromEntries(PARAM_KEYS.map((k) => [k, params.get(k) || undefined]));
  const key = params.toString();

  useEffect(() => {
    let live = true;
    setError(null);
    api.tyres(query)
      .then((r) => live && setData(r))
      .catch((e) => live && setError(e.message));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const selected = (name) => (params.get(name) ? params.get(name).split(',') : []);

  const setParam = (name, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(name, value);
    else next.delete(name);
    setParams(next, { replace: true });
  };

  const toggle = (name, value) => {
    const cur = selected(name);
    setParam(name, (cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]).join(','));
  };

  const sizeLabel = params.get('size')
    || (params.get('width') || params.get('profile') || params.get('rim')
      ? `${params.get('width') || '*'}/${params.get('profile') || '*'}R${params.get('rim') || '*'}`
      : null);

  const heading = params.get('q')
    ? `Results for “${params.get('q')}”`
    : params.get('onSale') === 'true' ? 'Tyre deals'
    : params.get('category') && !params.get('category').includes(',') ? `${params.get('category')} tyres`
    : 'All tyres';

  const hasFilters = PARAM_KEYS.some((k) => k !== 'sort' && params.get(k));
  const facets = data?.facets;

  return (
    <div className="container page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link> <Icon name="chevron" size={14} /> <span>Tyres</span>
      </nav>

      <div className="results-head">
        <div>
          <h1>{heading}</h1>
          <p className="muted">
            {data ? `${data.total} tyre${data.total === 1 ? '' : 's'}` : 'Loading…'}
            {sizeLabel && <> in <strong>{sizeLabel}</strong></>}
          </p>
        </div>
        <div className="results-tools">
          <button className="btn btn-outline show-md" onClick={() => setFiltersOpen((o) => !o)} aria-expanded={filtersOpen}>
            <Icon name="filter" size={16} /> Filters
          </button>
          <label className="sort">
            <span className="hide-sm">Sort by</span>
            <select value={params.get('sort') || 'popular'} onChange={(e) => setParam('sort', e.target.value === 'popular' ? '' : e.target.value)}>
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </label>
        </div>
      </div>

      {vehicle && params.get('size') && (
        <div className="vehicle-banner">
          <Icon name="car" />
          <span>Showing tyres for your <strong>{vehicle.year} {vehicle.make} {vehicle.model}</strong></span>
          <button className="btn-link" onClick={() => { setVehicle(null); setParam('size', ''); }}>Change vehicle</button>
        </div>
      )}

      <div className="results-layout">
        <aside className={`filters ${filtersOpen ? 'open' : ''}`} aria-label="Filters">
          <div className="filters-head">
            <h2>Filters</h2>
            {hasFilters && <Link to="/tyres" className="btn-link">Clear all</Link>}
          </div>

          {sizeLabel && (
            <div className="facet">
              <div className="facet-title">Tyre size</div>
              <span className="chip chip-removable">
                {sizeLabel}
                <button aria-label="Remove size filter" onClick={() => {
                  const next = new URLSearchParams(params);
                  ['size', 'width', 'profile', 'rim'].forEach((k) => next.delete(k));
                  setParams(next, { replace: true });
                }}><Icon name="close" size={14} /></button>
              </span>
            </div>
          )}

          <fieldset className="facet">
            <legend>Availability</legend>
            <label className="check">
              <input type="checkbox" checked={params.get('inStock') === 'true'} onChange={(e) => setParam('inStock', e.target.checked ? 'true' : '')} />
              <span>In stock only</span>
            </label>
            <label className="check">
              <input type="checkbox" checked={params.get('onSale') === 'true'} onChange={(e) => setParam('onSale', e.target.checked ? 'true' : '')} />
              <span>On sale</span>
            </label>
          </fieldset>

          {facets && (
            <>
              <FacetGroup title="Tyre type" name="category" options={facets.categories} selected={selected('category')} onToggle={toggle} />
              <FacetGroup title="Terrain" name="terrain" options={facets.terrains} selected={selected('terrain')} onToggle={toggle} />
              <FacetGroup
                title="Brand"
                name="brand"
                options={[...facets.brands].sort((a, b) => a.label.localeCompare(b.label))}
                selected={selected('brand')}
                onToggle={toggle}
              />
            </>
          )}

          {/* Keyed on the URL values so "Clear all" resets these uncontrolled inputs. */}
          <fieldset className="facet" key={`${params.get('minPrice')}-${params.get('maxPrice')}`}>
            <legend>Price per tyre</legend>
            <div className="price-range">
              <input type="number" min="0" placeholder="Min" aria-label="Minimum price"
                defaultValue={params.get('minPrice') || ''}
                onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                onBlur={(e) => setParam('minPrice', e.target.value)} />
              <span>–</span>
              <input type="number" min="0" placeholder="Max" aria-label="Maximum price"
                defaultValue={params.get('maxPrice') || ''}
                onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                onBlur={(e) => setParam('maxPrice', e.target.value)} />
            </div>
          </fieldset>

          <button className="btn btn-primary btn-block show-md" onClick={() => setFiltersOpen(false)}>
            Show {data?.total ?? ''} results
          </button>
        </aside>

        <section>
          {error && <div className="alert alert-error">{error}</div>}
          {data && data.total === 0 && (
            <div className="empty card">
              <h2>No tyres match those filters</h2>
              <p className="muted">Try removing a filter or searching a different size.</p>
              <Link to="/tyres" className="btn btn-primary">Clear filters</Link>
            </div>
          )}
          <div className="product-grid product-grid-3">
            {data?.items.map((t) => <TyreCard key={t.id} tyre={t} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
