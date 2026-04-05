// utils/dataHandlers.js

// ========================
// 🧠 HELPERS INTERNOS
// ========================
const pad = (n) => String(n).padStart(2, '0');

const isValidDate = (y, m, d) => {
  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === Number(y) &&
    date.getMonth() === Number(m) - 1 &&
    date.getDate() === Number(d)
  );
};

// ========================
// 📅 TO ISO (CORE)
// ========================
export function toISODate(raw) {
  if (!raw || String(raw).trim() === "") return "";

  const s = String(raw).trim();

  let year, month, day;

  // 🇧🇷 DD/MM/YYYY ou D/M/YYYY
  const br = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

  // 🌍 YYYY-MM-DD
  const iso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);

  if (br) {
    const [, d, m, y] = br;
    if (!isValidDate(y, m, d)) return "";
    year = y;
    month = pad(m);
    day = pad(d);
  }
  else if (iso) {
    const [, y, m, d] = iso;
    if (!isValidDate(y, m, d)) return "";
    year = y;
    month = pad(m);
    day = pad(d);
  }
  else {
    // ⚠️ fallback controlado (último recurso)
    const dateObj = new Date(s.includes('T') ? s : `${s}T12:00:00`);

    if (isNaN(dateObj.getTime())) return "";

    year = dateObj.getFullYear();
    month = pad(dateObj.getMonth() + 1);
    day = pad(dateObj.getDate());
  }

  return `${year}-${month}-${day}`;
}

// ========================
// 🇧🇷 FORMAT DATE
// ========================
export function formatDateBR(raw) {
  const iso = toISODate(raw);
  if (!iso) return "—";

  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

// ========================
// 💰 FORMAT MONEY
// ========================
const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function formatCurrency(value) {
  const num = Number(value);
  return currencyFormatter.format(isNaN(num) ? 0 : num);
}

// ========================
// 🧮 PARSE DATE SAFE
// ========================
export function parseDate(raw) {
  const iso = toISODate(raw);
  if (!iso) return null;

  const [y, m, d] = iso.split('-').map(Number);

  // meio-dia evita bug de timezone
  return new Date(y, m - 1, d, 12, 0, 0);
}

// ========================
// 📊 RANGE HELPERS (NOVO)
// ========================
export function isWithinRange(dateISO, start, end) {
  if (!dateISO) return false;

  if (start && dateISO < start) return false;
  if (end && dateISO > end) return false;

  return true;
}

// ========================
// 🧩 AGRUPAMENTO POR DIA (NOVO)
// ========================
export function groupByDate(data) {
  const map = new Map();

  for (const item of data) {
    if (!item.dateISO) continue;

    if (!map.has(item.dateISO)) {
      map.set(item.dateISO, []);
    }

    map.get(item.dateISO).push(item);
  }

  return map;
}

// ========================
// 📈 SUMÁRIO RÁPIDO (NOVO)
// ========================
export function summarize(data) {
  let income = 0;
  let expense = 0;

  for (const item of data) {
    if (item.tipo === 'RECEITA') income += item.valor;
    else expense += item.valor;
  }

  return {
    income,
    expense,
    total: income - expense
  };
}
