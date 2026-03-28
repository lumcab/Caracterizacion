import { APP_CONFIG } from './config.js';
import { saveDraft, loadDraft, clearDraft } from './storage.js';
import { createNavigator } from './navigation.js';
import { fetchStats, searchByDocument, saveRecord } from './api.js';
import { createUI } from './ui.js';

const navigator = createNavigator(APP_CONFIG.sectionIds);
const ui = createUI(APP_CONFIG);

let isSubmitting = false;
let ultimoDocumento = '';

function hydrateDraft() {
  const draft = loadDraft();
  if (!draft) return;
  ui.fillForm(draft);
  ui.showAlert('Se cargó un borrador local para que no pierdas información.', 'info');
}

function syncDraft() {
  saveDraft(ui.serializeForm());
}

async function refreshStats() {
  try {
    const stats = await fetchStats(APP_CONFIG);
    ui.updateStats(stats);
  } catch (_) {
    ui.updateStats({ total: '-', ultima: '-' });
  }
}

function updateNavigationUI() {
  ui.showSection(navigator.state.index);
  ui.updateNavButtons(navigator.isFirst(), navigator.isLast(), isSubmitting);
}

function moveNext() {
  const valid = ui.validateSection(navigator.state.index, APP_CONFIG.requiredMessage);
  if (!valid) return;
  navigator.next();
  updateNavigationUI();
}

function movePrev() {
  navigator.prev();
  updateNavigationUI();
}

function newRecord() {
  ui.clearForm();
  navigator.setIndex(0);
  updateNavigationUI();
  clearDraft();
  ui.showAlert('Formulario limpio y listo para un nuevo registro.', 'info');
}

async function handleSearch() {
  const doc = String(ui.dom.searchDoc.value || '').trim();
  if (!doc) {
    ui.showAlert('Ingresa un número de documento para buscar.', 'danger');
    return;
  }

  ui.dom.conexionEstado.textContent = 'Buscando...';

  try {
    const data = await searchByDocument(APP_CONFIG, doc);
    if (!data) {
      ui.showAlert('No se encontró información para ese documento.', 'danger');
      return;
    }

    ui.dom.form.reset();
    ui.fillForm(data);
    navigator.setIndex(0);
    updateNavigationUI();
    ultimoDocumento = doc;
    ui.hideSavePanel();
    ui.showAlert(`Registro encontrado para documento ${doc}.`, 'info');
  } catch (error) {
    ui.showAlert(`Error al buscar: ${error.message}`, 'danger');
  } finally {
    ui.dom.conexionEstado.textContent = 'Lista';
  }
}

async function handleSubmit(event) {
  event.preventDefault();
  if (isSubmitting) return;

  const valid = ui.validateSection(navigator.state.index, APP_CONFIG.requiredMessage);
  if (!valid) return;

  const payload = ui.serializeForm();
  const numeroDocumento = String(payload.numeroDocumento || '').trim();

  if (!numeroDocumento) {
    ui.showAlert('El número de documento es obligatorio para guardar.', 'danger');
    navigator.setIndex(0);
    updateNavigationUI();
    return;
  }

  isSubmitting = true;
  ui.setSubmitting(true);
  updateNavigationUI();

  try {
    payload.fechaRegistro = new Date().toLocaleString('es-CO');
    payload.fechaRegistroISO = new Date().toISOString();

    await saveRecord(APP_CONFIG, payload);

    ultimoDocumento = numeroDocumento;
    ui.showAlert('Registro guardado en la nube correctamente.', 'success');
    ui.showSavePanel(`Datos guardados para documento ${numeroDocumento}. Puedes editarlo o crear uno nuevo.`);

    clearDraft();
    setTimeout(() => {
      refreshStats();
    }, 1200);
  } catch (error) {
    ui.showAlert(`Error al guardar: ${error.message}`, 'danger');
  } finally {
    isSubmitting = false;
    ui.setSubmitting(false);
    updateNavigationUI();
  }
}

function bindEvents() {
  ui.dom.fechaNacimiento.addEventListener('change', ui.calculateAge);

  ui.dom.form.addEventListener('change', (event) => {
    if (['tieneDiscapacidad', 'perteneceEtnia', 'tipoEtnia'].includes(event.target.name)) {
      ui.toggleConditional();
    }
    syncDraft();
  });

  ui.dom.form.addEventListener('input', syncDraft);
  ui.dom.form.addEventListener('submit', handleSubmit);

  ui.dom.searchBtn.addEventListener('click', handleSearch);
  ui.dom.newBtn.addEventListener('click', newRecord);

  ui.dom.searchDoc.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  });

  ui.dom.nextBtn.addEventListener('click', moveNext);
  ui.dom.prevBtn.addEventListener('click', movePrev);

  ui.dom.btnCreateAnother.addEventListener('click', newRecord);
  ui.dom.btnEditSaved.addEventListener('click', () => {
    ui.hideSavePanel();
    navigator.setIndex(0);
    updateNavigationUI();
    ui.showAlert(`Modo edición activo para el registro ${ultimoDocumento || ''}.`, 'info');
  });
}

async function init() {
  bindEvents();
  hydrateDraft();
  ui.toggleConditional();
  updateNavigationUI();
  await refreshStats();
}

init();
