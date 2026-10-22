import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useCart } from '../context/CartContext.jsx';
import Icon from './Icon.jsx';

function SizeSearch() {
  const navigate = useNavigate();
  const [opts, setOpts] = useState({ widths: [], profiles: [], rims: [] });
  const [width, setWidth] = useState('');
  const [profile, setProfile] = useState('');
  const [rim, setRim] = useState('');

  useEffect(() => {
    api.sizes({ width, profile }).then(setOpts).catch(() => {});
  }, [width, profile]);

  const submit = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (width) p.set('width', width);
    if (profile) p.set('profile', profile);
    if (rim) p.set('rim', rim);
    navigate(`/tyres?${p}`);
  };

  return (
    <form onSubmit={submit} className="search-form">
      <div className="size-row">
        <label>
          <span>Width</span>
          <select value={width} onChange={(e) => { setWidth(e.target.value); setProfile(''); setRim(''); }}>
            <option value="">Any</option>
            {opts.widths.map((w) => <option key={w}>{w}</option>)}
          </select>
        </label>
        <span className="size-sep">/</span>
        <label>
          <span>Profile</span>
          <select value={profile} onChange={(e) => { setProfile(e.target.value); setRim(''); }}>
            <option value="">Any</option>
            {opts.profiles.map((p) => <option key={p}>{p}</option>)}
          </select>
        </label>
        <span className="size-sep">R</span>
        <label>
          <span>Rim</span>
          <select value={rim} onChange={(e) => setRim(e.target.value)}>
            <option value="">Any</option>
            {opts.rims.map((r) => <option key={r}>{r}</option>)}
          </select>
        </label>
      </div>
      <button className="btn btn-primary btn-lg btn-block">
        <Icon name="search" size={18} /> Find tyres
      </button>
      <p className="hint">
        Find your size on the tyre sidewall, e.g. <strong>205/55R16</strong>.{' '}
        <a href="#size-guide">How to read it</a>
      </p>
    </form>
  );
}

function VehicleSearch() {
  const navigate = useNavigate();
  const { setVehicle } = useCart();
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => { api.makes().then(setMakes).catch(() => {}); }, []);
  const chooseMake = (m) => {
    setMake(m); setModels([]); setModel(''); setYears([]); setYear(''); setResult(null);
    if (m) api.models(m).then(setModels).catch(() => {});
  };
  const chooseModel = (m) => {
    setModel(m); setYears([]); setYear(''); setResult(null);
    if (m) api.years(make, m).then(setYears).catch(() => {});
  };
  const chooseYear = (y) => {
    setYear(y); setResult(null);
    if (y) api.vehicleSizes(make, model, y).then(setResult).catch(() => {});
  };

  const pick = (size) => {
    setVehicle({ make, model, year: Number(year) });
    navigate(`/tyres?size=${encodeURIComponent(size)}`);
  };

  return (
    <div className="search-form">
      <div className="vehicle-row">
        <label>
          <span>Make</span>
          <select value={make} onChange={(e) => chooseMake(e.target.value)}>
            <option value="">Select make</option>
            {makes.map((m) => <option key={m}>{m}</option>)}
          </select>
        </label>
        <label>
          <span>Model</span>
          <select value={model} onChange={(e) => chooseModel(e.target.value)} disabled={!models.length}>
            <option value="">Select model</option>
            {models.map((m) => <option key={m}>{m}</option>)}
          </select>
        </label>
        <label>
          <span>Year</span>
          <select value={year} onChange={(e) => chooseYear(e.target.value)} disabled={!years.length}>
            <option value="">Select year</option>
            {years.map((y) => <option key={y}>{y}</option>)}
          </select>
        </label>
      </div>
      {result ? (
        <div className="fitment">
          <p>Factory tyre sizes for your {year} {make} {model}:</p>
          <div className="fitment-sizes">
            {result.sizes.map((s) => (
              <button key={s} className="btn btn-outline" onClick={() => pick(s)}>
                {s} <Icon name="chevron" size={16} />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="hint">Choose your make, model and year to see tyres that fit.</p>
      )}
    </div>
  );
}

export default function TyreSearch() {
  const [tab, setTab] = useState('size');
  return (
    <div className="tyre-search card">
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'size'} className={tab === 'size' ? 'active' : ''} onClick={() => setTab('size')}>
          Search by size
        </button>
        <button role="tab" aria-selected={tab === 'vehicle'} className={tab === 'vehicle' ? 'active' : ''} onClick={() => setTab('vehicle')}>
          <Icon name="car" size={18} /> Search by vehicle
        </button>
      </div>
      {tab === 'size' ? <SizeSearch /> : <VehicleSearch />}
    </div>
  );
}
