const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
function run() {
  const source=fs.readFileSync(path.join(__dirname,'../apps-script/Code.gs'),'utf8');
  const rows=[['tipoDocumento','numeroDocumento','nombres'],['TI','000111','Registro previo']];
  const cache=new Map();let locked=false;
  const sheet={getSheetId:()=>0,getLastColumn:()=>rows[0].length,getLastRow:()=>rows.length,getMaxColumns:()=>1000,getMaxRows:()=>1000,
    getRange(r,c,h,w){return {
      getDisplayValues:()=>Array.from({length:h},(_,i)=>Array.from({length:w},(_,j)=>String(rows[r-1+i]?.[c-1+j]??''))),
      setNumberFormat(){return this},
      setValues(values){values.forEach((v,i)=>{rows[r-1+i]??=[];v.forEach((x,j)=>rows[r-1+i][c-1+j]=x)});return this},
      createTextFinder(id){return {matchEntireCell(){return this},useRegularExpression(){return this},findNext(){return rows.slice(r-1,r-1+h).some(row=>row[c-1]===id)?{}:null}}}
    }}
  };
  const ctx=vm.createContext({console,SpreadsheetApp:{openById:()=>({getSheets:()=>[sheet]}),flush(){}},
    ContentService:{MimeType:{JSON:'json',JAVASCRIPT:'js'},createTextOutput:text=>({text,setMimeType(){return this}})},
    LockService:{getScriptLock:()=>({tryLock(){locked=true;return true},hasLock:()=>locked,releaseLock(){locked=false}})},
    CacheService:{getScriptCache:()=>({get:k=>cache.get(k),put:(k,v)=>cache.set(k,v)})}});
  vm.runInContext(source,ctx);
  const id='12345678-1234-4234-8234-123456789abc';
  const data={requestId:id,tipoDocumento:'TI',numeroDocumento:'12345678',nombres:'=FORMULA()',apellidos:'Prueba',fechaNacimiento:'2012-01-01',gradoEscolar:'6',telefonoAcudiente:'3000000000',anioCaracterizacion:'2026',municipioNacimiento:'Neiva',tipoSangre:'O+',victimaConflicto:'No',tipoVictimizacion:'Desplazamiento forzado'};
  Object.assign(data,{sexo:'M',paisNacimiento:'Colombia',nacionalidad:'Colombiana',lenguaPrincipal:'Español',municipioResidencia:'PRUEBA',barrioVereda:'PRUEBA',perteneceEtnia:'No',tieneDiscapacidad:'No',afiliadoSalud:'No',institucionEducativa:'IE Paulo VI',tipoVivienda:'Casa'});
  const post=x=>JSON.parse(ctx.doPost({postData:{contents:JSON.stringify(x)}}).text);
  assert.equal(post(data).success,true);assert.equal(rows.length,3);
  assert.deepEqual(rows[1],['TI','000111','Registro previo']);
  assert.equal(rows[2][rows[0].indexOf('nombres')],"'=FORMULA()");
  assert.equal(rows[2][rows[0].indexOf('municipioNacimiento')],'Neiva');
  assert.equal(rows[2][rows[0].indexOf('tipoVictimizacion')],'');
  assert.equal(post(data).success,true);assert.equal(rows.length,3);
  cache.clear();assert.equal(JSON.parse(ctx.doGet({parameter:{action:'receipt',requestId:id}}).text).success,true);
  assert.equal(JSON.parse(ctx.doGet({parameter:{action:'search',doc:'12345678'}}).text).code,'NOT_ALLOWED');
  assert.equal(post({...data,requestId:'12345678-1234-4234-8234-123456789abd',gradoEscolar:'5'}).code,'INVALID');
  assert.equal(rows.length,3);assert.equal(locked,false);
  for (const changes of [{nombres:''},{numeroDocumento:'x'},{sexo:'Otro valor'},{fechaNacimiento:'2026-02-30'},{fechaNacimiento:'2100-01-01'},{paisNacimiento:''},{telefonoAcudiente:''}]) {
    assert.equal(post({...data,...changes,requestId:'12345678-1234-4234-8234-123456789abe'}).code,'INVALID');
    assert.equal(rows.length,3);
  }
  assert.equal(JSON.parse(ctx.doGet({parameter:{action:'health'}}).text).ready,true);
  ctx.SpreadsheetApp.openById=()=>{throw Error('Denied')};
  assert.equal(JSON.parse(ctx.doGet({parameter:{action:'health'}}).text).ready,false);
  const receipt=ctx.doGet({parameter:{action:'receipt',requestId:id,callback:'receiptTest'}}).text;
  assert(receipt.startsWith('receiptTest('));assert(!receipt.includes('Neiva'));assert(!receipt.includes('Prueba'));
  assert(ctx.doGet({parameter:{action:'receipt',requestId:id,callback:'evil();'}}).text.startsWith('{'));
  for(const name of fs.readdirSync(path.join(__dirname,'../js')).filter(n=>n.endsWith('.js'))) {
    const js=fs.readFileSync(path.join(__dirname,'../js',name),'utf8').replace(/^import .*;\n/gm,'').replace(/\bexport /g,'');
    new vm.Script(js,{filename:name});
  }
  return 'Pruebas correctas: conservación de filas, campos nuevos, reintentos sin duplicados, validación de grado, texto seguro, confirmación sin datos personales y sintaxis JS.';
}
module.exports=run;
if(require.main===module)console.log(run());
