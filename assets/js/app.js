'use strict';

(() => {
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyZUnnhCw5KiCK1lvPFrTEKkR_JdPNa5Srig6cPA4wccN9uQWuBNBoA_IhY4uYNhBcLag/exec';
  const SHEET_ID = '1ndYw8lA_7qO7o-0-9OT9B7kTOAwKu_Jy3RI7eYTo0w8';
  const SHEET_GID = '0';

  const state = {
    currentSection: 1,
    totalSections: 3,
    isSubmitting: false,
    ultimoDocumentoGuardado: ''
  };

  const dom = {
    form: document.getElementById('caracterizacionForm'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    submitBtn: document.getElementById('submitBtn'),
    searchBtn: document.getElementById('searchBtn'),
    newBtn: document.getElementById('newBtn'),
    savePanel: document.getElementById('savePanel'),
    savePanelText: document.getElementById('savePanelText'),
    btnEditSaved: document.getElementById('btnEditSaved'),
    btnCreateAnother: document.getElementById('btnCreateAnother'),
    searchDoc: document.getElementById('searchDoc'),
    fechaNacimiento: document.getElementById('fechaNacimiento'),
    edad: document.getElementById('edad'),
    loadingIndicator: document.getElementById('loadingIndicator'),
    conexionEstado: document.getElementById('conexionEstado'),
    totalEstudiantes: document.getElementById('totalEstudiantes'),
    ultimaActualizacion: document.getElementById('ultimaActualizacion'),
    alertContainer: document.getElementById('alertContainer'),
    categoriaDiscapacidadGroup: document.getElementById('categoriaDiscapacidadGroup'),
    tipoEtniaGroup: document.getElementById('tipoEtniaGroup'),
    puebloIndigenaGroup: document.getElementById('puebloIndigenaGroup')
  };

  function showAlert(message, type = 'success') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} show`;
    alert.textContent = message;
    dom.alertContainer.innerHTML = '';
    dom.alertContainer.appendChild(alert);

    setTimeout(() => {
      alert.classList.remove('show');
    }, 5200);
  }

  function calculateEdad() {
    const fechaNac = new Date(`${dom.fechaNacimiento.value}T00:00:00`);
    if (Number.isNaN(fechaNac.getTime())) {
      dom.edad.value = '';
      return;
    }

    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const monthDiff = hoy.getMonth() - fechaNac.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad -= 1;
    }

    dom.edad.value = Math.max(edad, 0);
  }

  function showSection(sectionNumber) {
    document.querySelectorAll('.form-section').forEach((section) => section.classList.remove('active'));
    document.querySelector(`.form-section[data-section="${sectionNumber}"]`)?.classList.add('active');

    document.querySelectorAll('.progress-step').forEach((step, index) => {
      const stepNumber = index + 1;
      step.classList.remove('active', 'completed');
      if (stepNumber < sectionNumber) step.classList.add('completed');
      if (stepNumber === sectionNumber) step.classList.add('active');
    });

    dom.prevBtn.style.display = sectionNumber === 1 ? 'none' : 'inline-flex';
    dom.nextBtn.style.display = sectionNumber === state.totalSections ? 'none' : 'inline-flex';
    dom.submitBtn.style.display = sectionNumber === state.totalSections ? 'inline-flex' : 'none';

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function validateCurrentSection() {
    const section = document.querySelector(`.form-section[data-section="${state.currentSection}"]`);
    const requiredFields = section.querySelectorAll('[required]');

    for (const field of requiredFields) {
      if (field.type === 'radio') {
        const checked = Array.from(section.querySelectorAll(`input[name="${field.name}"]`)).some((radio) => radio.checked);
        if (!checked) {
          showAlert('Complete todos los campos obligatorios (*) de esta sección.', 'danger');
          return false;
        }
        continue;
      }

      if (!(field.value || '').toString().trim()) {
        field.focus();
        showAlert('Complete todos los campos obligatorios (*) de esta sección.', 'danger');
        return false;
      }
    }

    return true;
  }

  function setSubmitting(isSubmitting) {
    state.isSubmitting = isSubmitting;
    dom.submitBtn.disabled = isSubmitting;
    dom.nextBtn.disabled = isSubmitting;
    dom.prevBtn.disabled = isSubmitting;
    dom.submitBtn.textContent = isSubmitting ? 'Guardando...' : 'Guardar en Google Sheets';
    dom.loadingIndicator.classList.toggle('show', isSubmitting);
    dom.conexionEstado.textContent = isSubmitting ? 'Guardando...' : 'Lista';
  }

  function toggleConditionalBlocks() {
    const discapacidad = document.querySelector('input[name="tieneDiscapacidad"]:checked');
    const etnia = document.querySelector('input[name="perteneceEtnia"]:checked');
    const tipoEtnia = dom.form.elements.tipoEtnia ? dom.form.elements.tipoEtnia.value : '';

    dom.categoriaDiscapacidadGroup.style.display = discapacidad?.value === 'Si' ? 'block' : 'none';
    dom.tipoEtniaGroup.style.display = etnia?.value === 'Si' ? 'block' : 'none';
    dom.puebloIndigenaGroup.style.display = tipoEtnia === 'Indigena' ? 'block' : 'none';
  }

  function formToObject() {
    const formData = new FormData(dom.form);
    const out = {};
    for (const [key, value] of formData.entries()) out[key] = value;
    return out;
  }

  function parseJsonSafe(text) {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  async function fetchJsonSafe(url, options) {
    const resp = await fetch(url, options);
    const raw = await resp.text();
    return parseJsonSafe(raw);
  }

  function normalizeFieldName(value) {
    if (!value) return '';
    return String(value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLowerCase();
  }

  function gvizToObjects(gvizPayload) {
    if (!gvizPayload || !gvizPayload.table || !Array.isArray(gvizPayload.table.cols)) return [];
    const cols = gvizPayload.table.cols.map((col, index) => {
      const header = col.label || col.id || `col_${index + 1}`;
      return {
        raw: header,
        key: normalizeFieldName(header)
      };
    });

    const rows = Array.isArray(gvizPayload.table.rows) ? gvizPayload.table.rows : [];
    const objects = [];

    for (const row of rows) {
      const out = {};
      const cells = Array.isArray(row.c) ? row.c : [];
      cols.forEach((col, idx) => {
        const cell = cells[idx];
        out[col.raw] = cell && cell.v !== null && cell.v !== undefined ? cell.v : '';
        out[col.key] = out[col.raw];
      });
      objects.push(out);
    }

    return objects;
  }

  async function fetchRowsFromSheet() {
    const gvizUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?gid=${SHEET_GID}&tqx=out:json`;
    const resp = await fetch(gvizUrl);
    const raw = await resp.text();

    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start < 0 || end < 0 || end <= start) {
      throw new Error('No se pudo leer la respuesta de la hoja de cálculo.');
    }

    const jsonText = raw.slice(start, end + 1);
    const parsed = parseJsonSafe(jsonText);
    if (!parsed) {
      throw new Error('La hoja de cálculo no devolvió datos en formato válido.');
    }

    return gvizToObjects(parsed);
  }

  function pickFirstDefined(obj, keys) {
    for (const key of keys) {
      if (
        obj
        && Object.prototype.hasOwnProperty.call(obj, key)
        && obj[key] !== undefined
        && obj[key] !== null
        && obj[key] !== ''
      ) {
        return obj[key];
      }
    }
    return null;
  }

  function normalizeSearchPayload(payload) {
    if (!payload || typeof payload !== 'object') return null;
    if (payload.result === 'found' && payload.estudiante) return payload.estudiante;
    if (payload.found === true && payload.estudiante) return payload.estudiante;
    if (payload.found === true && payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) return payload.data;
    if (payload.estudiante && typeof payload.estudiante === 'object') return payload.estudiante;
    if (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data) && !payload.data.length) return payload.data;
    if (payload.record && typeof payload.record === 'object') return payload.record;
    return null;
  }

  function findRecordByDocumentInRows(rows, documento) {
    const target = String(documento || '').trim();
    if (!target) return null;

    const candidateKeys = [
      'numerodocumento',
      'documento',
      'doc',
      'numero_doc',
      'identificacion',
      'documentodeidentidad'
    ];

    for (const row of rows) {
      const normalizedEntries = Object.entries(row || {}).map(([k, v]) => [normalizeFieldName(k), v]);
      for (const [key, value] of normalizedEntries) {
        if (!candidateKeys.includes(key)) continue;
        if (String(value || '').trim() === target) {
          return row;
        }
      }
    }

    return null;
  }

  function mapSheetRowToFormData(row) {
    if (!row || typeof row !== 'object') return null;

    const mapped = {};
    const aliasMap = {
      numeroDocumento: ['numerodocumento', 'documento', 'doc', 'identificacion', 'documentodeidentidad'],
      nombres: ['nombres', 'nombre'],
      apellidos: ['apellidos', 'apellido']
    };

    Object.keys(row).forEach((rawKey) => {
      const normKey = normalizeFieldName(rawKey);
      mapped[rawKey] = row[rawKey];
      mapped[normKey] = row[rawKey];
    });

    const out = {};
    Object.keys(aliasMap).forEach((targetKey) => {
      const keyFound = aliasMap[targetKey].find((k) => mapped[k] !== undefined && mapped[k] !== null && String(mapped[k]).trim() !== '');
      if (keyFound) out[targetKey] = mapped[keyFound];
    });

    // Mantener también todas las llaves posibles para que fillFormFromObject pueda aprovecharlas.
    Object.assign(out, mapped);
    return out;
  }

  function normalizeSiValue(value) {
    if (typeof value !== 'string') return value;
    const normalized = value.trim().toLowerCase();
    if (normalized === 'sí' || normalized === 'si') return 'Si';
    if (normalized === 'no') return 'No';
    return value;
  }

  function formatDateTime(value) {
    if (!value) return '-';
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toLocaleString('es-CO');
  }

  function applyStats({ total, ultima }) {
    dom.totalEstudiantes.textContent = total ?? '-';
    dom.ultimaActualizacion.textContent = ultima ? formatDateTime(ultima) : '-';
  }

  function extractStatsFromPayload(payload) {
    if (!payload || typeof payload !== 'object') return null;

    const total = pickFirstDefined(payload, ['total', 'totalRegistros', 'total_records', 'count', 'cantidad']);
    const ultima = pickFirstDefined(payload, ['ultimaActualizacion', 'lastUpdate', 'updatedAt', 'lastModified', 'ultimoCambio', 'ultimaFecha']);

    if (total !== null || ultima !== null) {
      return { total, ultima };
    }

    const records = pickFirstDefined(payload, ['records', 'data', 'estudiantes', 'rows']);
    if (Array.isArray(records)) {
      let lastDate = null;

      for (const row of records) {
        if (!row || typeof row !== 'object') continue;
        const candidate = pickFirstDefined(row, ['fechaRegistroISO', 'fechaRegistro', 'updatedAt', 'lastModified', 'timestamp']);
        if (!candidate) continue;
        const date = new Date(candidate);
        if (Number.isNaN(date.getTime())) continue;
        if (!lastDate || date > lastDate) lastDate = date;
      }

      return {
        total: records.length,
        ultima: lastDate ? lastDate.toISOString() : null
      };
    }

    return null;
  }

  async function refreshStatsFromCloud() {
    const endpoints = [
      `${GOOGLE_SCRIPT_URL}?action=stats`,
      `${GOOGLE_SCRIPT_URL}?action=metadata`,
      `${GOOGLE_SCRIPT_URL}?action=lastUpdate`,
      `${GOOGLE_SCRIPT_URL}?action=list`
    ];

    for (const url of endpoints) {
      try {
        const payload = await fetchJsonSafe(url);
        const stats = extractStatsFromPayload(payload);
        if (stats) {
          applyStats(stats);
          return true;
        }
      } catch {
        // Continúa con el siguiente endpoint.
      }
    }

    // Respaldo: lectura directa de la hoja.
    try {
      const rows = await fetchRowsFromSheet();
      let lastDate = null;
      for (const row of rows) {
        const candidate = pickFirstDefined(row, [
          'fechaRegistroISO',
          'fecharegistroiso',
          'fechaRegistro',
          'fecharegistro',
          'updatedAt',
          'updatedat',
          'lastModified',
          'lastmodified'
        ]);
        if (!candidate) continue;
        const d = new Date(candidate);
        if (Number.isNaN(d.getTime())) continue;
        if (!lastDate || d > lastDate) lastDate = d;
      }

      applyStats({
        total: rows.length,
        ultima: lastDate ? lastDate.toISOString() : '-'
      });
      return true;
    } catch {
      applyStats({ total: '-', ultima: '-' });
      return false;
    }
  }

  function fillFormFromObject(data) {
    if (!data || typeof data !== 'object') return;

    const aliasMap = {
      documento: 'numeroDocumento',
      numero_doc: 'numeroDocumento',
      doc: 'numeroDocumento',
      nombre: 'nombres',
      apellidos_estudiante: 'apellidos'
    };

    Object.keys(data).forEach((key) => {
      const targetKey = aliasMap[key] || key;
      const value = data[key];
      const element = dom.form.elements[targetKey];
      if (!element) return;

      if (element instanceof RadioNodeList) {
        const normalized = normalizeSiValue(value);
        const option = dom.form.querySelector(`input[name="${targetKey}"][value="${normalized}"]`)
          || dom.form.querySelector(`input[name="${targetKey}"][value="${value}"]`);
        if (option) option.checked = true;
      } else {
        element.value = value;
      }
    });

    toggleConditionalBlocks();
  }

  function nuevoRegistro() {
    dom.form.reset();
    dom.searchDoc.value = '';
    state.currentSection = 1;
    state.ultimoDocumentoGuardado = '';
    dom.savePanel.classList.remove('show');

    showSection(1);
    toggleConditionalBlocks();
    showAlert('Formulario listo para un nuevo registro.', 'info');
  }

  async function buscarEstudiante() {
    const docBusqueda = (dom.searchDoc.value || '').trim();
    if (!docBusqueda) {
      showAlert('Ingrese un número de documento para buscar.', 'danger');
      return;
    }

    dom.conexionEstado.textContent = 'Buscando...';

    try {
      const data = await fetchJsonSafe(`${GOOGLE_SCRIPT_URL}?action=search&doc=${encodeURIComponent(docBusqueda)}`);
      const estudiante = normalizeSearchPayload(data);

      if (estudiante) {
        dom.form.reset();
        fillFormFromObject(estudiante);
        state.currentSection = 1;
        state.ultimoDocumentoGuardado = docBusqueda;
        dom.savePanel.classList.remove('show');
        showSection(1);
        showAlert(`Registro encontrado para documento ${docBusqueda}. Puede editar y volver a guardar.`, 'info');
        return;
      }

      // Respaldo: buscar directo en la hoja.
      const rows = await fetchRowsFromSheet();
      const foundRow = findRecordByDocumentInRows(rows, docBusqueda);

      if (!foundRow) {
        showAlert('No se encontró información para ese documento.', 'danger');
        return;
      }

      dom.form.reset();
      fillFormFromObject(mapSheetRowToFormData(foundRow));
      state.currentSection = 1;
      state.ultimoDocumentoGuardado = docBusqueda;
      dom.savePanel.classList.remove('show');
      showSection(1);
      showAlert(`Registro encontrado para documento ${docBusqueda}.`, 'info');
    } catch (error) {
      showAlert(`Error al buscar: ${error.message}`, 'danger');
    } finally {
      dom.conexionEstado.textContent = 'Lista';
    }
  }

  async function existeRegistroEnNube(doc) {
    if (!doc) return false;
    try {
      const data = await fetchJsonSafe(`${GOOGLE_SCRIPT_URL}?action=search&doc=${encodeURIComponent(doc)}`);
      return Boolean(normalizeSearchPayload(data));
    } catch {
      return false;
    }
  }

  async function onSubmitForm(event) {
    event.preventDefault();
    if (state.isSubmitting) return;
    if (!validateCurrentSection()) return;

    const numeroDocumento = (dom.form.elements.numeroDocumento.value || '').trim();
    if (!numeroDocumento) {
      showAlert('El número de documento es obligatorio para guardar.', 'danger');
      state.currentSection = 1;
      showSection(1);
      return;
    }

    setSubmitting(true);
    dom.savePanel.classList.remove('show');

    try {
      const estudiante = formToObject();
      const existePrevio = await existeRegistroEnNube(numeroDocumento);

      estudiante.fechaRegistro = new Date().toLocaleString('es-CO');
      estudiante.fechaRegistroISO = new Date().toISOString();
      estudiante.modoRegistro = existePrevio ? 'actualizar_existente' : 'nuevo_registro';

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(estudiante)
      });

      state.ultimoDocumentoGuardado = numeroDocumento;
      dom.ultimaActualizacion.textContent = new Date().toLocaleString('es-CO');

      const msg = existePrevio
        ? 'Registro actualizado en la nube correctamente. No necesitas enviarlo de nuevo.'
        : 'Registro guardado en la nube correctamente.';

      showAlert(msg, 'success');
      dom.savePanelText.textContent = `${msg} Documento: ${numeroDocumento}.`;
      dom.savePanel.classList.add('show');

      setTimeout(() => {
        refreshStatsFromCloud();
      }, 1200);
    } catch (error) {
      showAlert(`Error al guardar: ${error.message}`, 'danger');
    } finally {
      setSubmitting(false);
    }
  }

  function setupEventListeners() {
    dom.fechaNacimiento.addEventListener('change', calculateEdad);

    document.addEventListener('change', (event) => {
      if (['tieneDiscapacidad', 'perteneceEtnia', 'tipoEtnia'].includes(event.target.name)) {
        toggleConditionalBlocks();
      }
    });

    dom.nextBtn.addEventListener('click', () => {
      if (validateCurrentSection() && state.currentSection < state.totalSections) {
        state.currentSection += 1;
        showSection(state.currentSection);
      }
    });

    dom.prevBtn.addEventListener('click', () => {
      if (state.currentSection > 1) {
        state.currentSection -= 1;
        showSection(state.currentSection);
      }
    });

    dom.form.addEventListener('submit', onSubmitForm);
    dom.searchBtn.addEventListener('click', buscarEstudiante);
    dom.newBtn.addEventListener('click', nuevoRegistro);

    dom.btnEditSaved.addEventListener('click', () => {
      dom.savePanel.classList.remove('show');
      state.currentSection = 1;
      showSection(1);
      showAlert(`Puede editar el registro ${state.ultimoDocumentoGuardado || ''} y guardar de nuevo.`, 'info');
    });

    dom.btnCreateAnother.addEventListener('click', nuevoRegistro);

    dom.searchDoc.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        buscarEstudiante();
      }
    });
  }

  function init() {
    setupEventListeners();
    showSection(1);
    toggleConditionalBlocks();
    refreshStatsFromCloud();
  }

  init();
})();
