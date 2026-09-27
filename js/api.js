// Solo envío y confirmación anónima mediante un identificador aleatorio por intento.
let lastAttempt = null;
function endpoint(config) {
  if (!config.googleScriptUrl) throw new Error('El docente todavía no ha habilitado la recepción.');
  const url = new URL(config.googleScriptUrl);
  if (url.protocol !== 'https:' || url.hostname !== 'script.google.com' || !url.pathname.endsWith('/exec')) throw new Error('La conexión de recepción no está configurada correctamente.');
  return url;
}
function receipt(url, requestId) {
  return new Promise((resolve, reject) => {
    const callback = 'carReceipt_' + crypto.randomUUID().replaceAll('-', '');
    const script = document.createElement('script');
    let timer;
    function cleanup() { clearTimeout(timer); script.remove(); delete window[callback]; }
    window[callback] = data => { cleanup(); resolve(data); };
    script.onerror = () => { cleanup(); reject(new Error('No se pudo consultar la confirmación.')); };
    timer = setTimeout(() => { cleanup(); reject(new Error('Google tardó demasiado en confirmar.')); }, 10000);
    const query = new URL(url);
    query.searchParams.set('action','receipt');
    query.searchParams.set('requestId',requestId);
    query.searchParams.set('callback',callback);
    script.src = query.href;
    script.referrerPolicy = 'no-referrer';
    document.head.append(script);
  });
}
export async function saveRecord(config, payload) {
  const url = endpoint(config);
  const fingerprint = JSON.stringify(payload);
  if (!lastAttempt || lastAttempt.fingerprint !== fingerprint) {
    lastAttempt = { fingerprint, requestId: crypto.randomUUID() };
  }
  const { requestId } = lastAttempt;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(),25000);
  try {
    await fetch(url, {
      method:'POST', mode:'no-cors', credentials:'omit', redirect:'follow',
      headers:{'Content-Type':'text/plain;charset=utf-8'},
      body:JSON.stringify({...payload,requestId}), signal:controller.signal
    });
  } catch (_) {
    // Una interrupción de red no prueba que el servidor no haya guardado el envío.
  } finally { clearTimeout(timeout); }
  for (let attempt = 0; attempt < 5; attempt++) {
    let result;
    try { result = await receipt(url,requestId); } catch (_) { result = null; }
    if (result?.success === true && result.requestId === requestId) {
      lastAttempt = null;
      return {confirmed:true};
    }
    if (result?.code === 'INVALID') throw new Error('Revisa los datos obligatorios, la fecha de nacimiento y el grado (6° a 11°). Google no aceptó el registro.');
    if (attempt < 4) await new Promise(resolve => setTimeout(resolve,1500));
  }
  throw new Error('No se pudo confirmar el guardado. Mantén esta pestaña abierta y vuelve a enviar sin cambiar los datos: el mismo intento no creará un duplicado.');
}
