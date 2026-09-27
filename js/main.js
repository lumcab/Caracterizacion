import { setupSummary } from './summary.js';
import { APP_CONFIG } from './config.js';
import { createNavigator } from './navigation.js';
import { saveRecord } from './api.js';
import { createUI } from './ui.js';

const navigator = createNavigator(APP_CONFIG.sectionIds);
const ui = createUI(APP_CONFIG);
const preview = new URLSearchParams(location.search).get('preview') === '1';
const updateSummary = setupSummary(ui.dom.form);
const today = new Date();
ui.dom.fechaNacimiento.max = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
let submitting = false;
let sent = false;
let dirty = false;
// No cargar información de una familia anterior en un equipo compartido.
try { localStorage.removeItem('caracterizacion_poe_draft_v1'); } catch (_) {}

function render() {
  ui.showSection(navigator.state.index);
  ui.updateNavButtons(navigator.isFirst(), navigator.isLast(), submitting);
  ui.dom.submitBtn.disabled = submitting || sent || preview || !APP_CONFIG.googleScriptUrl;
  ui.dom.form.hidden = sent;
  ui.dom.progressItems.forEach(item => { item.disabled = submitting || sent; });
  ui.dom.newBtn.disabled = submitting;
  ui.dom.btnCreateAnother.disabled = submitting;
}
function fresh() {
  ui.dom.form.reset();
  ui.hideSavePanel();
  navigator.setIndex(0);
  sent = false;
  dirty = false;
  ui.toggleConditional();
  queueMicrotask(updateSummary);
  render();
}
ui.dom.newBtn.addEventListener('click', () => {
  if (!dirty || window.confirm('Se borrarán los datos de este formulario que aún no has enviado. ¿Quieres iniciar otro registro?')) fresh();
});
ui.dom.btnCreateAnother.addEventListener('click', fresh);
ui.dom.form.addEventListener('input', () => { dirty = true; });
ui.dom.form.addEventListener('change', () => { dirty = true; });
window.addEventListener('beforeunload', event => {
  if (dirty || submitting) { event.preventDefault(); event.returnValue = ''; }
});
ui.dom.fechaNacimiento.addEventListener('change', ui.calculateAge);
ui.dom.form.addEventListener('change', () => { ui.toggleConditional(); updateSummary(); });
ui.dom.form.addEventListener('click', event => {
  const chip = event.target.closest('.suggestion-chip');
  if (chip) ui.applySuggestion(chip.dataset.target, chip.dataset.value || '');
});
ui.dom.progressItems.forEach((item,index) => item.addEventListener('click', () => {
  if (submitting || sent) return;
  navigator.setIndex(index); render(); ui.focusSection();
}));
ui.dom.nextBtn.addEventListener('click', () => {
  if (ui.validateSection(navigator.state.index, APP_CONFIG.requiredMessage)) { navigator.next(); render(); ui.focusSection(); }
});
ui.dom.prevBtn.addEventListener('click', () => { navigator.prev(); render(); ui.focusSection(); });
ui.dom.form.addEventListener('submit', async event => {
  event.preventDefault();
  if (submitting || sent) return;
  if (preview || !APP_CONFIG.googleScriptUrl) {
    ui.showAlert('El envío aún no está habilitado. Espera la confirmación del docente antes de diligenciar.', 'info'); return;
  }
  for (let index = 0; index < APP_CONFIG.sectionIds.length; index++) {
    if (!ui.validateSection(index, APP_CONFIG.requiredMessage)) {
      navigator.setIndex(index); render();
      ui.dom.sections[index].querySelector(':invalid')?.focus(); return;
    }
  }
  const payload = ui.serializeForm();
  submitting = true; ui.setSubmitting(true); render();
  try {
    payload.archivoCaracterizacion = 'caracterizacion';
    payload.modoRegistro = 'nuevo_registro';
    const result = await saveRecord(APP_CONFIG, payload);
    if (!result.confirmed) throw new Error('Google no confirmó el guardado. Conserva esta pestaña abierta y consulta al docente antes de reenviar.');
    fresh(); sent = true;
    ui.showSavePanel('Registro recibido. Gracias por completar la caracterización. Puedes iniciar un registro nuevo.');
  } catch (error) { ui.showAlert(error.message, 'danger'); }
  finally { submitting = false; ui.setSubmitting(false); render(); }
});
ui.setSubmitActionLabel('Enviar registro');
fresh();
ui.dom.conexionEstado.textContent = preview ? 'Vista previa · no envía datos' : APP_CONFIG.googleScriptUrl ? 'Recepción habilitada' : 'Envío pendiente de habilitar';
if (preview) ui.showAlert('Vista previa: puedes recorrer el formulario con datos ficticios. No se enviará información.', 'info');
else if (!APP_CONFIG.googleScriptUrl) ui.showAlert('El formulario está en preparación. El docente avisará cuando se habilite el envío; por ahora no ingreses datos personales.', 'info');
