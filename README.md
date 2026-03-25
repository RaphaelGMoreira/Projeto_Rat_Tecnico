# RAT ARKLOK - Relatorio de Atendimento Tecnico

Aplicacao web em HTML/CSS/JavaScript para preenchimento de RAT (Relatorio de Atendimento Tecnico), com validacoes de formulario, assinaturas em canvas, geracao de PDF e script padrao de fechamento.

## Objetivo do projeto

Padronizar o registro de atendimentos tecnicos em campo, garantindo:

- preenchimento consistente dos dados de chamado, tecnico, cliente e equipamentos;
- validacoes de negocio antes do envio;
- registro de assinaturas tecnico/cliente;
- geracao de evidencias em PDF para rastreabilidade.

## Funcionalidades principais

- formulario completo de RAT com secoes por contexto;
- validacao de campos obrigatorios, horarios e quilometragem;
- sanitizacao de campos numericos (telefone, patrimonio, serie etc.);
- validacao de assinatura tecnica e do cliente via canvas;
- geracao de PDF com layout padronizado (jsPDF);
- geracao de script de fechamento para compartilhamento rapido.

## Tecnologias utilizadas

- `HTML5`
- `CSS3`
- `JavaScript (ES6+, sem framework)`
- `jsPDF` (via CDN)

## Estrutura de pastas

```text
.
|-- .github/
|   |-- dependabot.yml
|   |-- pull_request_template.md
|   `-- workflows/
|       |-- codeql.yml
|       |-- quality-gate.yml
|       `-- secret-scan.yml
|-- tests/
|   `-- smoke.test.mjs
|-- docs/
|   `-- repository-hardening.md
|-- src/
|   |-- css/
|   |   `-- styles.css
|   `-- js/
|       |-- rat-aplicacao.js
|       |-- rat-gerador-pdf.js
|       |-- rat-regras-negocio.js
|       `-- rat-validacoes-formulario.js
|-- index.html
|-- CODE_OF_CONDUCT.md
|-- CONTRIBUTING.md
|-- SECURITY.md
|-- CITATION.cff
|-- LICENSE
|-- eslint.config.cjs
|-- .prettierrc.json
|-- package.json
|-- package-lock.json
`-- .gitignore
```

## Pre-requisitos

- navegador moderno (Chrome, Edge, Firefox ou Safari);
- opcional para checagens locais: `Node.js 20+`.

## Como instalar

1. Clone o repositorio:

```bash
git clone <URL_DO_REPOSITORIO>
cd <PASTA_DO_REPOSITORIO>
```

2. Instale dependencias de qualidade (lint/test):

```bash
npm ci
```

## Como executar

Opcao 1 (mais simples):

1. Abra o arquivo `index.html` no navegador.

Opcao 2 (servidor local recomendado):

```bash
npx --yes http-server . -p 8080
```

Depois acesse `http://localhost:8080/index.html`.

## Como testar

### Validacao automatica (recomendada)

```bash
npm run check
```

Comandos isolados:

```bash
npm run lint
npm test
npm run test:syntax
npm run format
```

### Checklist manual funcional

1. Preencher formulario com dados validos.
2. Validar bloqueio quando `KM FINAL <= KM INICIAL`.
3. Validar bloqueio quando `HORARIO TERMINO < HORARIO INICIO`.
4. Tentar gerar PDF sem assinaturas e confirmar bloqueio.
5. Assinar tecnico e cliente, gerar PDF e validar download.
6. Gerar script de fechamento e validar conteudo.

## Como contribuir

Leia [CONTRIBUTING.md](CONTRIBUTING.md) para fluxo de branches, padrao de commit e criterios de PR.

## Exemplo de uso

1. Tecnico preenche os dados do chamado e do cliente.
2. Tecnico registra informacoes de equipamento antigo/novo.
3. Tecnico descreve sintoma e relatorio de fechamento.
4. Tecnico coleta assinatura de ambas as partes.
5. Tecnico clica em `Gerar PDF` para salvar a RAT.
6. Tecnico clica em `Abrir Script de Fechamento` para compartilhar resumo operacional.

## Seguranca

- Politica de seguranca em [SECURITY.md](SECURITY.md).
- Guia de hardening e protecoes de branch em [docs/repository-hardening.md](docs/repository-hardening.md).

## Suporte

- Abra uma issue no repositorio para duvidas, bugs e sugestoes.
- Para temas sensiveis de seguranca, use o fluxo privado descrito em `SECURITY.md`.

## Licenca

Este projeto esta licenciado sob a [MIT License](LICENSE).
