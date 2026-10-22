// Seed catalogue for tyre.com. Tyre SKUs are generated from patterns x sizes
// so the catalogue stays realistic without a hand-written row per size.

export const brands = [
  { id: 'michelin', name: 'Michelin', tier: 'Premium', color: '#27509b' },
  { id: 'bridgestone', name: 'Bridgestone', tier: 'Premium', color: '#d6001c' },
  { id: 'continental', name: 'Continental', tier: 'Premium', color: '#f5a800' },
  { id: 'pirelli', name: 'Pirelli', tier: 'Premium', color: '#e2b007' },
  { id: 'goodyear', name: 'Goodyear', tier: 'Premium', color: '#0d47a1' },
  { id: 'yokohama', name: 'Yokohama', tier: 'Mid-range', color: '#c8102e' },
  { id: 'hankook', name: 'Hankook', tier: 'Mid-range', color: '#f37021' },
  { id: 'kumho', name: 'Kumho', tier: 'Mid-range', color: '#e60012' },
  { id: 'toyo', name: 'Toyo', tier: 'Mid-range', color: '#1d4f91' },
  { id: 'falken', name: 'Falken', tier: 'Value', color: '#0072ce' },
  { id: 'nexen', name: 'Nexen', tier: 'Value', color: '#7a1fa2' },
  { id: 'bfgoodrich', name: 'BFGoodrich', tier: 'Premium', color: '#cf102d' },
];

const SIZE_LIST = [
  '185/65R15', '195/65R15', '205/55R16', '215/60R16', '265/70R16',
  '225/45R17', '225/65R17', '265/65R17', '235/45R18', '255/55R18',
  '245/40R19', '275/40R20',
];

