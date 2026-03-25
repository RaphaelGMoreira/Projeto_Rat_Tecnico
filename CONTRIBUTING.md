# Guia de Contribuicao

Obrigado por contribuir com o projeto RAT ARKLOK.

## Fluxo de colaboracao (branches)

Este repositorio prioriza colaboracao via branches (sem fork para contribuidores frequentes):

- `main`: producao, sempre estavel.
- `develop`: integracao continua.
- `feature/*`: novas funcionalidades.
- `fix/*`: correcoes nao urgentes.
- `hotfix/*`: correcoes urgentes para producao.

Exemplos:

- `feature/assinatura-touch-mobile`
- `fix/validacao-email-cliente`
- `hotfix/pdf-garantir-download`

## Processo recomendado

1. Atualize sua branch local:
   ```bash
   git checkout develop
   git pull origin develop
   ```
2. Crie sua branch de trabalho:
   ```bash
   git checkout -b feature/minha-melhoria
   ```
3. Implemente e valide localmente.
4. Abra PR para `develop` (ou `main` em caso de `hotfix/*`).

## Padrao de commits

Use Conventional Commits:

- `feat: adiciona validacao de horario`
- `fix: corrige sanitizacao de patrimonio`
- `docs: atualiza README`
- `chore: ajusta workflow de CI`
- `refactor: simplifica modulo de validacoes`

## Criterios para Pull Request

Todo PR deve:

1. Descrever problema e solucao.
2. Informar risco de regressao.
3. Incluir evidencias de teste (manual ou automatizado).
4. Passar nos status checks.
5. Ter ao menos 1 aprovacao de review (recomendado 2 para mudancas criticas).

Use o template em `.github/pull_request_template.md`.

## Validacao local minima

Execute antes de abrir PR:

```bash
npm ci
npm run check
```

## Boas praticas adicionais

- Evite PRs muito grandes; prefira mudancas incrementais.
- Nao misture refactor amplo com bugfix critico no mesmo PR.
- Mantenha nomes de funcoes e variaveis claros e consistentes.
- Documente decisoes tecnicas relevantes no README ou em `docs/`.
