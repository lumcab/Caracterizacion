const DRAFT_KEY = 'caracterizacion_poe_draft_v1';

export function saveDraft(payload) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
  } catch (_) {
    // Si falla, no detenemos la app.
  }
}

export function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (_) {
    // noop
  }
}
