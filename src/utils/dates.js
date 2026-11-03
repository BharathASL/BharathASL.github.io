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
