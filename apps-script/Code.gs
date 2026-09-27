/** Recepción pública de Caracterización. Nunca devuelve filas ni datos personales. */
const SHEET_ID_ = '1J5ZDBRDbSJJgnoZ4ilw7A0ZnK6FrK4wQWFQ5SUYGdq8';
const TAB_ID_ = 0;
const VERSION_ = '2026-09-27.1';
const FIELDS_ = ["anioCaracterizacion", "tipoDocumento", "numeroDocumento", "nombres", "apellidos", "fechaNacimiento", "edad", "sexo", "paisNacimiento", "nacionalidad", "departamentoNacimiento", "municipioNacimiento", "lenguaPrincipal", "lenguaSecundaria", "municipioResidencia", "barrioVereda", "direccionResidencia", "nombreAcudiente", "telefonoAcudiente", "nombreMadre", "telefonoMadre", "nombrePadre", "telefonoPadre", "tipoSangre", "perteneceEtnia", "tipoEtnia", "puebloIndigena", "tieneDiscapacidad", "categoriaDiscapacidad", "afiliadoSalud", "afiliadoSaludCual", "victimaConflicto", "tipoVictimizacion", "institucionEducativa", "gradoEscolar", "tipoVivienda", "servicioEnergia", "servicioAgua", "servicioAlcantarillado", "servicioInternet", "servicioGas", "servicioTelefoniaCelular", "servicioTelefoniaFija", "riesgoTerritorioDerrumbes", "riesgoTerritorioAvalanchas", "riesgoTerritorioInundaciones", "riesgoTerritorioGruposArmados", "riesgoTerritorioOtroCheck", "riesgoTerritorioOtro", "riesgoColegioBullying", "riesgoColegioDesercion", "riesgoColegioBajoRendimiento", "riesgoColegioConvivencia", "riesgoColegioOtroCheck", "riesgoColegioOtro", "entusiasmoMotivacion", "asignaturasFortalezas", "lugarEstudio", "estrategiasTiempoEscolar", "apoyoProfesoresDetalle", "interesesValorados", "adultoInspirador", "aprendizajeProyectoVida", "accionesSalud", "vulneracionDerechos", "orientacionSexualReproductiva", "informacionSexualidad", "riesgoSpa", "espaciosSaludMental", "manejoEmociones", "redApoyoEmocional", "expresarIdentidad", "metaFutura", "representadoEscuchado", "mejorarEquilibrioPersonal", "fechaDiligenciamientoInicial", "numeroHermanos", "embarazoPlaneado", "documentoMadre", "edadMadre", "escolaridadMadre", "ocupacionMadre", "sabeLeerMadre", "sabeEscribirMadre", "situacionLaboralMadre", "aportaEconomicoMadre", "madreCondicionDiscapacidad", "madreCondicionEnfermedad", "madreCondicionNinguna", "madreCondicionOtraCheck", "madreCondicionOtra", "padreNoAplica", "documentoPadre", "edadPadre", "escolaridadPadre", "ocupacionPadre", "sabeLeerPadre", "sabeEscribirPadre", "situacionLaboralPadre", "aportaEconomicoPadre", "padreCondicionDiscapacidad", "padreCondicionEnfermedad", "padreCondicionNinguna", "padreCondicionOtraCheck", "padreCondicionOtra", "acudienteNoAplica", "parentescoAcudiente", "edadAcudiente", "escolaridadAcudiente", "ocupacionAcudiente", "sabeLeerAcudiente", "sabeEscribirAcudiente", "situacionLaboralAcudiente", "aportaEconomicoAcudiente", "acudienteCondicionDiscapacidad", "acudienteCondicionEnfermedad", "acudienteCondicionNinguna", "acudienteCondicionOtraCheck", "acudienteCondicionOtra", "tipoViviendaFamiliar", "tenenciaPropia", "tenenciaArriendo", "tenenciaFamiliar", "tenenciaOtraCheck", "tenenciaOtra", "habitacionConAdultos", "camaConAdultos", "espaciosIndependientesHogar", "espaciosAseadosHogar", "familiarServicioEnergia", "familiarServicioAcueducto", "familiarServicioAlcantarillado", "familiarServicioGas", "familiarServicioInternet", "familiarServicioCelular", "familiarServicioFija", "entornoSalud", "entornoEscuela", "entornoTransporte", "entornoParques", "familiaComparteDificultades", "familiaComparteLogros", "familiaActividadesJuego", "familiaActividadesComunitarias", "familiaMotivoDisgustoEconomico", "familiaMotivoDisgustoComunicacion", "familiaNinosParticipanHogar", "familiaReconoceLogrosNinos"];
const OPTIONS_ = {"tipoDocumento": ["TI", "CC", "NUIP", "CE"], "sexo": ["M", "F"], "tipoSangre": ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−", "No conoce"], "tipoEtnia": ["Indigena", "Afrodescendiente", "Raizal", "Palenquero", "Gitano"], "categoriaDiscapacidad": ["Fisica", "Visual", "Auditiva", "Cognitiva", "Psicosocial", "Multiple", "Otra"], "victimaConflicto": ["Si", "No", "No informa"], "tipoVictimizacion": ["Desplazamiento forzado", "Otro hecho", "Varios hechos", "No informa"], "gradoEscolar": ["6", "7", "8", "9", "10", "11"], "tipoVivienda": ["Casa", "Apartamento", "Finca", "Cuarto", "Otro"], "numeroHermanos": ["0", "1", "2", "3", "4 o más"], "embarazoPlaneado": ["Si", "No", "No sabe"], "edadMadre": ["Menor de 20", "20 a 30", "31 a 40", "41 a 50", "51 o más"], "escolaridadMadre": ["Ninguna", "Primaria", "Secundaria", "Técnica/Tecnológica", "Universitaria"], "ocupacionMadre": ["Hogar", "Agricultura", "Comercio", "Empleo formal", "Empleo informal", "Otra"], "sabeLeerMadre": ["Si", "No"], "sabeEscribirMadre": ["Si", "No"], "aportaEconomicoMadre": ["Si", "No"], "edadPadre": ["Menor de 20", "20 a 30", "31 a 40", "41 a 50", "51 o más"], "escolaridadPadre": ["Ninguna", "Primaria", "Secundaria", "Técnica/Tecnológica", "Universitaria"], "ocupacionPadre": ["Hogar", "Agricultura", "Comercio", "Empleo formal", "Empleo informal", "Otra"], "sabeLeerPadre": ["Si", "No"], "sabeEscribirPadre": ["Si", "No"], "aportaEconomicoPadre": ["Si", "No"], "parentescoAcudiente": ["Abuelo/a", "Tío/a", "Hermano/a mayor", "Padrastro/Madrastra", "Otro familiar", "No familiar"], "edadAcudiente": ["Menor de 20", "20 a 30", "31 a 40", "41 a 50", "51 o más"], "escolaridadAcudiente": ["Ninguna", "Primaria", "Secundaria", "Técnica/Tecnológica", "Universitaria"], "ocupacionAcudiente": ["Hogar", "Agricultura", "Comercio", "Empleo formal", "Empleo informal", "Otra"], "sabeLeerAcudiente": ["Si", "No"], "sabeEscribirAcudiente": ["Si", "No"], "aportaEconomicoAcudiente": ["Si", "No"], "tipoViviendaFamiliar": ["Casa", "Apartamento", "Finca", "Cuarto", "Otro"], "perteneceEtnia": ["Si", "No"], "tieneDiscapacidad": ["Si", "No"], "afiliadoSalud": ["Si", "No"], "servicioEnergia": ["Si", "No"], "servicioAgua": ["Si", "No"], "servicioAlcantarillado": ["Si", "No"], "servicioInternet": ["Si", "No"], "servicioGas": ["Si", "No"], "servicioTelefoniaCelular": ["Si", "No"], "servicioTelefoniaFija": ["Si", "No"], "riesgoTerritorioDerrumbes": ["Si", "No"], "riesgoTerritorioAvalanchas": ["Si", "No"], "riesgoTerritorioInundaciones": ["Si", "No"], "riesgoTerritorioGruposArmados": ["Si", "No"], "riesgoTerritorioOtroCheck": ["Si", "No"], "riesgoColegioBullying": ["Si", "No"], "riesgoColegioDesercion": ["Si", "No"], "riesgoColegioBajoRendimiento": ["Si", "No"], "riesgoColegioConvivencia": ["Si", "No"], "riesgoColegioOtroCheck": ["Si", "No"], "lugarEstudio": ["Si", "No", "A veces"], "orientacionSexualReproductiva": ["Si", "No"], "madreCondicionDiscapacidad": ["Si", "No"], "madreCondicionEnfermedad": ["Si", "No"], "madreCondicionNinguna": ["Si", "No"], "madreCondicionOtraCheck": ["Si", "No"], "padreNoAplica": ["Si", "No"], "padreCondicionDiscapacidad": ["Si", "No"], "padreCondicionEnfermedad": ["Si", "No"], "padreCondicionNinguna": ["Si", "No"], "padreCondicionOtraCheck": ["Si", "No"], "acudienteNoAplica": ["Si", "No"], "acudienteCondicionDiscapacidad": ["Si", "No"], "acudienteCondicionEnfermedad": ["Si", "No"], "acudienteCondicionNinguna": ["Si", "No"], "acudienteCondicionOtraCheck": ["Si", "No"], "tenenciaPropia": ["Si", "No"], "tenenciaArriendo": ["Si", "No"], "tenenciaFamiliar": ["Si", "No"], "tenenciaOtraCheck": ["Si", "No"], "habitacionConAdultos": ["Si", "No"], "camaConAdultos": ["Si", "No"], "espaciosIndependientesHogar": ["Si", "No"], "espaciosAseadosHogar": ["Si", "No"], "familiarServicioEnergia": ["Si", "No"], "familiarServicioAcueducto": ["Si", "No"], "familiarServicioAlcantarillado": ["Si", "No"], "familiarServicioGas": ["Si", "No"], "familiarServicioInternet": ["Si", "No"], "familiarServicioCelular": ["Si", "No"], "familiarServicioFija": ["Si", "No"], "entornoSalud": ["Si", "No"], "entornoEscuela": ["Si", "No"], "entornoTransporte": ["Si", "No"], "entornoParques": ["Si", "No"], "familiaComparteDificultades": ["Si", "No"], "familiaComparteLogros": ["Si", "No"], "familiaActividadesJuego": ["Si", "No"], "familiaActividadesComunitarias": ["Si", "No"], "familiaMotivoDisgustoEconomico": ["Si", "No"], "familiaMotivoDisgustoComunicacion": ["Si", "No"], "familiaNinosParticipanHogar": ["Si", "No"], "familiaReconoceLogrosNinos": ["Si", "No"]};
const META_ = ['fechaRegistroISO', 'anioCaracterizacion', '_envioId'];

function sheet_() {
  const book = SpreadsheetApp.openById(SHEET_ID_);
  const tab = book.getSheets().find(s => s.getSheetId() === TAB_ID_);
  if (!tab) throw new Error('CONFIGURATION');
  return tab;
}
function output_(data, callback) {
  const json = JSON.stringify(data);
  if (callback && /^[a-zA-Z][a-zA-Z0-9_]{0,64}$/.test(callback)) {
    return ContentService.createTextOutput(callback + '(' + json + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}
function validId_(id) { return typeof id === 'string' && /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(id); }
function headers_(tab) {
  const count = tab.getLastColumn();
  return count ? tab.getRange(1, 1, 1, count).getDisplayValues()[0].map(String) : [];
}
function received_(tab, headers, id) {
  const col = headers.indexOf('_envioId');
  if (col < 0 || tab.getLastRow() < 2) return false;
  return !!tab.getRange(2, col + 1, tab.getLastRow() - 1, 1)
    .createTextFinder(id).matchEntireCell(true).useRegularExpression(false).findNext();
}
function validate_(input) {
  if (!input || Array.isArray(input) || typeof input !== 'object' || !validId_(input.requestId)) throw new Error('INVALID');
  const data = {};
  FIELDS_.forEach(key => {
    const value = input[key] == null ? '' : input[key];
    if (typeof value !== 'string' && typeof value !== 'number') throw new Error('INVALID');
    data[key] = String(value).trim();
    if (data[key].length > 5000) throw new Error('INVALID');
    if (data[key] && OPTIONS_[key] && !OPTIONS_[key].includes(data[key])) throw new Error('INVALID');
  });
  ["afiliadoSalud", "anioCaracterizacion", "apellidos", "barrioVereda", "fechaNacimiento", "gradoEscolar", "institucionEducativa", "lenguaPrincipal", "municipioResidencia", "nacionalidad", "nombres", "numeroDocumento", "paisNacimiento", "perteneceEtnia", "sexo", "telefonoAcudiente", "tieneDiscapacidad", "tipoDocumento", "tipoVivienda"].forEach(key => {
    if (!data[key]) throw new Error('INVALID');
  });
  if (!/^\d{4}$/.test(data.anioCaracterizacion) || +data.anioCaracterizacion < 2000 || +data.anioCaracterizacion > 2100) throw new Error('INVALID');
  if (!/^[a-zA-Z0-9 .-]{3,30}$/.test(data.numeroDocumento)) throw new Error('INVALID');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.fechaNacimiento)) throw new Error('INVALID');
  const birth = new Date(data.fechaNacimiento + 'T00:00:00Z');
  if (isNaN(birth.getTime()) || birth.toISOString().slice(0,10) !== data.fechaNacimiento || birth > new Date()) throw new Error('INVALID');
  const today = new Date();
  let age = today.getUTCFullYear() - birth.getUTCFullYear();
  if (today.getUTCMonth() < birth.getUTCMonth() || (today.getUTCMonth() === birth.getUTCMonth() && today.getUTCDate() < birth.getUTCDate())) age--;
  data.edad = String(age);
  // Los datos dependientes solo se guardan cuando la familia los ha declarado.
  if (data.perteneceEtnia !== 'Si') { data.tipoEtnia = ''; data.puebloIndigena = ''; }
  if (data.tipoEtnia !== 'Indigena') data.puebloIndigena = '';
  if (data.afiliadoSalud !== 'Si') data.afiliadoSaludCual = '';
  if (data.victimaConflicto !== 'Si') data.tipoVictimizacion = '';
  if (data.tieneDiscapacidad !== 'Si') data.categoriaDiscapacidad = '';
  return data;
}
function safeCell_(value) {
  const text = String(value == null ? '' : value);
  return /^[=+@-]/.test(text) ? "'" + text : text;
}
function doPost(e) {
  let id = ''; let lock;
  try {
    if (!e || !e.postData || e.postData.contents.length > 150000) throw new Error('INVALID');
    const input = JSON.parse(e.postData.contents);
    id = input.requestId;
    const data = validate_(input);
    lock = LockService.getScriptLock();
    if (!lock.tryLock(25000)) return output_({success:false, code:'BUSY'});
    const tab = sheet_();
    let headers = headers_(tab);
    if (received_(tab, headers, id)) return output_({success:true, requestId:id});
    // Solo añade columnas faltantes; no modifica ninguna fila importada.
    const extra = [...new Set(FIELDS_.concat(META_))].filter(k => !headers.includes(k));
    if (extra.length) {
      if (headers.length + extra.length > tab.getMaxColumns()) tab.insertColumnsAfter(tab.getMaxColumns(), headers.length + extra.length - tab.getMaxColumns());
      tab.getRange(1, headers.length + 1, 1, extra.length).setValues([extra]);
      headers = headers.concat(extra);
    }
    data.fechaRegistroISO = new Date().toISOString();
    // Mantener también la columna histórica que ya existe en la hoja.
    data.fechaRegistro = data.fechaRegistroISO;
    data._envioId = id;
    const row = Math.max(2, tab.getLastRow() + 1);
    if (row > tab.getMaxRows()) tab.insertRowsAfter(tab.getMaxRows(), 1);
    const target = tab.getRange(row, 1, 1, headers.length);
    target.setNumberFormat('@');
    target.setValues([headers.map(key => safeCell_(data[key] || ''))]);
    SpreadsheetApp.flush();
    CacheService.getScriptCache().put(id, 'received', 600);
    return output_({success:true, requestId:id});
  } catch (error) {
    const code = error.message === 'INVALID' ? 'INVALID' : 'UNAVAILABLE';
    if (validId_(id)) CacheService.getScriptCache().put(id, code, 120);
    return output_({success:false, code:code});
  } finally { if (lock && lock.hasLock()) lock.releaseLock(); }
}
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action === 'health') {
    try { sheet_().getLastColumn(); return output_({ready:true, version:VERSION_}, p.callback); }
    catch (_) { return output_({ready:false, code:'UNAVAILABLE'}, p.callback); }
  }
  if (p.action !== 'receipt' || !validId_(p.requestId)) return output_({success:false, code:'NOT_ALLOWED'}, p.callback);
  try {
    const cache = CacheService.getScriptCache().get(p.requestId);
    if (cache === 'received') return output_({success:true, requestId:p.requestId}, p.callback);
    // Un token aleatorio permite comprobar únicamente si llegó ese envío.
    const tab = sheet_();
    if (received_(tab, headers_(tab), p.requestId)) return output_({success:true, requestId:p.requestId}, p.callback);
    return output_({success:false, code:cache || 'PENDING', requestId:p.requestId}, p.callback);
  } catch (_) { return output_({success:false, code:'UNAVAILABLE'}, p.callback); }
}
// Solo para ejecutar desde el editor por el propietario. No modifica datos.
function verificarConexion() {
  const tab = sheet_();
  console.log('Conexión correcta. Hoja: ' + tab.getName() + '. Columnas: ' + tab.getLastColumn());
}
