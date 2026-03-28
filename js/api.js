function parseJsonSafe(text) {
  try {
    return JSON.parse(text);
  } catch (_) {
    return null;
  }
}

function normalizeKey(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();
}

function normalizeDocument(value) {
  return String(value || '').replace(/\D/g, '');
}

async function fetchJson(url, options) {
  const resp = await fetch(url, options);
  const raw = await resp.text();
  return parseJsonSafe(raw);
}

function toObjectsFromGviz(payload) {
  if (!payload?.table?.cols || !Array.isArray(payload.table.rows)) return [];

  const headers = payload.table.cols.map((col, idx) => {
    const raw = col.label || col.id || `col_${idx + 1}`;
    return { raw, norm: normalizeKey(raw) };
  });

  return payload.table.rows.map((row) => {
    const out = {};
    headers.forEach((header, idx) => {
      const val = row.c?.[idx]?.v ?? '';
      out[header.raw] = val;
      out[header.norm] = val;
    });
    return out;
  });
}

export async function fetchSheetRows(config) {
  const url = `https://docs.google.com/spreadsheets/d/${config.sheetId}/gviz/tq?gid=${config.sheetGid}&tqx=out:json`;
  const raw = await (await fetch(url)).text();
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start < 0 || end < 0) return [];
  const payload = parseJsonSafe(raw.slice(start, end + 1));
  return toObjectsFromGviz(payload);
}

function pickDefined(obj, keys) {
  for (const key of keys) {
    if (obj?.[key] !== undefined && obj[key] !== null && obj[key] !== '') return obj[key];
  }
  return null;
}

function normalizeSearchResponse(data) {
  if (!data || typeof data !== 'object') return null;
  if (data.result === 'found' && data.estudiante) return data.estudiante;
  if (data.found === true && data.estudiante) return data.estudiante;
  if (data.record && typeof data.record === 'object') return data.record;
  if (data.data && typeof data.data === 'object' && !Array.isArray(data.data)) return data.data;
  return null;
}

export async function searchByDocument(config, documento) {
  const doc = String(documento || '').trim();
  if (!doc) return null;
  const docNormalized = normalizeDocument(doc);

  try {
    const response = await fetchJson(`${config.googleScriptUrl}?action=search&doc=${encodeURIComponent(doc)}`);
    const normalized = normalizeSearchResponse(response);
    if (normalized) return normalized;
  } catch (_) {
    // fallback
  }

  const rows = await fetchSheetRows(config);
  const keys = ['numerodocumento', 'documento', 'doc', 'identificacion', 'documentodeidentidad'];

  const row = rows.find((item) => keys.some((key) => {
    const raw = String(item[key] || '').trim();
    return raw === doc || normalizeDocument(raw) === docNormalized;
  }));
  return row || null;
}

export async function fetchStats(config) {
  const endpoints = ['stats', 'metadata', 'lastUpdate', 'list'];

  for (const action of endpoints) {
    try {
      const data = await fetchJson(`${config.googleScriptUrl}?action=${action}`);
      if (!data || typeof data !== 'object') continue;

      const total = pickDefined(data, ['total', 'totalRegistros', 'count', 'cantidad']);
      const ultima = pickDefined(data, ['ultimaActualizacion', 'lastUpdate', 'updatedAt', 'lastModified']);
      if (total !== null || ultima !== null) {
        return {
          total: total ?? '-',
          ultima: ultima ?? '-'
        };
      }

      const rows = pickDefined(data, ['rows', 'records', 'estudiantes', 'data']);
      if (Array.isArray(rows)) {
        return {
          total: rows.length,
          ultima: '-'
        };
      }
    } catch (_) {
      // intenta el siguiente endpoint
    }
  }

  const rows = await fetchSheetRows(config);
  const candidateDateKeys = ['fecharegistroiso', 'fecharegistro', 'updatedat', 'lastmodified', 'timestamp'];

  let last = null;
  rows.forEach((row) => {
    for (const key of candidateDateKeys) {
      const value = row[key];
      if (!value) continue;
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) continue;
      if (!last || d > last) last = d;
    }
  });

  return {
    total: rows.length,
    ultima: last ? last.toISOString() : '-'
  };
}

export async function saveRecord(config, payload) {
  await fetch(config.googleScriptUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return true;
}
