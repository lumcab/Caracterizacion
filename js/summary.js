export function setupSummary(form) {
  const year = form.elements.anioCaracterizacion;
  if (!year.value) year.value = new Date().getFullYear();
  const value = name => String(form.elements[name]?.value || '').trim();
  const reported = name => value(name) || 'Sin registrar';
  const facts = document.getElementById('quickFacts');
  const groups = [
    ['Nacimiento', () => [value('municipioNacimiento'), value('departamentoNacimiento'), value('paisNacimiento')].filter(Boolean).join(' · ') || 'Sin registrar'],
    ['Residencia', () => [value('direccionResidencia'), value('barrioVereda'), value('municipioResidencia')].filter(Boolean).join(' · ') || 'Sin registrar'],
    ['Acudiente / tutor', () => [value('nombreAcudiente'), value('telefonoAcudiente')].filter(Boolean).join(' · ') || 'Sin registrar'],
    ['Madre', () => [value('nombreMadre'), value('telefonoMadre')].filter(Boolean).join(' · ') || 'Sin registrar'],
    ['Padre', () => [value('nombrePadre'), value('telefonoPadre')].filter(Boolean).join(' · ') || 'Sin registrar'],
    ['Grupo sanguíneo', () => reported('tipoSangre')],
    ['EPS / entidad de salud', () => value('afiliadoSalud') === 'No' ? 'Sin afiliación' : reported('afiliadoSaludCual')],
    ['Pertenencia étnica', () => value('perteneceEtnia') === 'No' ? 'No pertenece' : [value('tipoEtnia'), value('puebloIndigena')].filter(Boolean).join(' · ') || 'Sin registrar'],
    ['Víctima del conflicto', () => value('victimaConflicto') === 'Si' ? `Sí · ${reported('tipoVictimizacion')}` : reported('victimaConflicto')]
  ];
  function update() {
    document.getElementById('summaryName').textContent = [value('nombres'),value('apellidos')].filter(Boolean).join(' ') || 'Nuevo estudiante';
    document.getElementById('summaryDocument').textContent = value('numeroDocumento') ? `${value('tipoDocumento')} · ${value('numeroDocumento')}` : 'Completa los datos del estudiante';
    document.getElementById('annualFileName').textContent = 'caracterizacion';
    document.querySelectorAll('[data-school-year]').forEach(el => el.textContent = year.value || new Date().getFullYear());
    facts.replaceChildren(...groups.map(([label, getValue]) => {
      const div = document.createElement('div');
      const dt = document.createElement('dt'); dt.textContent = label;
      const dd = document.createElement('dd'); dd.textContent = getValue();
      div.append(dt,dd); return div;
    }));
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('record-filled', update);
  form.addEventListener('reset', () => queueMicrotask(() => { year.value = new Date().getFullYear(); update(); }));
  update();
  return update;
}
