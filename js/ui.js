function normalizeKey(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();
}

export function createUI(config) {
  const dom = {
    form: document.getElementById('caracterizacionForm'),
    sections: config.sectionIds.map((id) => document.getElementById(id)),
    progressItems: Array.from(document.querySelectorAll('.progress-item')),
    searchDoc: document.getElementById('searchDoc'),
    searchBtn: document.getElementById('searchBtn'),
    newBtn: document.getElementById('newBtn'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    submitBtn: document.getElementById('submitBtn'),
    totalEstudiantes: document.getElementById('totalEstudiantes'),
    ultimaActualizacion: document.getElementById('ultimaActualizacion'),
    conexionEstado: document.getElementById('conexionEstado'),
    alertContainer: document.getElementById('alertContainer'),
    loadingIndicator: document.getElementById('loadingIndicator'),
    savePanel: document.getElementById('savePanel'),
    savePanelText: document.getElementById('savePanelText'),
    btnEditSaved: document.getElementById('btnEditSaved'),
    btnCreateAnother: document.getElementById('btnCreateAnother'),
    fechaNacimiento: document.getElementById('fechaNacimiento'),
    edad: document.getElementById('edad'),
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
    }, 4800);
  }

  function showSection(index) {
    dom.sections.forEach((section, i) => {
      section.classList.toggle('active', i === index);
    });

    dom.progressItems.forEach((item, i) => {
      item.classList.toggle('active', i === index);
      item.classList.toggle('done', i < index);
    });
  }

  function updateNavButtons(isFirst, isLast, isSubmitting) {
    dom.prevBtn.classList.toggle('hidden', isFirst);
    dom.nextBtn.classList.toggle('hidden', isLast);
    dom.submitBtn.classList.toggle('hidden', !isLast);

    dom.prevBtn.disabled = isSubmitting;
    dom.nextBtn.disabled = isSubmitting;
    dom.submitBtn.disabled = isSubmitting;
  }

  function setSubmitting(value) {
    dom.loadingIndicator.classList.toggle('show', value);
    dom.conexionEstado.textContent = value ? 'Guardando...' : 'Lista';
    const baseLabel = dom.submitBtn.dataset.baseLabel || 'Guardar Registro';
    dom.submitBtn.textContent = value ? 'Guardando...' : baseLabel;
  }

  function setSubmitActionLabel(label) {
    dom.submitBtn.dataset.baseLabel = label;
    dom.submitBtn.textContent = label;
  }

  function updateStats(stats) {
    dom.totalEstudiantes.textContent = stats.total ?? '-';
    dom.ultimaActualizacion.textContent = formatDate(stats.ultima);
  }

  function formatDate(value) {
    if (!value || value === '-') return '-';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleString('es-CO');
  }

  function serializeForm() {
    const data = new FormData(dom.form);
    const out = {};
    for (const [key, value] of data.entries()) out[key] = value;
    return out;
  }

  function fillForm(data) {
    if (!data || typeof data !== 'object') return;

    const alias = {
      numerodocumento: 'numeroDocumento',
      documento: 'numeroDocumento',
      doc: 'numeroDocumento',
      numerodoc: 'numeroDocumento',
      identificacion: 'numeroDocumento',
      documentodeidentidad: 'numeroDocumento',
      tipodocumento: 'tipoDocumento',
      nombre: 'nombres',
      apellido: 'apellidos'
    };

    const formNameByNormalized = {};
    Array.from(dom.form.elements).forEach((element) => {
      if (!element?.name) return;
      const norm = normalizeKey(element.name);
      if (!formNameByNormalized[norm]) formNameByNormalized[norm] = element.name;
    });

    Object.keys(data).forEach((rawKey) => {
      const rawNorm = normalizeKey(rawKey);
      const key = alias[rawNorm] || formNameByNormalized[rawNorm] || rawKey;
      const element = dom.form.elements[key];
      if (!element) return;

      if (element instanceof RadioNodeList) {
        const rawValue = String(data[rawKey] ?? '').trim();
        const lower = rawValue.toLowerCase();
        const fixedValue = lower === 'sí' || lower === 'si' ? 'Si' : (lower === 'no' ? 'No' : rawValue);
        const option = dom.form.querySelector(`input[name="${key}"][value="${fixedValue}"]`);
        if (option) option.checked = true;
        return;
      }

      element.value = data[rawKey];
    });

    toggleConditional();
  }

  function clearForm() {
    dom.form.reset();
    dom.searchDoc.value = '';
    hideSavePanel();
    toggleConditional();
  }

  function showSavePanel(message) {
    dom.savePanelText.textContent = message;
    dom.savePanel.classList.add('show');
  }

  function hideSavePanel() {
    dom.savePanel.classList.remove('show');
  }

  function validateSection(sectionIndex, requiredMessage) {
    const section = dom.sections[sectionIndex];
    const requiredFields = section.querySelectorAll('[required]');

    for (const field of requiredFields) {
      if (field.type === 'radio') {
        const checked = section.querySelector(`input[name="${field.name}"]:checked`);
        if (!checked) {
          showAlert(requiredMessage, 'danger');
          return false;
        }
        continue;
      }

      if (!String(field.value || '').trim()) {
        field.focus();
        showAlert(requiredMessage, 'danger');
        return false;
      }
    }

    return true;
  }

  function calculateAge() {
    const date = new Date(`${dom.fechaNacimiento.value}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
      dom.edad.value = '';
      return;
    }

    const now = new Date();
    let age = now.getFullYear() - date.getFullYear();
    const monthDiff = now.getMonth() - date.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < date.getDate())) age -= 1;
    dom.edad.value = Math.max(age, 0);
  }

  function toggleConditional() {
    const discapacidad = dom.form.querySelector('input[name="tieneDiscapacidad"]:checked');
    const etnia = dom.form.querySelector('input[name="perteneceEtnia"]:checked');
    const tipoEtnia = dom.form.elements.tipoEtnia ? dom.form.elements.tipoEtnia.value : '';

    dom.categoriaDiscapacidadGroup.classList.toggle('hidden', discapacidad?.value !== 'Si');
    dom.tipoEtniaGroup.classList.toggle('hidden', etnia?.value !== 'Si');
    dom.puebloIndigenaGroup.classList.toggle('hidden', tipoEtnia !== 'Indigena');
  }

  return {
    dom,
    showAlert,
    showSection,
    updateNavButtons,
    setSubmitting,
    setSubmitActionLabel,
    updateStats,
    serializeForm,
    fillForm,
    clearForm,
    showSavePanel,
    hideSavePanel,
    validateSection,
    calculateAge,
    toggleConditional
  };
}