// category: Passenger | SUV | Performance | 4x4
const patterns = [
  { brand: 'michelin', name: 'Primacy 4+', category: 'Passenger', terrain: 'Highway', rating: 4.8, reviews: 412, warranty: 80000, tierMult: 1.35, sizes: ['195/65R15', '205/55R16', '215/60R16', '225/45R17', '235/45R18'], features: ['Long-lasting wet braking', 'Quiet, comfortable ride', 'Low rolling resistance'] },
  { brand: 'michelin', name: 'Pilot Sport 5', category: 'Performance', terrain: 'Highway', rating: 4.9, reviews: 288, warranty: 50000, tierMult: 1.6, sizes: ['225/45R17', '235/45R18', '245/40R19', '275/40R20'], features: ['Sharp, precise handling', 'Excellent dry & wet grip', 'Dual-sport tread compound'] },
  { brand: 'michelin', name: 'LTX Force', category: '4x4', terrain: 'All Terrain', rating: 4.7, reviews: 198, warranty: 70000, tierMult: 1.4, sizes: ['265/70R16', '265/65R17', '255/55R18'], features: ['Tough on gravel and dirt', 'Chip & cut resistant', 'Quiet on-road manners'] },
  { brand: 'bridgestone', name: 'Turanza T005', category: 'Passenger', terrain: 'Highway', rating: 4.6, reviews: 356, warranty: 70000, tierMult: 1.3, sizes: ['185/65R15', '195/65R15', '205/55R16', '225/45R17', '235/45R18'], features: ['Superior wet grip', 'Durable for long journeys', 'Fuel-efficient design'] },
  { brand: 'bridgestone', name: 'Dueler A/T 002', category: '4x4', terrain: 'All Terrain', rating: 4.7, reviews: 241, warranty: 80000, tierMult: 1.35, sizes: ['265/70R16', '265/65R17', '255/55R18'], features: ['Built for Australian conditions', 'Even wear on & off road', 'Strong sidewall'] },
  { brand: 'bridgestone', name: 'Potenza Sport', category: 'Performance', terrain: 'Highway', rating: 4.7, reviews: 174, warranty: 40000, tierMult: 1.5, sizes: ['225/45R17', '235/45R18', '245/40R19', '275/40R20'], features: ['Track-inspired grip', 'Responsive steering', 'Short braking distances'] },
  { brand: 'continental', name: 'UltraContact UC7', category: 'Passenger', terrain: 'Highway', rating: 4.7, reviews: 220, warranty: 75000, tierMult: 1.25, sizes: ['195/65R15', '205/55R16', '215/60R16', '225/45R17'], features: ['Great mileage', 'Confident wet braking', 'Low noise'] },
  { brand: 'continental', name: 'CrossContact RX', category: 'SUV', terrain: 'Highway', rating: 4.6, reviews: 133, warranty: 70000, tierMult: 1.3, sizes: ['225/65R17', '255/55R18', '235/45R18'], features: ['SUV-tuned comfort', 'Stable at highway speed', 'Light gravel capable'] },
  { brand: 'pirelli', name: 'P Zero', category: 'Performance', terrain: 'Highway', rating: 4.8, reviews: 301, warranty: 40000, tierMult: 1.65, sizes: ['225/45R17', '235/45R18', '245/40R19', '275/40R20'], features: ['OE fitment on prestige cars', 'Exceptional cornering', 'High-speed stability'] },
  { brand: 'pirelli', name: 'Scorpion Verde', category: 'SUV', terrain: 'Highway', rating: 4.5, reviews: 96, warranty: 65000, tierMult: 1.3, sizes: ['225/65R17', '255/55R18'], features: ['Eco-friendly compound', 'Quiet cabin', 'Balanced handling'] },
  { brand: 'goodyear', name: 'Assurance TripleMax 2', category: 'Passenger', terrain: 'Highway', rating: 4.5, reviews: 187, warranty: 70000, tierMult: 1.15, sizes: ['185/65R15', '195/65R15', '205/55R16', '215/60R16'], features: ['Shorter wet braking', 'Hydro-grip technology', 'Fuel saving'] },
  { brand: 'goodyear', name: 'Wrangler AT Adventure', category: '4x4', terrain: 'All Terrain', rating: 4.6, reviews: 264, warranty: 70000, tierMult: 1.2, sizes: ['265/70R16', '265/65R17'], features: ['Kevlar reinforced', 'Off-road traction', 'Long tread life'] },
  { brand: 'yokohama', name: 'BluEarth-GT AE51', category: 'Passenger', terrain: 'Highway', rating: 4.5, reviews: 210, warranty: 70000, tierMult: 1.05, sizes: ['185/65R15', '195/65R15', '205/55R16', '215/60R16', '225/45R17'], features: ['Grand touring comfort', 'Wet performance', 'Low fuel consumption'] },
  { brand: 'yokohama', name: 'Geolandar A/T G015', category: '4x4', terrain: 'All Terrain', rating: 4.7, reviews: 389, warranty: 80000, tierMult: 1.1, sizes: ['265/70R16', '265/65R17', '255/55R18'], features: ['Best-seller for utes', 'Snow & mud capable', 'Quiet tread pattern'] },
  { brand: 'hankook', name: 'Ventus Prime 4', category: 'Passenger', terrain: 'Highway', rating: 4.4, reviews: 158, warranty: 65000, tierMult: 0.95, sizes: ['195/65R15', '205/55R16', '215/60R16', '225/45R17', '235/45R18'], features: ['Great value comfort tyre', 'Stable wet handling', 'Low noise'] },
  { brand: 'hankook', name: 'Dynapro AT2', category: '4x4', terrain: 'All Terrain', rating: 4.5, reviews: 176, warranty: 70000, tierMult: 1.0, sizes: ['265/70R16', '265/65R17'], features: ['Tough 3-ply sidewall', 'Balanced on/off road', 'Long life compound'] },
  { brand: 'kumho', name: 'Ecsta PS71', category: 'Performance', terrain: 'Highway', rating: 4.4, reviews: 122, warranty: 50000, tierMult: 0.95, sizes: ['225/45R17', '235/45R18', '245/40R19', '275/40R20'], features: ['Sporty handling for less', 'Wet grip', 'Comfortable ride'] },
  { brand: 'kumho', name: 'Road Venture AT52', category: '4x4', terrain: 'All Terrain', rating: 4.3, reviews: 88, warranty: 60000, tierMult: 0.9, sizes: ['265/70R16', '265/65R17'], features: ['Affordable all-terrain', 'Stone ejectors', 'Even wear'] },
  { brand: 'toyo', name: 'Open Country M/T', category: '4x4', terrain: 'Mud Terrain', rating: 4.8, reviews: 207, warranty: 50000, tierMult: 1.3, sizes: ['265/70R16', '265/65R17'], features: ['Serious off-road traction', 'Aggressive sidewall lugs', 'Puncture resistant'] },
  { brand: 'toyo', name: 'Proxes Sport', category: 'Performance', terrain: 'Highway', rating: 4.5, reviews: 91, warranty: 50000, tierMult: 1.1, sizes: ['225/45R17', '235/45R18', '245/40R19'], features: ['Asymmetric tread', 'Great dry grip', 'Responsive'] },
  { brand: 'falken', name: 'Ziex ZE310', category: 'Passenger', terrain: 'Highway', rating: 4.3, reviews: 143, warranty: 60000, tierMult: 0.82, sizes: ['185/65R15', '195/65R15', '205/55R16', '215/60R16', '225/45R17'], features: ['Budget-friendly', 'Wet braking', 'Comfortable'] },
  { brand: 'falken', name: 'Wildpeak A/T3W', category: '4x4', terrain: 'All Terrain', rating: 4.6, reviews: 233, warranty: 70000, tierMult: 0.98, sizes: ['265/70R16', '265/65R17', '255/55R18'], features: ['3-peak mountain snowflake', 'Heat diffuser sidewall', 'Value 4x4 favourite'] },
  { brand: 'nexen', name: 'N\'Fera SU1', category: 'Performance', terrain: 'Highway', rating: 4.2, reviews: 77, warranty: 50000, tierMult: 0.78, sizes: ['225/45R17', '235/45R18', '245/40R19', '275/40R20'], features: ['Performance on a budget', 'Good dry grip', 'Stylish tread'] },
  { brand: 'nexen', name: 'N\'Priz AH8', category: 'Passenger', terrain: 'Highway', rating: 4.1, reviews: 64, warranty: 60000, tierMult: 0.72, sizes: ['185/65R15', '195/65R15', '205/55R16', '215/60R16'], features: ['Lowest-cost quality tyre', 'Quiet', 'Fuel efficient'] },
  { brand: 'bfgoodrich', name: 'All-Terrain T/A KO2', category: '4x4', terrain: 'All Terrain', rating: 4.9, reviews: 512, warranty: 80000, tierMult: 1.45, sizes: ['265/70R16', '265/65R17', '255/55R18'], features: ['Iconic off-road tyre', 'CoreGard sidewall', 'Extended tread life'] },
];

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function parseSize(size) {
  const [, width, profile, rim] = size.match(/^(\d{3})\/(\d{2})R(\d{2})$/);
  return { width: Number(width), profile: Number(profile), rim: Number(rim) };
}

