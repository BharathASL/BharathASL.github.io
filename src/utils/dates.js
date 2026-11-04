const MONTH_FORMAT = new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' });

function parseMonth(value) {
  const [year, month] = value.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, 1));
}

export function formatMonth(value) {
  return value ? MONTH_FORMAT.format(parseMonth(value)) : 'Present';
}

export function formatPeriod(start, end) {
  return `${formatMonth(start)} – ${formatMonth(end)}`;
}

export function yearsSince(value, now = new Date()) {
  const start = parseMonth(value);
  const months = (now.getUTCFullYear() - start.getUTCFullYear()) * 12 + (now.getUTCMonth() - start.getUTCMonth());
  return Math.floor(months / 12);
}

function monthsBetween(start, end, now) {
  const from = parseMonth(start);
  const to = end ? parseMonth(end) : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  return (to.getUTCFullYear() - from.getUTCFullYear()) * 12 + (to.getUTCMonth() - from.getUTCMonth());
}

// "3 yrs 4 mos", counting the end month as worked when the role has ended.
export function formatDuration(start, end, now = new Date()) {
  const months = Math.max(1, monthsBetween(start, end, now) + (end ? 0 : 1));
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts = [];
  if (years) parts.push(`${years} ${years === 1 ? 'yr' : 'yrs'}`);
  if (rest) parts.push(`${rest} ${rest === 1 ? 'mo' : 'mos'}`);
  return parts.join(' ');
}
