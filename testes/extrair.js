/* Extrai os códigos em C e Python de data/*.js para testes/out/, para compilar e rodar.
   Uso: node testes/extrair.js && bash testes/rodar.sh */
const fs = require('fs'), path = require('path');
global.window = global;
const raiz = path.join(__dirname, '..');
for (const f of fs.readdirSync(path.join(raiz, 'data')).sort()) require(path.join(raiz, 'data', f));
const out = path.join(__dirname, 'out');
fs.rmSync(out, {recursive:true, force:true}); fs.mkdirSync(out);
for (const m of MODS) {
  fs.writeFileSync(`${out}/${m.id}__main.c`, m.codigo.c); fs.writeFileSync(`${out}/${m.id}__main.py`, m.codigo.py);
  (m.prog || []).forEach((p, i) => { fs.writeFileSync(`${out}/${m.id}__ex${i}.c`, p.c); fs.writeFileSync(`${out}/${m.id}__ex${i}.py`, p.py); });
  m.quiz.forEach((q, i) => { if (q.ok >= q.ops.length) console.log('alternativa correta inválida', m.id, i); });
}
console.log(`${MODS.length} módulos extraídos para testes/out`);
