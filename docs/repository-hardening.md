# Hardening do Repositorio (GitHub)

Este documento consolida o baseline de seguranca e colaboracao recomendado para este projeto.

## 1) Seguranca nativa do GitHub

No repositorio, acesse `Settings > Security` e habilite:

1. `Dependabot alerts`
2. `Dependabot security updates`
3. `Secret scanning`
4. `Push protection`
5. `Code scanning` (com CodeQL)
6. `Private vulnerability reporting`

Observacao: alguns recursos exigem GitHub Advanced Security em repositorios privados.

## 2) Estrategia de branches

Padrao recomendado:

- `main`: producao.
- `develop`: consolidacao de mudancas.
- `feature/*`: novas features.
- `fix/*`: correcoes.
- `hotfix/*`: correcoes urgentes em producao.

## 3) Branch protection rules

Configurar protecao para `main` e `develop`:

1. Bloquear pushes diretos.
2. Exigir pull request para merge.
3. Exigir ao menos 1 aprovacao de review (ideal 2 em mudancas criticas).
4. Exigir status checks antes de merge:
   - `quality-gate / quality-check`
   - `CodeQL / analyze`
   - `Secret Scan / gitleaks`
5. Exigir branch atualizada com base branch antes de merge.
6. Bloquear merge com conversas nao resolvidas.
7. (Opcional) Exigir commits assinados.

## 4) Politica de Pull Request

- Usar template de PR.
- Descrever impacto, risco e plano de teste.
- Manter PRs pequenas e focadas.
- Nao misturar refactor amplo com bugfix urgente.

## 5) Segredos e dados sensiveis

- Nunca versionar `.env`, chaves, certificados ou tokens.
- Rotacionar credenciais em caso de exposicao.
- Revisar arquivos antes de commit (`git diff --staged`).

## 6) Git LFS

Estado atual: o repositorio esta leve e nao exige LFS agora.

Use Git LFS se houver versionamento recorrente de arquivos binarios grandes, por exemplo:

- imagens/fotos brutas de evidencias (`*.psd`, `*.ai`, `*.tif`, `*.raw`);
- videos (`*.mp4`, `*.mov`);
- arquivos de design pesados;
- dumps de dados volumosos.

Evite versionar artefatos gerados como PDFs de atendimento. Eles devem ficar fora do Git (ja coberto no `.gitignore`).