// Base price grows with rim and width; patterns scale it by brand tier.
function priceFor(size, mult) {
  const { width, rim } = parseSize(size);
  const base = 60 + (rim - 14) * 32 + (width - 180) * 0.9;
  return toPrice(base * mult);
}

const toPrice = (n) => Number((Math.round(n) - 0.01).toFixed(2));

// Deterministic pseudo-random so prices/stock don't change between restarts.
function hash(str) {
  let h = 0;
  for (const c of str) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

export const tyres = patterns.flatMap((p) =>
  p.sizes.map((size) => {
    const id = `${slug(p.brand)}-${slug(p.name)}-${slug(size)}`;
    const h = hash(id);
    const price = priceFor(size, p.tierMult);
    const onSale = h % 4 === 0;
    const { width, profile, rim } = parseSize(size);
    return {
      id,
      brand: p.brand,
      brandName: brands.find((b) => b.id === p.brand).name,
      pattern: p.name,
      category: p.category,
      terrain: p.terrain,
      size,
      width,
      profile,
      rim,
      loadIndex: 88 + (width % 20),
      speedRating: p.category === 'Performance' ? 'Y' : p.category === '4x4' ? 'T' : 'V',
      price: onSale ? toPrice(price * 0.85) : price,
      rrp: onSale ? price : null,
      rating: p.rating,
      reviews: p.reviews,
      warrantyKm: p.warranty,
      stock: h % 9 === 0 ? 0 : 4 + (h % 30),
      features: p.features,
      labels: {
        wetGrip: ['A', 'B', 'C'][h % 3],
        fuel: ['B', 'C', 'D'][(h >> 3) % 3],
        noiseDb: 68 + (h % 6),
      },
    };
  })
);

export const sizes = SIZE_LIST.map(parseSize);

export const vehicles = [
  { make: 'Toyota', model: 'Corolla', years: [2018, 2025], sizes: ['205/55R16', '225/45R17'] },
  { make: 'Toyota', model: 'Camry', years: [2017, 2025], sizes: ['215/60R16', '235/45R18'] },
  { make: 'Toyota', model: 'RAV4', years: [2019, 2025], sizes: ['225/65R17', '235/45R18'] },
  { make: 'Toyota', model: 'HiLux', years: [2015, 2025], sizes: ['265/65R17', '265/70R16'] },
  { make: 'Toyota', model: 'LandCruiser Prado', years: [2014, 2024], sizes: ['265/65R17', '255/55R18'] },
  { make: 'Ford', model: 'Ranger', years: [2016, 2025], sizes: ['265/65R17', '255/55R18'] },
  { make: 'Ford', model: 'Mustang', years: [2018, 2025], sizes: ['245/40R19', '275/40R20'] },
  { make: 'Mazda', model: 'Mazda3', years: [2016, 2025], sizes: ['205/55R16', '225/45R17'] },
  { make: 'Mazda', model: 'CX-5', years: [2017, 2025], sizes: ['225/65R17'] },
  { make: 'Hyundai', model: 'i30', years: [2017, 2025], sizes: ['205/55R16', '225/45R17'] },
  { make: 'Hyundai', model: 'Tucson', years: [2016, 2025], sizes: ['225/65R17', '255/55R18'] },
  { make: 'Kia', model: 'Cerato', years: [2018, 2025], sizes: ['205/55R16', '225/45R17'] },
  { make: 'Mitsubishi', model: 'Triton', years: [2015, 2025], sizes: ['265/70R16', '265/65R17'] },
  { make: 'Volkswagen', model: 'Golf', years: [2014, 2024], sizes: ['205/55R16', '225/45R17'] },
  { make: 'Tesla', model: 'Model 3', years: [2019, 2025], sizes: ['235/45R18', '245/40R19'] },
  { make: 'BMW', model: '3 Series', years: [2018, 2025], sizes: ['225/45R17', '245/40R19'] },
  { make: 'Suzuki', model: 'Swift', years: [2012, 2024], sizes: ['185/65R15', '195/65R15'] },
  { make: 'Honda', model: 'Jazz', years: [2014, 2021], sizes: ['185/65R15'] },
];

export const stores = [
  { id: 'syd-cbd', name: 'tyre.com Sydney CBD', state: 'NSW', address: '120 Harris St, Pyrmont NSW 2009', phone: '(02) 9000 1100', hours: 'Mon–Fri 7:30–5:30, Sat 8–2', lat: -33.87, lng: 151.19 },
  { id: 'parramatta', name: 'tyre.com Parramatta', state: 'NSW', address: '45 Church St, Parramatta NSW 2150', phone: '(02) 9000 2200', hours: 'Mon–Fri 7:30–5:30, Sat 8–4', lat: -33.81, lng: 151.0 },
  { id: 'melb-richmond', name: 'tyre.com Richmond', state: 'VIC', address: '300 Swan St, Richmond VIC 3121', phone: '(03) 9000 3300', hours: 'Mon–Fri 7:30–5:30, Sat 8–2', lat: -37.82, lng: 145.0 },
  { id: 'dandenong', name: 'tyre.com Dandenong', state: 'VIC', address: '12 Princes Hwy, Dandenong VIC 3175', phone: '(03) 9000 4400', hours: 'Mon–Fri 8–5, Sat 8–12', lat: -37.98, lng: 145.21 },
  { id: 'bris-north', name: 'tyre.com Brisbane North', state: 'QLD', address: '88 Gympie Rd, Kedron QLD 4031', phone: '(07) 3000 5500', hours: 'Mon–Fri 7:30–5:30, Sat 8–2', lat: -27.4, lng: 153.03 },
  { id: 'gold-coast', name: 'tyre.com Gold Coast', state: 'QLD', address: '7 Ferry Rd, Southport QLD 4215', phone: '(07) 3000 6600', hours: 'Mon–Fri 8–5, Sat 8–2', lat: -27.97, lng: 153.4 },
  { id: 'perth', name: 'tyre.com Osborne Park', state: 'WA', address: '210 Scarborough Beach Rd, Osborne Park WA 6017', phone: '(08) 6000 7700', hours: 'Mon–Fri 7:30–5, Sat 8–12', lat: -31.9, lng: 115.81 },
  { id: 'adelaide', name: 'tyre.com Adelaide', state: 'SA', address: '55 Port Rd, Hindmarsh SA 5007', phone: '(08) 7000 8800', hours: 'Mon–Fri 8–5, Sat 8–12', lat: -34.9, lng: 138.57 },
];

export const services = [
  { id: 'alignment', name: 'Wheel Alignment', price: 89, duration: 45, icon: 'align', description: 'Laser-precise alignment to stop uneven tyre wear and keep your car tracking straight.' },
  { id: 'balance', name: 'Wheel Balancing', price: 59, duration: 30, icon: 'balance', description: 'Remove steering wheel vibration and protect suspension components.' },
  { id: 'rotation', name: 'Tyre Rotation', price: 39, duration: 20, icon: 'rotate', description: 'Even out tread wear across all four tyres to get more kilometres from your set.' },
  { id: 'puncture', name: 'Puncture Repair', price: 45, duration: 30, icon: 'puncture', description: 'Australian Standards-compliant plug & patch repair where safe to do so.' },
  { id: 'brakes', name: 'Brake Inspection', price: 0, duration: 20, icon: 'brake', description: 'Free brake pad & rotor check by a qualified technician.' },
  { id: 'battery', name: 'Battery Check & Replace', price: 0, duration: 15, icon: 'battery', description: 'Free battery health test, with replacements from leading brands.' },
];

export const FITTING = {
  // Every tyre price includes fitting at a store; these are the extras.
  mobileFee: 49,
  alignmentAddon: 89,
  shippingFee: 0,
};
