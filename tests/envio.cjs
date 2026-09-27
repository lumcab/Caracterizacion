const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const {webcrypto} = require('node:crypto');
const path = require('node:path');

async function scenario(replies, failPost = false) {
  const posts = [];
  let replyIndex = 0;
  const window = {};
  const ctx = vm.createContext({URL, AbortController, crypto: webcrypto, window,
    setTimeout: (fn, ms) => ms === 1500 ? setTimeout(fn, 0) : setTimeout(fn, ms), clearTimeout,
    fetch: async (_, opts) => { posts.push(JSON.parse(opts.body)); if (failPost) throw Error('network'); return {type:'opaque'}; },
    document: {createElement: () => ({remove(){}}), head: {append(script) {
      const url = new URL(script.src);
      const reply = replies[Math.min(replyIndex++, replies.length - 1)];
      queueMicrotask(() => window[url.searchParams.get('callback')]({...reply, requestId: url.searchParams.get('requestId')}));
    }}}
  });
  vm.runInContext(fs.readFileSync(path.join(__dirname,'../js/api.js'),'utf8').replace('export async function','async function'),ctx);
  const config = {googleScriptUrl:'https://script.google.com/macros/s/TEST/exec'};
  return {posts, send: payload => ctx.saveRecord(config,payload)};
}

(async () => {
  const payload = {nombres:'PRUEBA', numeroDocumento:'PRUEBA-2026'};
  const ok = await scenario([{success:true}]);
  assert.equal((await ok.send(payload)).confirmed,true);
  const uncertain = await scenario([{success:false,code:'PENDING'}]);
  await assert.rejects(uncertain.send(payload), /No se pudo confirmar/);
  await assert.rejects(uncertain.send(payload), /No se pudo confirmar/);
  assert.equal(uncertain.posts[0].requestId,uncertain.posts[1].requestId,'Un reintento conserva el identificador');
  const savedDespiteNetwork = await scenario([{success:true}],true);
  assert.equal((await savedDespiteNetwork.send(payload)).confirmed,true);
  const invalid = await scenario([{success:false,code:'INVALID'}]);
  await assert.rejects(invalid.send(payload), /Google no aceptó/);
  console.log('Envío correcto: exige confirmación, conserva el ID al reintentar y distingue validación de fallos de red.');
})().catch(error => {console.error(error);process.exitCode=1;});
