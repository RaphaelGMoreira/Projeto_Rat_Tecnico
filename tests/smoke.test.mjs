import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const arquivosCriticos = [
  'index.html',
  'src/css/styles.css',
  'src/js/rat-regras-negocio.js',
  'src/js/rat-validacoes-formulario.js',
  'src/js/rat-gerador-pdf.js',
  'src/js/rat-aplicacao.js',
];

test('arquivos criticos existem', () => {
  for (const arquivo of arquivosCriticos) {
    assert.equal(existsSync(arquivo), true, `Arquivo ausente: ${arquivo}`);
  }
});

test('index.html referencia os assets principais', () => {
  const html = readFileSync('index.html', 'utf8');

  const referenciasEsperadas = [
    'src/css/styles.css',
    'src/js/rat-regras-negocio.js',
    'src/js/rat-validacoes-formulario.js',
    'src/js/rat-gerador-pdf.js',
    'src/js/rat-aplicacao.js',
  ];

  for (const referencia of referenciasEsperadas) {
    assert.match(
      html,
      new RegExp(referencia.replace('.', '\\.')),
      `Referencia ausente no index.html: ${referencia}`
    );
  }
});

test('arquivos JavaScript passam em node --check', () => {
  const arquivosJs = [
    'src/js/rat-regras-negocio.js',
    'src/js/rat-validacoes-formulario.js',
    'src/js/rat-gerador-pdf.js',
    'src/js/rat-aplicacao.js',
  ];

  for (const arquivo of arquivosJs) {
    execFileSync(process.execPath, ['--check', arquivo], { stdio: 'pipe' });
  }
});
