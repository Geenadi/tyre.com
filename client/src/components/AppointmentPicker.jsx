import Field from './Field.jsx';

const SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

// Local YYYY-MM-DD (toISOString would shift the day for timezones ahead of UTC).
export const isoDate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const isSunday = (s) => s && new Date(`${s}T00:00:00`).getDay() === 0;

export default function AppointmentPicker({ value, onChange, errors = {} }) {
  const today = isoDate(new Date());
  const isToday = value.date === today;
  const hour = new Date().getHours();
  // Same-day bookings need at least an hour's notice.
  const slots = SLOTS.filter((s) => !isToday || Number(s.slice(0, 2)) > hour);
  const dateError = errors.date || (isSunday(value.date) ? 'We are closed on Sundays' : null);

  return (
    <div className="form-row">
      <Field label="Date" error={dateError} hint="Mon–Sat">
        <input
          type="date"
          min={today}
          value={value.date}
          onChange={(e) => onChange({ ...value, date: e.target.value, time: '' })}
        />
      </Field>
      <Field label="Time" error={errors.time}>
        <select value={value.time} onChange={(e) => onChange({ ...value, time: e.target.value })} disabled={!value.date}>
          <option value="">{value.date && !slots.length ? 'No times left today' : 'Select a time'}</option>
          {slots.map((s) => <option key={s}>{s}</option>)}
        </select>
      </Field>
    </div>
  );
}
